package com.grosmages.filesscan;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

@Component
public class FilesUtil {
	public List<Path> findFilesInDirectory(String path, Pattern pattern) {
		try {
			return Files.walk(Paths.get(path))
			.filter(Files::isRegularFile)
			.filter(file -> {
				if (pattern == null) return true;
				else return pattern.matcher(file.getFileName().toString()).matches();
			})
			.collect(Collectors.toList());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new ArrayList<>();
		}
	}
}
