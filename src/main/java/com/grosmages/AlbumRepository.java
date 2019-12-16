package com.grosmages;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.grosmages.entities.Album;

public interface AlbumRepository extends PagingAndSortingRepository<Album, Long> {
	public Album findByName(String path);
}
