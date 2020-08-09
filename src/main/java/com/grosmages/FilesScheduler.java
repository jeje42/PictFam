package com.grosmages;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.GroupPrincipal;
import java.nio.file.attribute.PosixFileAttributeView;
import java.nio.file.attribute.PosixFileAttributes;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.UserPrincipal;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;

import com.grosmages.entities.*;
import com.grosmages.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.thymeleaf.util.StringUtils;

import com.grosmages.config.PropertiesConfig;
import com.grosmages.constants.Patterns;
import com.grosmages.filesscan.FilesUtil;

import lombok.AllArgsConstructor;
import lombok.Data;

import static org.apache.commons.io.IOUtils.toByteArray;

@Component
public class FilesScheduler {
	
	Logger logger = LoggerFactory.getLogger(this.getClass());

	private final static String VIDEO_THUMNAIL_TEMP_PATH = "/tmp/thumnailVideo.png";
	
	@Autowired
	private ApplicationContext context;
	
	@Autowired
	private PropertiesConfig properties;
	
	@Autowired
	private PhotoRepository photoRepository;

	@Autowired
	private VideoRepository videoRepository;
	
	@Autowired
	private AlbumRepository albumRepository;

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private SystemGroupLocalRepository systemGroupLocalRepository;	
	
	@Autowired
	private FilesUtil filesUtil;

	public enum SCAN_TYPE {
		IMAGE, VIDEO
	}
	
//	@Scheduled(cron="0 0 * * * *")  // Every hour at 0 minutes
//	@Scheduled(fixedRate = 600000)
	public void scanFiles(SCAN_TYPE scantype) {
		logger.info("Beginning scanning type " + scantype);
		List<String> folders = scantype == SCAN_TYPE.IMAGE ? properties.getFoldersImages() : properties.getFoldersVideos();
		String pattern = scantype == SCAN_TYPE.IMAGE ? Patterns.IMAGE_PATTERN : Patterns.VIDEO_PATTERN;

		folders.forEach(folderRoot -> {
			logger.info("Scanning " + folderRoot);
			filesUtil.findFilesInDirectory(folderRoot, Pattern.compile(pattern, Pattern.CASE_INSENSITIVE))
			.stream()
			.forEach(path -> {
				String wholePath = path.getParent().toString() + File.separator + path.getFileName().toString();
				logger.info("Handling " + wholePath);
				Photo photoInDatabase = photoRepository.findByPathAndName(path.getParent().toString(), path.getFileName().toString());
				
				if(photoInDatabase == null) {
					logger.info("Inserting photo " + wholePath);
					createPhoto(path, scantype, folderRoot);
				} else {
					logger.info("Photo " + wholePath + "already in the database");
				}
			});
		});
	}
	
	private void createPhoto(Path path, SCAN_TYPE scantype, String folderRoot) {
		MutlimediaAbstract photoOrVideo = scantype == SCAN_TYPE.IMAGE ? context.getBean(Photo.class) : context.getBean(Video.class);
		photoOrVideo.setName(path.getFileName().toString());
		photoOrVideo.setPath(path.getParent().toString());
		photoOrVideo.setRights(generateRightsFromRightsPath(readAttributes(path)));

		if(scantype == SCAN_TYPE.IMAGE) {
			photoOrVideo.setThumnail(produceThumnailFromImage(photoOrVideo.getPath() + File.separator + photoOrVideo.getName()));
		} else if(scantype == SCAN_TYPE.VIDEO) {
			photoOrVideo.setThumnail(produceThumnailFromVideo(photoOrVideo.getPath() + File.separator + photoOrVideo.getName()));
		}

		createAlbums(photoOrVideo, scantype, folderRoot);

		if (scantype == SCAN_TYPE.IMAGE) {
			photoRepository.save((Photo)photoOrVideo);
		} else {
			videoRepository.save((Video)photoOrVideo);
		}

	}

