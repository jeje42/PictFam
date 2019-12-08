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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * @author Greg Turnquist
 */
// tag::code[]
@SpringBootApplication
@ComponentScan(basePackages = "com.grosmages")
@Import({RepositoryConfig.class})
@EnableScheduling
public class ReactAndSpringDataRestApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(ReactAndSpringDataRestApplication.class, args);
	}
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private PhotoRepository photoRepository;

	@Override
	public void run(String... strings) throws Exception {
		
		
		photoRepository.findAll().forEach(photo -> log.info(photo.getPath()));
	}
}
// end::code[]