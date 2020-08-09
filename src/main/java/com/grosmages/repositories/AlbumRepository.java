package com.grosmages.repositories;

import java.util.Collection;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;
import com.grosmages.entities.Album;

@Repository
public interface AlbumRepository extends PagingAndSortingRepository<Album, Long> {
	Album findByPath(String path);

	Collection<Album> findAllByForPhotoTrueAndFatherIsNull();

	Collection<Album> findAllByForVideoTrueAndFatherIsNull();

	@PreAuthorize("isAuthenticated()")
	@Query("SELECT distinct a FROM Album a WHERE a.father is null and a.forPhoto = TRUE")
	Collection<Album> findAllRootForImage();

	@PreAuthorize("isAuthenticated()")
	@Query("SELECT distinct a FROM Album a WHERE a.father is null and a.forVideo = TRUE")
	Collection<Album> findAllRootForVideo();

	@PreAuthorize("isAuthenticated()")
	@Query("SELECT a FROM Album a WHERE a.sons is empty")
	Collection<Album> findAllLeaf();
}
