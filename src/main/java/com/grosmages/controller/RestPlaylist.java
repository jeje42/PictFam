package com.grosmages.controller;

import com.grosmages.controller.exceptions.BadRequestException;
import com.grosmages.controller.exceptions.ConflictException;
import com.grosmages.controller.exceptions.ForbiddenException;
import com.grosmages.entities.Playlist;
import com.grosmages.entities.User;
import com.grosmages.repositories.PlaylistRepository;
import com.grosmages.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
public class RestPlaylist {

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
    public Playlist updatePlaylist(Principal principal, @RequestBody Playlist playlist) {
        createUpdatePlaylistCommon(principal, playlist);

        return playlistRepository.save(playlist);
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
