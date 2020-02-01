package com.grosmages.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;

import com.grosmages.entities.Album;
import com.grosmages.entities.Photo;
import com.grosmages.repositories.AlbumRepository;
import com.grosmages.repositories.PhotoRepository;

@RestController
public class MyRestController {
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private AlbumRepository albumRepository;
	
	@Autowired
	private PhotoRepository photoRepository;
	
	@RequestMapping(value = "/albumstree")	
	public Collection<Album> getAlbumTree() throws IOException {
		Collection<Album> toReturn = albumRepository.findAllRoot();
		final Collection<Album> array = toReturn;
		
		
		toReturn = toReturn.stream().filter(album -> {
			for (Album albumLoop: array) {
				if (albumLoop != album && albumLoop.getSons() != null) {
					if (albumLoop.getSons().contains(album)) {
						return false;
					}
				}
			}
			
			return true;
		}).collect(Collectors.toCollection(ArrayList::new));
		
		return toReturn;
	}
	
	@RequestMapping(value = "/photostree")	
	public Collection<Photo> getPhotosTree() throws IOException {
		Collection<Photo> photos = photoRepository.findAllPhotos();
		
		Set<Album> sonsEmpty = new HashSet<>();
		
		photos.forEach(photo -> {
			photo.getAlbum().setSons(sonsEmpty);
		});
		return photos;
	}

	@RequestMapping(value = "/userdetails")
	public String getUserDetails(Principal principal) throws IOException {
		String userName = principal.getName();
		return userName;
	}
}