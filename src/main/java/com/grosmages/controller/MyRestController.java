package com.grosmages.controller;

import java.io.IOException;
import java.security.Principal;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grosmages.entities.Album;
import com.grosmages.entities.Photo;
import com.grosmages.repositories.AlbumRepository;
import com.grosmages.repositories.PhotoRepository;
import com.grosmages.security.UserPrincipal;

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
		
		toReturn.stream().filter(album -> {
			if (!isAlbumAuthorizedForUser(album)) {
				return false;
			}
			
			return true;
		}).collect(Collectors.toList());
		
		toReturn.forEach(album -> {
			filterSons(album);
		});
		
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
	
	private void filterSons(Album album) {
		album.setSons(album.getSons().stream().filter(albumSon -> {
			return isAlbumAuthorizedForUser(albumSon);
		}).collect(Collectors.toSet()));
		
		album.getSons().forEach(albumSon -> {
			filterSons(albumSon);
		});
	}
	
	private Boolean isAlbumAuthorizedForUser(Album album) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
		
		if (album.getRights() == null || album.getRights().getOwner() == null) {
			return false;
		}
		
		if (album.getRights().getOwner().getId() == userPrincipal.getId() && album.getRights().getOwnerRead()) {
			return true;
		}
		
		if (album.getRights().getOthersRead()) {
			return true;
		}
		
		if (album.getRights().getSystemGroupLocal() != null 
				&& album.getRights().getGroupRead()
				&& album.getRights().getSystemGroupLocal().getUsers() != null
				&& album.getRights().getSystemGroupLocal().getUsers().size() > 0
				&& album.getRights().getSystemGroupLocal().getUsers().stream().filter(user -> user.getId() == userPrincipal.getId()).collect(Collectors.toList()).size()>0) {
			return true;
		}
		
		return false;
	}
}