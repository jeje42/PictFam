package com.grosmages.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.grosmages.event.VideoListener;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Scope;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@Component
@Entity(name = "Video")
@Scope("prototype")
@EntityListeners(VideoListener.class)
public class Video extends MutlimediaAbstract {

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "pk.video", cascade=CascadeType.ALL)
    private Set<PlaylistVideo> playlistVideos = new HashSet<PlaylistVideo>(0);

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        if (!Video.class.isAssignableFrom(obj.getClass())) {
            return false;
        }

        final Video other = (Video) obj;
        if ((this.name == null) ? (other.name != null) : !this.name.equals(other.name)) {
            return false;
        }

        if ((this.path == null) ? (other.path != null) : !this.path.equals(other.path)) {
            return false;
        }

        return true;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 53 * hash + (this.name != null ? this.name.hashCode() : 0);
        hash = 53 * hash + (this.path != null ? this.path.hashCode() : 0);
        return hash;
    }
}
