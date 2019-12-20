package com.grosmages;

import java.util.Collection;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.grosmages.entities.Photo;

public interface PhotoRepository extends PagingAndSortingRepository<Photo, Long> {
	public Photo findByPath(String path);
	
	@Query("SELECT p FROM Photo p")
	Collection<Photo> findAllPhotos();
}
