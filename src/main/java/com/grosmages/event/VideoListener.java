package com.grosmages.event;

import com.grosmages.config.WebSocketConfig;
import com.grosmages.entities.Photo;
import com.grosmages.entities.Video;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;

public class VideoListener {

    @Autowired
    SimpMessagingTemplate websocket;

    @Autowired
    EntityLinks entityLinks;

    @PostPersist
    public void postCreated(Video video)
    {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/newVideo", getPath(video));
    }

    @PostUpdate
    public void postUpdated(Video video)
    {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/updateVideo", getPath(video));
    }

    @PostRemove
    public void postRemove(Video video)
    {
        this.websocket.convertAndSend(
                WebSocketConfig.MESSAGE_PREFIX + "/removeVideo", getPath(video));
    }

    private String getPath(Video video) {
        return video.getId().toString();
    }
}
