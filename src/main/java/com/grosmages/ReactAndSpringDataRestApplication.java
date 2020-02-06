/*
 * Copyright 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.grosmages;

import java.io.File;
import java.util.HashSet;
import java.util.Set;

import com.grosmages.entities.Role;
import com.grosmages.repositories.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.grosmages.config.PropertiesConfig;
import com.grosmages.config.RepositoryConfig;
import com.grosmages.entities.SystemGroupLocal;
import com.grosmages.entities.User;
import com.grosmages.repositories.PhotoRepository;
import com.grosmages.repositories.SystemGroupLocalRepository;
import com.grosmages.repositories.UserRepository;

@SpringBootApplication
//@ComponentScan(basePackages = "com.grosmages")
@Import({RepositoryConfig.class})
@EnableScheduling
@Transactional
public class ReactAndSpringDataRestApplication implements CommandLineRunner {
	
	@Autowired
	private ApplicationContext context;
	
	@Autowired
    PasswordEncoder passwordEncoder;

	@Autowired
	FilesScheduler filesScheduler;
	
	public static void main(String[] args) {
		SpringApplication.run(ReactAndSpringDataRestApplication.class, args);
	}
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private PhotoRepository photoRepository;
	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;
	
	@Autowired
	private SystemGroupLocalRepository systemGroupLocalRepository;
	
	@Autowired
	private PropertiesConfig properties;

	@Override
	public void run(String... strings) throws Exception {
		photoRepository.findAll().forEach(photo -> log.info(photo.getPath() + File.separator + photo.getName()));

		Role roleAdmin = createRoleIfNotFound("ROLE_ADMIN");
		Role roleUser = createRoleIfNotFound("ROLE_USER");



		properties.getUsers().forEach(user -> {
			User newUser = context.getBean(User.class);
			newUser.setName(user.getName());
			newUser.setPassword(user.getPassword());
			newUser.setUid(user.getUid());

			Set<Role> roles = new HashSet();
			roles.add(roleUser);
			if (user.getAdmin()) {
				roles.add(roleAdmin);
			}
			newUser.setRoles(roles);
			userRepository.save(newUser);
		});
		
		properties.getGroups().forEach(group -> {
			SystemGroupLocal systemGroupLocal = context.getBean(SystemGroupLocal.class);
			systemGroupLocal.setName(group.getName());
			systemGroupLocal.setGid(group.getGid());
			
			final SystemGroupLocal systemGroupLocalFinal = systemGroupLocalRepository.save(systemGroupLocal);
			group.getUsers().forEach(userParsed -> {
				User user = userRepository.findByUid(userParsed).orElse(null);
				if (user == null) {
					log.error("[Parsing group {}] User {} not found.", group.toString(), userParsed);
				} else {
					addGroupToUser(user, systemGroupLocalFinal);
					userRepository.save(user);
				}
			});
		});
		
//		filesScheduler.scanFiles();
	}
	
	private void addGroupToUser(User user, SystemGroupLocal systemGroupLocal) {
		Set<SystemGroupLocal> groups = user.getGroups();
		groups.add(systemGroupLocal);
	}
	
	private void addUserToGroup(User user, SystemGroupLocal systemGroupLocal) {
		Set<User> users = systemGroupLocal.getUsers();
		users.add(user);
	}

	private Role createRoleIfNotFound(String name) {

		Role role = roleRepository.findByName(name).orElse(null);
		if (role == null) {
			role = new Role();
			role.setName(name);
			roleRepository.save(role);
		}
		return role;
	}
}
