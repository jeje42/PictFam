package com.grosmages.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.security.Principal;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import com.grosmages.entities.User;
import com.grosmages.entities.Video;
import com.grosmages.repositories.UserRepository;
import com.grosmages.repositories.VideoRepository;
import com.grosmages.security.JwtTokenProvider;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.grosmages.entities.Photo;
import com.grosmages.repositories.PhotoRepository;

@Controller
public class FilesController {
	
	Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private JwtTokenProvider tokenProvider;
	
	@Autowired
	private PhotoRepository photoRepository;

	@Autowired
	private VideoRepository videoRepository;

	@Autowired
	private UserRepository userRepository;
	
	@GetMapping(
			value = "/thumnailPhoto/{id}",
			produces = MediaType.IMAGE_JPEG_VALUE
	)
	public @ResponseBody byte[] getThumnailPhoto(@PathVariable("id") long id) throws IOException {
		Photo photo = photoRepository.findById(id).orElse(null);		
		if(photo != null) {
			return photo.getThumnail();
		}
		
		return null;
	}

	@GetMapping(
			value = "/thumnailVideo/{id}",
			produces = MediaType.IMAGE_JPEG_VALUE
	)
	public @ResponseBody byte[] getThumnailVideo(@PathVariable("id") long id) throws IOException {
		Video video = videoRepository.findById(id).orElse(null);
		if(video != null) {
			return video.getThumnail();
		}

		return null;
	}
	
	@GetMapping(
			value = "/photo/{id}",
			produces = MediaType.IMAGE_JPEG_VALUE
	)
	public @ResponseBody byte[] getImage(@PathVariable("id") long id) throws IOException {
		Photo photo = photoRepository.findById(id).orElse(null);		
		if(photo != null) {
			InputStream is = new FileInputStream(new File(photo.getPath() + File.separator + photo.getName()));
			return IOUtils.toByteArray(is);
		}
		
		return null;
	}

	@GetMapping("/video")
	public ResponseEntity<ResourceRegion> getVideo(@RequestHeader HttpHeaders headers, @RequestParam String token, @RequestParam String videoId) throws IOException {
		if (token == null || videoId == null || !tokenProvider.validateToken(token)) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}

		Video video = null;
		try {
			Long lVideoId = Long.parseLong(videoId);
			video = videoRepository.findById(lVideoId).orElse(null);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		if (video == null) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

		FileSystemResource videoResource = new FileSystemResource(video.getPath() + File.separator + video.getName());
		ResourceRegion region = resourceRegion(videoResource, headers);
		return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
				.contentType(MediaTypeFactory
						.getMediaType(videoResource)
						.orElse(MediaType.APPLICATION_OCTET_STREAM))
				.body(region);
	}

	private ResourceRegion resourceRegion(Resource video, HttpHeaders headers) throws IOException {
		Long contentLength = video.contentLength();
		List<HttpRange> rangeList = headers.getRange();
		if (rangeList != null && rangeList.size()>0) {
			HttpRange range = rangeList.get(0);
			Long start = range.getRangeStart(contentLength);
			Long end = range.getRangeEnd(contentLength);
			Long rangeLength = Math.min(1 * 1024 * 1024, end - start + 1);
			return new ResourceRegion(video, start, rangeLength);
		} else {
			Long rangeLength = Math.min(1 * 1024 * 1024, contentLength);
			return new ResourceRegion(video, 0, rangeLength);
		}
	}
}

