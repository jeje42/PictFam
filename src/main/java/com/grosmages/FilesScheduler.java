package com.grosmages;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
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

import com.grosmages.constants.Patterns;
import com.grosmages.entities.Album;
import com.grosmages.entities.Photo;
import com.grosmages.filesscan.FilesUtil;

@Component
public class FilesScheduler {
	
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private ApplicationContext context;
	
	@Autowired
	private PropertiesFolder propertiesFolder;
	
	@Autowired
	private PhotoRepository photoRepository;
	
	@Autowired
	private AlbumRepository albumRepository;
	
	@Autowired
	private FilesUtil filesUtil;
	
//	@Scheduled(cron="0 * * * * *")
	@Scheduled(fixedRate = 600000)
	public void scanFiles() {		
		propertiesFolder.getImages().forEach(folder -> {
			logger.info("Scanning " + folder);
			filesUtil.findFilesInDirectory(folder, Pattern.compile(Patterns.IMAGE_PATTERN, Pattern.CASE_INSENSITIVE))
			.stream()
			.forEach(path -> {
				String wholePath = path.getParent().toString() + File.separator + path.getFileName().toString();
				logger.info("Handling " + wholePath);
				Photo photoInDatabase = photoRepository.findByPath(wholePath);
				
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
		createCategories(photo);
		photoRepository.save(photo);
	}
	
	private void createCategories(Photo photo) {
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
}
