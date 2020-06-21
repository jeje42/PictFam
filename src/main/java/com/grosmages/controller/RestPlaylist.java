package com.grosmages.controller;

import com.grosmages.controller.exceptions.BadRequestException;
import com.grosmages.controller.exceptions.ForbiddenException;
import com.grosmages.entities.*;
import com.grosmages.repositories.PlaylistRepository;
import com.grosmages.repositories.UserRepository;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
public class RestPlaylist {

    @Autowired
    private ApplicationContext context;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private UserRepository userRepository;

    private void createUpdatePlaylistCommon(Principal principal, Playlist playlist) {
        String userName = principal.getName();
        User user = userRepository.findByName(userName).orElse(null);
        if (user == null) {
            throw new ForbiddenException();
        }
        playlist.setUser(user);

        if(playlist.getName() == null){
            throw new BadRequestException();
        }
    }

    @PutMapping(value = "/playlist")
    public Playlist createPlaylist(Principal principal, @RequestBody Playlist playlist, final HttpServletResponse response) throws IOException {
        createUpdatePlaylistCommon(principal, playlist);

        Playlist playlistExisting = playlistRepository.findByNameAndUser(playlist.getName(), playlist.getUser()).orElse(null);
        if(playlistExisting != null) {
            response.sendError(HttpStatus.CONFLICT.value(), "Une playlist nommée " + playlist.getName() + " existe déjà.");
            return null;
        }

        return playlistRepository.save(playlist);
    }

    @PostMapping(value = "/playlist")
    public Playlist updatePlaylist(Principal principal, @RequestBody PlaylistPost playlistpost) {
        Session session = null;
        if (entityManager == null
                || (session = entityManager.unwrap(Session.class)) == null) {

            throw new NullPointerException();
        }



        Playlist playlistToSave = context.getBean(Playlist.class);
        playlistToSave.setId(playlistpost.getPlaylist().getId());

        List<PlaylistVideo> playlistVideoList = new ArrayList<>();
        for(Integer i = 0 ; i<playlistpost.getVideos().size() ; i++){
            PlaylistVideo playlistVideo = context.getBean(PlaylistVideo.class);
            playlistVideo.setPlaylist(playlistToSave);
            playlistVideo.setVideo(playlistpost.getVideos().get(i));
            playlistVideo.setPosition(i);

            playlistVideoList.add(playlistVideo);
        }

        try{
            session.beginTransaction();

            entityManager.createQuery("delete from PlaylistVideo where pk.playlist.id = :playlistId")
                    .setParameter("playlistId", playlistToSave.getId())
                    .executeUpdate();

            final Session finalSession = session;
            playlistVideoList.forEach(playlistVideo -> {
                finalSession.save(playlistVideo);
            });

            session.getTransaction().commit();
        } catch (Exception e){

        }finally {
            session.close();
        }

        return null;
    }

    @GetMapping(value = "/playlist")
    public List<Playlist> updatePlaylist(Principal principal) {
        String userName = principal.getName();
        User user = userRepository.findByName(userName).orElse(null);
        if (user == null) {
            throw new ForbiddenException();
        }

        List<Playlist> playlists = playlistRepository.findAllByUser(user);


        playlists.forEach(playlist -> {
            playlist.getPlaylistVideos().forEach(playlistVideo -> {
                playlistVideo.setPlaylist(null);

                Video video = new Video();
                video.setId(playlistVideo.getVideo().getId());
                playlistVideo.setVideo(video);
            });
        });

        return playlists;
    }
}
