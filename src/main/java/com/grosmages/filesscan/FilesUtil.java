package com.grosmages.filesscan;

import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Collection;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class FilesUtil {
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	public Collection<Path> findFilesInDirectory(String sPath, Pattern pattern) {
		Collection<Path> toReturn = new ArrayList<>();
		
		try {
			Files.walkFileTree(Paths.get(sPath), new SimpleFileVisitor<Path>() {
				@Override
				public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
					if (Files.isRegularFile(file)
							&& (pattern == null || pattern.matcher(file.getFileName().toString()).matches())) {
						toReturn.add(file);
					}
					return FileVisitResult.CONTINUE;
				}
				
				@Override
				public FileVisitResult visitFileFailed(Path file, IOException exc) throws IOException {
					log.error("Error reading path: {}", file);
					return FileVisitResult.SKIP_SUBTREE;
				}
			});
		} catch (IOException e1) {
			log.error("Error reading subdirectories of {}", sPath);
			log.error(e1.getMessage());
		}
		
		return toReturn;
	}
}
