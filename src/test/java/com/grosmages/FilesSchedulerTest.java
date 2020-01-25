package com.grosmages;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.ApplicationContext;
import org.springframework.hateoas.config.EnableEntityLinks;
import org.springframework.test.context.junit4.SpringRunner;

import com.grosmages.entities.Album;
import com.grosmages.entities.Photo;
import com.grosmages.repositories.AlbumRepository;
import com.grosmages.repositories.PhotoRepository;

@RunWith(SpringRunner.class)
@DataJpaTest
@EnableEntityLinks
@EnableAutoConfiguration(exclude=ReactAndSpringDataRestApplication.class)
public class FilesSchedulerTest {
	
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private PhotoRepository photoRepository;
	
	@Autowired
	private AlbumRepository albumRepository;
	
	@Autowired
	private ApplicationContext context;
	
	@Autowired
	private FilesScheduler fileScheduler;
	
	@Test
	public void albumHierarchyOnePhoto() {
		Photo photo = context.getBean(Photo.class);
		photo.setName("Family1.jpg");
		photo.setPath("/album1/evenement1");
		
		fileScheduler.createAlbums(photo);
		
		List<Album> lAlbumsDatabase = new ArrayList<>();
		
		albumRepository.findAll().forEach(lAlbumsDatabase::add);
		
		assertThat(lAlbumsDatabase.size()).isEqualTo(2);
		assertThat(lAlbumsDatabase.get(0).getPath()).isEqualTo("/album1/");
		assertThat(lAlbumsDatabase.get(1).getPath()).isEqualTo("/album1/evenement1/");
	}
	
	@Test
	public void albumHierarchyTwoPhoto() {
		Photo photo0 = context.getBean(Photo.class);
		photo0.setName("Family1.jpg");
		photo0.setPath("/album1/evenement1");
		
		Photo photo1 = context.getBean(Photo.class);
		photo1.setName("Family2.jpg");
		photo1.setPath("/album1/evenement2");
		
		fileScheduler.createAlbums(photo0);
		fileScheduler.createAlbums(photo1);
		
		List<Album> lAlbumsDatabase = new ArrayList<>();
		
		albumRepository.findAll().forEach(lAlbumsDatabase::add);
		
		assertThat(lAlbumsDatabase.size()).isEqualTo(3);
		assertThat(lAlbumsDatabase.get(0).getPath()).isEqualTo("/album1/");
		assertThat(lAlbumsDatabase.get(1).getPath()).isEqualTo("/album1/evenement1/");
		assertThat(lAlbumsDatabase.get(2).getPath()).isEqualTo("/album1/evenement2/");
	}
	
	@Test
	public void albumHierarchyTwoTimesSamePhoto() {
		Photo photo0 = context.getBean(Photo.class);
		photo0.setName("Family1.jpg");
		photo0.setPath("/album1/evenement1");
		
		Photo photo1 = context.getBean(Photo.class);
		photo1.setName("Family1.jpg");
		photo1.setPath("/album1/evenement1");
		
		fileScheduler.createAlbums(photo0);
		fileScheduler.createAlbums(photo1);
		
		List<Album> lAlbumsDatabase = new ArrayList<>();
		
		albumRepository.findAll().forEach(lAlbumsDatabase::add);
		
		assertThat(lAlbumsDatabase.size()).isEqualTo(2);
		assertThat(lAlbumsDatabase.get(0).getPath()).isEqualTo("/album1/");
		assertThat(lAlbumsDatabase.get(1).getPath()).isEqualTo("/album1/evenement1/");
	}
	
	@Test
	public void testFileAttrbutes() {
		fileScheduler.readAttributes(Paths.get("/home/jeje/Pictures/ToSend.png"));
	}

}
