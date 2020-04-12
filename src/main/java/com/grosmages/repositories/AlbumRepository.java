package com.grosmages.repositories;

import java.util.Collection;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;
import com.grosmages.entities.Album;

@Repository
public interface AlbumRepository extends PagingAndSortingRepository<Album, Long> {
	public Album findByPath(String path);

	@PreAuthorize("isAuthenticated()")
	@Query("SELECT distinct a FROM Album a WHERE a.isRoot = true and a.isForPhoto = TRUE")
	Collection<Album> findAllRootForImage();

	@PreAuthorize("isAuthenticated()")
	@Query("SELECT distinct a FROM Album a WHERE a.isRoot = true and a.isForVideo = TRUE")
	Collection<Album> findAllRootForVideo();

	@PreAuthorize("isAuthenticated()")
	@Query("SELECT a FROM Album a WHERE a.sons is empty")
	Collection<Album> findAllLeaf();
}
