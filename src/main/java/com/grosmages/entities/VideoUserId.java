package com.grosmages.entities;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Embeddable;
import javax.persistence.ManyToOne;
import java.util.Objects;

@Data
@NoArgsConstructor
@Embeddable
public class VideoUserId implements java.io.Serializable {

    @ManyToOne
    private User user;

    @ManyToOne
    private Video video;

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        VideoUserId that = (VideoUserId) o;

        if (!Objects.equals(user, that.user)) return false;
        if (!Objects.equals(video, that.video))
            return false;

        return true;
    }

    public int hashCode() {
        int result;
        result = (user != null ? user.hashCode() : 0);
        result = 31 * result + (video != null ? video.hashCode() : 0);
        return result;
    }
}
