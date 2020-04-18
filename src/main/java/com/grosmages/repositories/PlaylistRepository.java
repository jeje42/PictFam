package com.grosmages.repositories;

import com.grosmages.entities.Playlist;
import com.grosmages.entities.User;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistRepository extends PagingAndSortingRepository<Playlist, Long> {
    Optional<Playlist> findByNameAndUser(String name, User user);

    List<Playlist> findAllByUser(User user);
}
