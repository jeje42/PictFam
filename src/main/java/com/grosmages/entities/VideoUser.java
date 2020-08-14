package com.grosmages.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@Component
@Table(name = "video_user")
@Scope("prototype")
@AssociationOverrides({
        @AssociationOverride(name = "pk.video",
                joinColumns = @JoinColumn(name = "VIDEO_ID")),
        @AssociationOverride(name = "pk.user",
                joinColumns = @JoinColumn(name = "USER_ID"))})
public class VideoUser implements java.io.Serializable {

    @EmbeddedId
    private VideoUserId pk = new VideoUserId();

    private Integer readingPosition;

    @Transient
    public User getUser() {
        return getPk().getUser();
    }

    public void setUser(User user) {
        getPk().setUser(user);
    }

    @Transient
    public Video getVideo() {
        return getPk().getVideo();
    }

    public void setVideo(Video video) {
        getPk().setVideo(video);
    }

    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        VideoUser that = (VideoUser) o;

        if (getPk() != null ? !getPk().equals(that.getPk())
                : that.getPk() != null)
            return false;

        return true;
    }

    public int hashCode() {
        return (getPk() != null ? getPk().hashCode() : 0);
    }
}
