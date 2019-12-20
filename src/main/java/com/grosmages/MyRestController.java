package com.grosmages;

import java.io.IOException;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grosmages.entities.Album;
import com.grosmages.entities.Photo;

@RestController
public class MyRestController {
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private AlbumRepository albumRepository;
	
	@Autowired
	private PhotoRepository photoRepository;
	
	@RequestMapping(value = "/albumstree")	
	public Collection<Album> getAlbumTree() throws IOException {
		return albumRepository.findAllRoot();		
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
}