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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.grosmages.filesscan.FilesUtil;
import com.grosmages.repositories.EmployeeRepository;
import com.grosmages.repositories.PhotoRepository;
/**
 * @author Greg Turnquist
 */
// tag::code[]
@Component
public class DatabaseLoader implements CommandLineRunner {
	@Autowired
	private final EmployeeRepository repository;
	
	@Autowired
	private final PhotoRepository photoRepository;

	@Autowired
	private FilesUtil filesUtil;
	
	@Autowired
	public DatabaseLoader(EmployeeRepository repository, PhotoRepository photoRepository) {
		this.repository = repository;
		this.photoRepository = photoRepository;
	}

	@Override
	public void run(String... args) throws Exception {
		// TODO Auto-generated method stub
		
	}
	
}
// end::code[]