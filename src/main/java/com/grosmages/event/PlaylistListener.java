package com.grosmages.event;

import com.grosmages.config.WebSocketConfig;
import com.grosmages.entities.Playlist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;

public class PlaylistListener {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    SimpMessagingTemplate websocket;

    @Autowired
    EntityLinks entityLinks;

    @PostPersist
    public void postCreated(Playlist playlist)
    {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/newPlaylist", getPath(playlist));
    }

    @PostUpdate
    public void postUpdated(Playlist playlist)
    {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/updatePlaylist", getPath(playlist));
    }

    @PostRemove
    public void postRemove(Playlist playlist)
    {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/removePlaylist", getPath(playlist));
    }

    private String getPath(Playlist playlist) {
        return this.entityLinks.linkForItemResource(playlist.getClass(), playlist.getId()).toUri().getPath();
    }
}
