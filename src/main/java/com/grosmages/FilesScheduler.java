package com.grosmages;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.GroupPrincipal;
import java.nio.file.attribute.PosixFileAttributeView;
import java.nio.file.attribute.PosixFileAttributes;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.UserPrincipal;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.thymeleaf.util.StringUtils;

import com.grosmages.config.PropertiesConfig;
import com.grosmages.constants.Patterns;
import com.grosmages.entities.Album;
import com.grosmages.entities.Photo;
import com.grosmages.entities.Rights;
import com.grosmages.entities.SystemGroupLocal;
import com.grosmages.entities.User;
import com.grosmages.filesscan.FilesUtil;
import com.grosmages.repositories.AlbumRepository;
import com.grosmages.repositories.PhotoRepository;
import com.grosmages.repositories.SystemGroupLocalRepository;
import com.grosmages.repositories.UserRepository;

import lombok.AllArgsConstructor;
import lombok.Data;

@Component
public class FilesScheduler {
	
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private ApplicationContext context;
	
	@Autowired
	private PropertiesConfig properties;
	
	@Autowired
	private PhotoRepository photoRepository;
	
	@Autowired
	private AlbumRepository albumRepository;

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private SystemGroupLocalRepository systemGroupLocalRepository;	
	
	@Autowired
	private FilesUtil filesUtil;
	
	@Scheduled(cron="0 0 * * * *")
//	@Scheduled(fixedRate = 600000)
	public void scanFiles() {		
		properties.getFolders().forEach(folder -> {
			logger.info("Scanning " + folder);
			filesUtil.findFilesInDirectory(folder, Pattern.compile(Patterns.IMAGE_PATTERN, Pattern.CASE_INSENSITIVE))
			.stream()
			.forEach(path -> {
				String wholePath = path.getParent().toString() + File.separator + path.getFileName().toString();
				logger.info("Handling " + wholePath);
				Photo photoInDatabase = photoRepository.findByPathAndName(path.getParent().toString(), path.getFileName().toString());
				
				if(photoInDatabase == null) {
					logger.info("Inserting photo " + wholePath);
					createPhoto(path);
				} else {
					logger.info("Photo " + wholePath + "already in the database");
				}
			});
		});
	}
	
	private void createPhoto(Path path) {
		Photo photo = context.getBean(Photo.class);
		photo.setName(path.getFileName().toString());
		photo.setPath(path.getParent().toString());
		photo.setRights(generateRightsFromRightsPath(readAttributes(path)));
		
		try {
			Image image = ImageIO.read(new File(photo.getPath() + File.separator + photo.getName()))
					.getScaledInstance(200, 200, BufferedImage.SCALE_SMOOTH);
			
			BufferedImage bufferedImage = new BufferedImage(image.getWidth(null), image.getHeight(null), BufferedImage.TYPE_INT_RGB);
			Graphics2D g2 = bufferedImage.createGraphics();
			g2.drawImage(image, null, null);

			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			ImageIO.write(bufferedImage, "jpg", outStream); 
			InputStream is = new ByteArrayInputStream(outStream.toByteArray());
			
			photo.setThumnail(IOUtils.toByteArray(is));
		} catch (IOException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
			return;
		} catch (NullPointerException npe) {
			logger.error(npe.getMessage());
			npe.printStackTrace();
			return;
		}
		createAlbums(photo);
		photoRepository.save(photo);
	}
	
	/**
	 * Creates the album hierarchy of albums regarding the photo.
	 * @param photo
	 */
	void createAlbums(Photo photo) {
		Album parentAlbum = null;
		String folderPathParts = File.separator;
		for(String folder : photo.getPath().split(File.separator)) {
			if (!StringUtils.isEmpty(folder)) {
				folderPathParts = folderPathParts + folder + File.separator;
				if (!folder.equals(photo.getName())) {
					Album album = albumRepository.findByPath(folderPathParts);
					if(album == null) {
						album = context.getBean(Album.class);
						album.setName(folder);
						album.setPath(folderPathParts);
						album.setRights(generateRightsFromRightsPath(readAttributes(Paths.get(folderPathParts))));
						
						if (parentAlbum != null) {
							album.setIsRoot(false);
							album = albumRepository.save(album);
							
							Set<Album> sons = parentAlbum.getSons();
							if (sons == null)	sons = new HashSet<>();
							
							sons.add(album);
							parentAlbum.setSons(sons);
							
							parentAlbum = albumRepository.save(parentAlbum);
						} else {
							album.setIsRoot(true);
							album = albumRepository.save(album);
						}
					}
					
					parentAlbum = album;
				}
			}
		}
		if (parentAlbum != null) {
			photo.setAlbum(parentAlbum);
		}
	}
	
	RightsPath readAttributes(Path path) {
		PosixFileAttributes attr;
		try {
			attr = Files.readAttributes(path,PosixFileAttributes.class);
		    attr = Files.getFileAttributeView(path, PosixFileAttributeView.class)
		        .readAttributes();
	
		    attr.owner();
		    
		    return new RightsPath(attr.owner(), attr.group(), attr.permissions());
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	Rights generateRightsFromRightsPath(RightsPath rightPath) {
		Rights toReturn = context.getBean(Rights.class);
		
		if (rightPath == null) {
			return null;
		}
		
		User user = userRepository.findByNameOrUid(rightPath.ownerName.toString(), rightPath.ownerName.toString()).orElse(null);
		if (user == null) {
			logger.error("Cannot find user: {}", rightPath.ownerName.toString());
		} else {
			toReturn.setOwner(user);
		}
		
		SystemGroupLocal systemGroupLocal = systemGroupLocalRepository.findByNameOrGid(rightPath.groupName.toString(), rightPath.groupName.toString()).orElse(null);
		if (systemGroupLocal == null) {
			logger.error("Cannot find group: {}", rightPath.groupName.toString());
		} else {
			toReturn.setSystemGroupLocal(systemGroupLocal);
		}
		
		toReturn.setOwnerRead(rightPath.getAttributes().contains(PosixFilePermission.OWNER_READ));
		toReturn.setOwnerWrite(rightPath.getAttributes().contains(PosixFilePermission.OWNER_WRITE));
		toReturn.setGroupRead(rightPath.getAttributes().contains(PosixFilePermission.GROUP_READ));
		toReturn.setGroupWrite(rightPath.getAttributes().contains(PosixFilePermission.GROUP_WRITE));
		toReturn.setOthersRead(rightPath.getAttributes().contains(PosixFilePermission.OTHERS_READ));
		toReturn.setOwnerWrite(rightPath.getAttributes().contains(PosixFilePermission.OTHERS_WRITE));
		
		return toReturn;
	}
	
	@Data
	@AllArgsConstructor
	private class RightsPath {
		UserPrincipal ownerName;
		GroupPrincipal groupName;
		Set<PosixFilePermission> attributes;
	}
}
