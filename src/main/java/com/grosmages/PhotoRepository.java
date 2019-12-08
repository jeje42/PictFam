package com.grosmages;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.grosmages.entities.Photo;

public interface PhotoRepository extends PagingAndSortingRepository<Photo, Long> {
	public Photo findByPath(String path);
}
