package com.grosmages.config;

import java.util.List;

import com.grosmages.entities.UserParsed;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import com.grosmages.entities.GroupParsed;
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
	private List<UserParsed> users;
	private List<GroupParsed> groups;
}
