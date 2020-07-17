package com.grosmages.event;

import com.grosmages.config.WebSocketConfig;
import com.grosmages.entities.Playlist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.persistence.PostPersist;
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
        logger.info("PostPersist");
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/newPlaylist", getPath(playlist));
    }

    @PostUpdate
    public void postUpdated(Playlist playlist)
    {
        logger.info("PostUpdate");
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/updatePlaylist", getPath(playlist));
    }

    private String getPath(Playlist playlist) {
        return this.entityLinks.linkForSingleResource(playlist.getClass(), playlist.getId()).toUri().getPath();
    }
}
