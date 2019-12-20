package com.grosmages;

import java.util.Collection;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.grosmages.entities.Album;

public interface AlbumRepository extends PagingAndSortingRepository<Album, Long> {
	public Album findByName(String path);
	
	@Query("SELECT a FROM Album a WHERE a.isRoot is true")
	Collection<Album> findAllRoot();
	
	@Query("SELECT a FROM Album a WHERE a.sons is empty")
	Collection<Album> findAllLeaf();
}
