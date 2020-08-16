package com.grosmages.event;

import com.grosmages.config.WebSocketConfig;
import com.grosmages.entities.Playlist;
import com.grosmages.entities.PlaylistVideo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;

public class PlaylistVideoListener {

    @Autowired
    SimpMessagingTemplate websocket;

    @Autowired
    EntityLinks entityLinks;

    @PostPersist
    public void postCreated(PlaylistVideo playlistVideo) {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/newPlaylistVideo", getPath(playlistVideo));
    }

    @PostUpdate
    public void postUpdated(PlaylistVideo playlistVideo) {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/newPlaylistVideo", getPath(playlistVideo));
    }

    @PostRemove
    public void postRemove(PlaylistVideo playlistVideo) {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/newPlaylistVideo", getPath(playlistVideo));
    }

    private String getPath(PlaylistVideo playlistVideo) {
        return playlistVideo.getPlaylist().getId().toString();
    }
}
