package com.grosmages.config;

import com.grosmages.repositories.events.AlbumEventHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RepositoryConfigHandlers {

    @Autowired
 private AlbumEventHandler albumEventHandler;
}
