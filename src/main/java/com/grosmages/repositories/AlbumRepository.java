package com.grosmages.repositories;

import java.util.Collection;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

import com.grosmages.entities.Album;

  
@Repository
public interface AlbumRepository extends PagingAndSortingRepository<Album, Long> {
	public Album findByPath(String path);
	
//	@PreAuthorize("isAuthenticated()")
//	@Query("SELECT distinct a FROM Album a WHERE "
//			+ " (a.rights.owner.id = ?#{ principal?.id } and a.rights.ownerRead is true)"
//	+ " or a.rights.othersRead is true"
//	+ " or ( a.rights.systemGroupLocal is not empty "
//	+ " and a.rights.groupRead is true"
//	+ " and ?#{ principal?.id } in (select u.id from SystemGroupLocal g join g.users u where g = a.rights.systemGroupLocal))")
//	Collection<Album> findAllRoot();

	@PreAuthorize("isAuthenticated()")
	@Query("SELECT distinct a FROM Album a WHERE a.isRoot = true and a.isForPhoto = TRUE")
	Collection<Album> findAllRootForImage();

	@PreAuthorize("isAuthenticated()")
	@Query("SELECT distinct a FROM Album a WHERE a.isRoot = true and a.isForVideo = TRUE")
	Collection<Album> findAllRootForVideo();
	
	@PreAuthorize("")
	@Query("SELECT a FROM Album a WHERE a.sons is empty")
	Collection<Album> findAllLeaf();
}
