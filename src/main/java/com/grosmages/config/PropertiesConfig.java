package com.grosmages.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import com.grosmages.entities.GroupParsed;
import com.grosmages.entities.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Component
@Configuration
@EnableConfigurationProperties
@ConfigurationProperties(prefix = "pictfam")
@AllArgsConstructor
@Data
public class PropertiesConfig {
	private List<String> folders;
	private List<User> users;
	private List<GroupParsed> groups;
}
