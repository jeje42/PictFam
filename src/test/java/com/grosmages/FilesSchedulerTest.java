package com.grosmages;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.TestPropertySource;

import com.grosmages.entities.Album;
import com.grosmages.entities.Photo;
import com.grosmages.repositories.AlbumRepository;
import com.grosmages.repositories.PhotoRepository;
import org.springframework.test.context.web.WebAppConfiguration;

//@RunWith(SpringRunner.class)
@SpringBootTest
@WebAppConfiguration
@TestPropertySource(locations = "classpath:application-test.yml")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class FilesSchedulerTest {
	
	Logger logger = LoggerFactory.getLogger(this.getClass());

	private final static String root = "/tmp/";
	private final static String dir1 = root + "album1/";
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

	@BeforeEach
	public void setUp() {
		createDir(subDir1);
		createFile(subDir1 + "/" + photo1Name);

	}

	private boolean createDir(String dir) {
		new File(dir).mkdirs();
		return true;
	}

	private boolean createFile(String file) {
		try {
			new File(file).createNewFile();
			return true;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
	}

	@AfterEach
	public void undoSetUp() {
		albumRepository.deleteAll();
		photoRepository.deleteAll();
		Path pathToBeDeleted = Paths.get(dir1);
		try {
			Files.walk(pathToBeDeleted)
					.sorted(Comparator.reverseOrder())
					.map(Path::toFile)
					.forEach(File::delete);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Test
	public void albumHierarchyOnePhoto() {
		Photo photo = context.getBean(Photo.class);
		photo.setName(photo1Name);
		photo.setPath(subDir1);
		
		fileScheduler.createAlbums(photo, FilesScheduler.SCAN_TYPE.IMAGE, "");
		
		List<Album> lAlbumsDatabase = new ArrayList<>();
		
		albumRepository.findAll().forEach(lAlbumsDatabase::add);
		
		assertThat(lAlbumsDatabase.size()).isEqualTo(3);
		assertThat(lAlbumsDatabase.get(1).getPath()).isEqualTo(dir1);
		assertThat(lAlbumsDatabase.get(2).getPath()).isEqualTo(subDir1);
	}
	
	@Test
	public void albumHierarchyTwoPhoto() {
		assertThat(true).isEqualTo(createDir(subDir2));
		assertThat(true).isEqualTo(createFile(subDir2 + "/" + photo2Name));

		Photo photo0 = context.getBean(Photo.class);
		photo0.setName(photo1Name);
		photo0.setPath(subDir1);
		
		Photo photo1 = context.getBean(Photo.class);
		photo1.setName(photo2Name);
		photo1.setPath(subDir2);
		
		fileScheduler.createAlbums(photo0, FilesScheduler.SCAN_TYPE.IMAGE, "");
		fileScheduler.createAlbums(photo1,FilesScheduler.SCAN_TYPE.IMAGE, "");
		
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
		
		fileScheduler.createAlbums(photo0, FilesScheduler.SCAN_TYPE.IMAGE, "");
		fileScheduler.createAlbums(photo1, FilesScheduler.SCAN_TYPE.IMAGE, "");
		
		List<Album> lAlbumsDatabase = new ArrayList<>();
		
		albumRepository.findAll().forEach(lAlbumsDatabase::add);
		
		assertThat(lAlbumsDatabase.size()).isEqualTo(3);
		assertThat(lAlbumsDatabase.get(1).getPath()).isEqualTo(dir1);
		assertThat(lAlbumsDatabase.get(2).getPath()).isEqualTo(subDir1);
	}

	@Test
	public void createAlbumPathToScanTest() {
		String albumPath = "/home/user/album1/albumSub1";
		String folderRoot = "/home/user";
		String result = fileScheduler.createAlbumPathToScan(albumPath, folderRoot);

		assertThat(result).isEqualTo("/user/album1/albumSub1");
	}

	@Test
	public void createAlbumPathToScanTestRoot() {
		String albumPath = "/home/user/album1/albumSub1";
		String folderRoot = "/";
		String result = fileScheduler.createAlbumPathToScan(albumPath, folderRoot);

		assertThat(result).isEqualTo("/home/user/album1/albumSub1");
	}
	
//	@Test
//	public void testFileAttrbutes() {
//		fileScheduler.readAttributes(Paths.get("/home/jeje/Pictures/ToSend.png"));
//	}

}
