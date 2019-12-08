package com.grosmages;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;

import com.grosmages.entities.Photo;

@Configuration
public class RepositoryConfig implements RepositoryRestConfigurer {

	  @Override
	  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
	    config.exposeIdsFor(Photo.class);
	  }

}
