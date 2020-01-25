package com.grosmages.repositories;

import java.util.Collection;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.grosmages.entities.Photo;

@Repository
public interface PhotoRepository extends PagingAndSortingRepository<Photo, Long> {
	Photo findByPathAndName(String path, String name);
	
	@Query("SELECT p FROM Photo p")
	Collection<Photo> findAllPhotos();
}
