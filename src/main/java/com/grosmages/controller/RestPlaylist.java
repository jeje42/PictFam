package com.grosmages.controller;

import com.grosmages.controller.exceptions.BadRequestException;
import com.grosmages.controller.exceptions.ConflictException;
import com.grosmages.controller.exceptions.ForbiddenException;
import com.grosmages.entities.*;
import com.grosmages.repositories.PlaylistRepository;
import com.grosmages.repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
public class RestPlaylist {

    @Autowired
    private ApplicationContext context;

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
//        Playlist playlistToSave = new Playlist();
//        playlistToSave.setName(playlist.getName());
//
//        createUpdatePlaylistCommon(principal, playlistToSave);
//        playlistToSave.setId(playlist.getId());
//        playlistToSave.setName(playlist.getName());
//
//
//        playlist.getPlaylistVideos().forEach(playlistVideo -> {
//
//            playlistVideo.setPlaylist(playlist);
////            playlistVideo.getPlaylist().setPlaylistVideos(new HashSet<>());
////            playlistVideo.getVideo().setPlaylistVideos(new HashSet<>());
//        });
//
//        Playlist playlistSaved = playlistRepository.save(playlist);
//
//        return playlistSaved;

//        createUpdatePlaylistCommon(principal, playlist);
//
//        Playlist savedPlaylist = playlistRepository.save(playlist);

        Playlist playlistToSave = playlistpost.getPlaylist();

        playlistpost.getVideos().forEach(video -> {
            video.setPlaylistVideos(null);
        });

        Set<PlaylistVideo> playlistVideoSet = new HashSet<>();
        for(Integer i = 0 ; i<playlistpost.getVideos().size() ; i++){
            PlaylistVideo playlistVideo = context.getBean(PlaylistVideo.class);
//            playlistVideo.setPlaylist(playlistToSave);
            playlistVideo.setVideo(playlistpost.getVideos().get(i));
            playlistVideo.setPosition(i);

            playlistVideoSet.add(playlistVideo);
        }

        playlistToSave.setPlaylistVideos(playlistVideoSet);

        Playlist savedPlaylist = playlistRepository.save(playlistToSave);

        return savedPlaylist;
    }

    @GetMapping(value = "/playlist")
    public List<Playlist> updatePlaylist(Principal principal) {
        String userName = principal.getName();
        User user = userRepository.findByName(userName).orElse(null);
        if (user == null) {
            throw new ForbiddenException();
        }

        return playlistRepository.findAllByUser(user);
    }
}
