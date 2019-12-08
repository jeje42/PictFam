package com.grosmages;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import com.grosmages.entities.Photo;

@Controller
public class FilesController {
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private PhotoRepository photoRepository;
	
	@GetMapping(
			value = "/thumnails/{id}",
			produces = MediaType.IMAGE_JPEG_VALUE
	)
	public @ResponseBody byte[] getImage(@PathVariable("id") long id) throws IOException {
		Photo photo = photoRepository.findById(id).orElse(null);		
		if(photo != null) {
			return photo.getThumnail();
		}
		
		return null;
	}
}
