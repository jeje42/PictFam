package com.grosmages.repositories;

import java.util.Optional;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.grosmages.entities.Role;
import com.grosmages.entities.RoleName;

@Repository
public interface RoleRepository extends PagingAndSortingRepository<Role, Long> {
    Optional<Role> findByName(RoleName roleName);
}
