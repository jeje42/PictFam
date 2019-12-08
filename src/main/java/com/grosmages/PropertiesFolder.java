package com.grosmages;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Configuration
@EnableConfigurationProperties
@ConfigurationProperties("grosmages.folders")
@Data
public class PropertiesFolder {
	private List<String> images;
}
