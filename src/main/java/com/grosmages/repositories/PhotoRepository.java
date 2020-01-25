package com.grosmages.repositories;

import java.util.Collection;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

import com.grosmages.entities.Photo;

@Repository
public interface PhotoRepository extends PagingAndSortingRepository<Photo, Long> {
	Photo findByPathAndName(String path, String name);
	
	@PreAuthorize("isAuthenticated()")
	@Query("SELECT distinct p FROM Photo p Where"
			+ " (p.rights.owner.id = ?#{ principal?.id } and (p.rights.ownerRead is true or p.rights.othersRead is true))")
	Collection<Photo> findAllPhotos();
}
