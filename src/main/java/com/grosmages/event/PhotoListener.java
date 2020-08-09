package com.grosmages.event;

import com.grosmages.config.WebSocketConfig;
import com.grosmages.entities.Photo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;

public class PhotoListener {

    @Autowired
    SimpMessagingTemplate websocket;

    @Autowired
    EntityLinks entityLinks;

    @PostPersist
    public void postCreated(Photo photo)
    {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/newPhoto", getPath(photo));
    }

    @PostUpdate
    public void postUpdated(Photo photo)
    {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/updatePhoto", getPath(photo));
    }

    @PostRemove
    public void postRemove(Photo photo)
    {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/removePhoto", getPath(photo));
    }

    private String getPath(Photo photo) {
        return photo.getId().toString();
    }
}
