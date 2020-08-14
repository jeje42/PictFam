package com.grosmages.controller;

import com.grosmages.controller.exceptions.BadRequestException;
import com.grosmages.controller.exceptions.ForbiddenException;
import com.grosmages.entities.*;
import com.grosmages.repositories.PlaylistRepository;
import com.grosmages.repositories.UserRepository;
import com.grosmages.repositories.VideoRepository;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.security.Principal;

@RestController
public class RestVideo {

    @Autowired
    private ApplicationContext context;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VideoRepository videoRepository;

    private User userFromPrincipal(Principal principal) {
        String userName = principal.getName();
        User user = userRepository.findByName(userName).orElse(null);
        if (user == null) {
            throw new ForbiddenException();
        }

        return user;
    }

    private Video videoFromId(String videoId) {
        Video video = videoRepository.findById(Long.parseLong(videoId)).orElse(null);

        if(video == null){
            throw new BadRequestException();
        }

        return video;
    }

    @GetMapping(value = "/videoUser")
    public ResponseEntity<String> retrieveVideoUser(Principal principal, @RequestParam String videoId) {
        Session session = null;
        if (entityManager == null
                || (session = entityManager.unwrap(Session.class)) == null) {

            throw new NullPointerException();
        }

        User user = userFromPrincipal(principal);

        Long userId = user.getId();

        try {
            session.beginTransaction();

            TypedQuery<VideoUser> query = entityManager.createQuery(
                    "SELECT v FROM VideoUser v where v.pk.user.id = ?1 and v.pk.video.id = ?2", VideoUser.class);

            VideoUser videoUser = query.setParameter(1, user.getId()).setParameter(2, Long.parseLong(videoId)).getSingleResult();

            session.getTransaction().commit();

            return new ResponseEntity(videoUser.getReadingPosition(), HttpStatus.OK);
        } catch (Exception e) {
            System.err.println(e);
        } finally {
            session.close();
        }

        return new ResponseEntity<>("Could not retrieve status", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping(value = "/videoUser")
    public ResponseEntity<String> updateVideoUser(Principal principal, @RequestBody VideoUserPost videoUserPost) {
        Session session = null;
        if (entityManager == null
                || (session = entityManager.unwrap(Session.class)) == null) {

            throw new NullPointerException();
        }

        User user = userFromPrincipal(principal);
        Video video = videoFromId(videoUserPost.getVideoId());

        Long userId = user.getId();
        Long videoId = video.getId();

        try {
            session.beginTransaction();

            TypedQuery<VideoUser> query = entityManager.createQuery(
                    "SELECT v FROM VideoUser v where v.pk.user.id = ?1 and v.pk.video.id = ?2", VideoUser.class);

            VideoUser videoUser;
            try{
                videoUser = query.setParameter(1, user.getId()).setParameter(2, video.getId()).getSingleResult();
            }catch (NoResultException nre){
                videoUser = context.getBean(VideoUser.class);
                videoUser.setUser(user);
                videoUser.setVideo(video);
            }

            videoUser.setReadingPosition(videoUserPost.getReadingPosition());

            session.save(videoUser);

            session.getTransaction().commit();
        } catch (Exception e) {
            System.err.println(e);
        } finally {
            session.close();
        }

        return new ResponseEntity<>("Status saved", HttpStatus.OK);
    }
}