	private byte[] produceThumnailFromImage(String fullPath) {
		try {
			Image image = ImageIO.read(new File(fullPath))
					.getScaledInstance(200, 200, BufferedImage.SCALE_SMOOTH);

			BufferedImage bufferedImage = new BufferedImage(image.getWidth(null), image.getHeight(null), BufferedImage.TYPE_INT_RGB);
			Graphics2D g2 = bufferedImage.createGraphics();
			g2.drawImage(image, null, null);

			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			ImageIO.write(bufferedImage, "jpg", outStream);
			InputStream is = new ByteArrayInputStream(outStream.toByteArray());

			return toByteArray(is);
		} catch (IOException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
			return null;
		} catch (NullPointerException npe) {
			logger.error(npe.getMessage());
			npe.printStackTrace();
			return null;
		}
	}

	public byte[] produceThumnailFromVideo(String fullPath) {
		ProcessBuilder processBuilder = new ProcessBuilder();
		String command = "ffmpeg -i '" + fullPath + "' -ss 00:00:01.000 -vframes 1 " + VIDEO_THUMNAIL_TEMP_PATH;
		processBuilder.command("sh", "-c", command);
		try {
			Process process = processBuilder.start();
			StringBuilder output = new StringBuilder();
			BufferedReader reader = new BufferedReader(
					new InputStreamReader(process.getInputStream()));

			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line + "\n");
			}

			int exitVal = process.waitFor();
			if (exitVal == 0) {
				System.out.println("Success!");
				System.out.println(output);

				byte[] toReturn = produceThumnailFromImage(VIDEO_THUMNAIL_TEMP_PATH);
				Files.deleteIfExists(Paths.get(VIDEO_THUMNAIL_TEMP_PATH));

				return toReturn;
			} else {
				logger.error("Could not get thumnail from file " + fullPath + ". Return code from ffmpeg: " + exitVal);
				logger.error(output.toString());
			}
		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return null;
	}
	
	/**
	 * Creates the album hierarchy of albums regarding the photo.
	 * @param photoOrVideo
	 */
	void createAlbums(MutlimediaAbstract photoOrVideo, SCAN_TYPE scantype, String folderRoot) {
		Album parentAlbum = null;
		String folderPathParts = createFolderRootWithoutLast(folderRoot) + File.separator;

		String pathToCreateTree = createAlbumPathToScan(photoOrVideo.getPath(), folderRoot);

		for(String folder : pathToCreateTree.split(File.separator)) {
			if (!StringUtils.isEmpty(folder)) {
				folderPathParts = folderPathParts + folder + File.separator;
				if (!folder.equals(photoOrVideo.getName())) {
					Album album = albumRepository.findByPath(folderPathParts);
					if(album == null) {
						album = context.getBean(Album.class);
						album.setName(folder);
						album.setPath(folderPathParts);
						album.setRights(generateRightsFromRightsPath(readAttributes(Paths.get(folderPathParts))));
						album.setForPhoto(scantype == SCAN_TYPE.IMAGE);
						album.setForVideo(scantype == SCAN_TYPE.VIDEO);

						if (parentAlbum != null) {
							album.setFather(parentAlbum);
							album = albumRepository.save(album);

//							Set<Album> sons = parentAlbum.getSons();
//							if (sons == null)	sons = new HashSet<>();
//
//							sons.add(album);
//							parentAlbum.setSons(sons);

							parentAlbum = albumRepository.save(parentAlbum);
						} else {
							album = albumRepository.save(album);
						}
					}

					parentAlbum = album;
				}
			}
		}
		if (parentAlbum != null) {
			photoOrVideo.setAlbum(parentAlbum);
		}
	}

	/**
	 * Removes the root given in the properties file from the albums tree creation.
	 * @param albumPath
	 * @param folderRoot
	 * @return
	 */
	String createAlbumPathToScan(String albumPath, String folderRoot) {
		String folderRootWithoutLast = createFolderRootWithoutLast(folderRoot);

		return albumPath.replaceFirst(folderRootWithoutLast, "");
	}

	String createFolderRootWithoutLast(String folderRoot) {
		String[] listFolderRoot = folderRoot.split(File.separator);
		return Arrays.stream(listFolderRoot).filter(folder -> !folder.equals(listFolderRoot[listFolderRoot.length-1])).collect(Collectors.joining(File.separator));
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
