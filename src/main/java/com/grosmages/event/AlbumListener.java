package com.grosmages.event;

import com.grosmages.config.WebSocketConfig;
import com.grosmages.entities.Album;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;

public class AlbumListener {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    SimpMessagingTemplate websocket;

    @Autowired
    EntityLinks entityLinks;

    @PostPersist
    public void postCreated(Album album)
    {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/newAlbum", getPath(album));
    }

    @PostUpdate
    public void postUpdated(Album album)
    {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/updateAlbum", getPath(album));
    }

    @PostRemove
    public void postRemove(Album album)
    {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/removeAlbum", getPath(album));
    }

    private String getPath(Album album) {
        return this.entityLinks.linkForItemResource(album.getClass(), album.getId()).toUri().getPath();
    }
}
