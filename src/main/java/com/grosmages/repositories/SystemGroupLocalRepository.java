package com.grosmages.repositories;

import java.util.Optional;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.grosmages.entities.SystemGroupLocal;

@Repository
public interface SystemGroupLocalRepository extends PagingAndSortingRepository<SystemGroupLocal, Long> {
    Optional<SystemGroupLocal> findByName(String name);
    Optional<SystemGroupLocal> findByGid(String gid);
    Optional<SystemGroupLocal> findByNameOrGid(String name, String gid);
}
