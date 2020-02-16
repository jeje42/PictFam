package com.grosmages.repositories;

import com.grosmages.entities.MutlimediaAbstract;
import com.grosmages.entities.Photo;
import com.grosmages.entities.Video;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface VideoRepository extends PagingAndSortingRepository<Video, Long> {
	Video findByPathAndName(String path, String name);
	
	@PreAuthorize("isAuthenticated()")
	@Query("SELECT distinct p FROM Video p Where"
			+ " (p.rights.owner.id = ?#{ principal?.id } and (p.rights.ownerRead is true or p.rights.othersRead is true))"
			+ " or ( p.rights.systemGroupLocal is not empty "
			+ " and p.rights.groupRead is true"
			+ " and ?#{ principal?.id } in (select u.id from SystemGroupLocal g join g.users u where g = p.rights.systemGroupLocal))")
	Collection<MutlimediaAbstract> findAllVideos();
}
