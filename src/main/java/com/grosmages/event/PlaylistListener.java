package com.grosmages.event;

import com.grosmages.entities.Playlist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;

import static com.grosmages.WebSocketConfiguration.MESSAGE_PREFIX;

public class PlaylistListener {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    SimpMessagingTemplate websocket; // <2>

    @Autowired
    EntityLinks entityLinks;

    @PostPersist
    public void postCreated(Playlist playlist)
    {
        logger.info("PostPersist");
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/newEmployee", getPath(playlist));
    }

    @PostUpdate
    public void postUpdated(Playlist playlist)
    {
        logger.info("PostUpdate");
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/newEmployee", getPath(playlist));
    }

    private String getPath(Playlist playlist) {
        return this.entityLinks.linkForSingleResource(playlist.getClass(), playlist.getId()).toUri().getPath();
    }
}
