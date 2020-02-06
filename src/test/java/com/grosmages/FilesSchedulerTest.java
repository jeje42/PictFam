package com.grosmages;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.hateoas.config.EnableEntityLinks;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import com.grosmages.entities.Album;
import com.grosmages.entities.Photo;
import com.grosmages.repositories.AlbumRepository;
import com.grosmages.repositories.PhotoRepository;
import org.springframework.test.context.web.WebAppConfiguration;

@RunWith(SpringRunner.class)
@SpringBootTest
@EnableEntityLinks
@WebAppConfiguration
@TestPropertySource(locations = "classpath:application-test.yml")
public class FilesSchedulerTest {
	
	Logger logger = LoggerFactory.getLogger(this.getClass());

	private final static String dir1 = "/tmp/album1/";
	private final static String subDir1 = dir1 + "evenement1/";
	private final static String subDir2 = dir1 + "evenement2/";

	private final static String photo1Name = "Family1.jpg";
	private final static String photo2Name = "Family2.jpg";

	@Autowired
	private PhotoRepository photoRepository;
	
	@Autowired
	private AlbumRepository albumRepository;
	
	@Autowired
	private ApplicationContext context;
	
	@Autowired
	private FilesScheduler fileScheduler;

	@Before
	public void setUp() {
		new File(subDir1).mkdirs();
		new File(subDir2).mkdirs();
		try {
			new File(subDir1 + "/" + photo1Name).createNewFile();
			new File(subDir2 + "/" + photo2Name).createNewFile();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Test
	public void albumHierarchyOnePhoto() {
		Photo photo = context.getBean(Photo.class);
		photo.setName(photo1Name);
		photo.setPath(subDir1);
		
		fileScheduler.createAlbums(photo);
		
		List<Album> lAlbumsDatabase = new ArrayList<>();
		
		albumRepository.findAll().forEach(lAlbumsDatabase::add);
		
		assertThat(lAlbumsDatabase.size()).isEqualTo(3);
		assertThat(lAlbumsDatabase.get(1).getPath()).isEqualTo(dir1);
		assertThat(lAlbumsDatabase.get(2).getPath()).isEqualTo(subDir1);
	}
	
	@Test
	public void albumHierarchyTwoPhoto() {
		Photo photo0 = context.getBean(Photo.class);
		photo0.setName(photo1Name);
		photo0.setPath(subDir1);
		
		Photo photo1 = context.getBean(Photo.class);
		photo1.setName(photo2Name);
		photo1.setPath(subDir2);
		
		fileScheduler.createAlbums(photo0);
		fileScheduler.createAlbums(photo1);
		
		List<Album> lAlbumsDatabase = new ArrayList<>();
		
		albumRepository.findAll().forEach(lAlbumsDatabase::add);
		
		assertThat(lAlbumsDatabase.size()).isEqualTo(4);
		assertThat(lAlbumsDatabase.get(1).getPath()).isEqualTo(dir1);
		assertThat(lAlbumsDatabase.get(2).getPath()).isEqualTo(subDir1);
		assertThat(lAlbumsDatabase.get(3).getPath()).isEqualTo(subDir2);
	}
	
	@Test
	public void albumHierarchyTwoTimesSamePhoto() {
		Photo photo0 = context.getBean(Photo.class);
		photo0.setName(photo1Name);
		photo0.setPath(subDir1);
		
		Photo photo1 = context.getBean(Photo.class);
		photo1.setName(photo1Name);
		photo1.setPath(subDir1);
		
		fileScheduler.createAlbums(photo0);
		fileScheduler.createAlbums(photo1);
		
		List<Album> lAlbumsDatabase = new ArrayList<>();
		
		albumRepository.findAll().forEach(lAlbumsDatabase::add);
		
		assertThat(lAlbumsDatabase.size()).isEqualTo(3);
		assertThat(lAlbumsDatabase.get(1).getPath()).isEqualTo(dir1);
		assertThat(lAlbumsDatabase.get(2).getPath()).isEqualTo(subDir1);
	}
	
	@Test
	public void testFileAttrbutes() {
		fileScheduler.readAttributes(Paths.get("/home/jeje/Pictures/ToSend.png"));
	}

}
