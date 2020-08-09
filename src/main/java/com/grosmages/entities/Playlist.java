package com.grosmages.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.grosmages.event.PlaylistListener;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.*;

@Data
@NoArgsConstructor
@Component
@Entity
@Scope("prototype")
@EntityListeners(PlaylistListener.class)
public class Playlist {
    private @Id
    @GeneratedValue
    Long id;
    String name;

    @JsonIgnore
    @ManyToOne
    User user;

//    @ManyToMany
//    List<Video> videos;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "pk.playlist")
    private Set<PlaylistVideo> playlistVideos = new HashSet<PlaylistVideo>(0);

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        if (!Playlist.class.isAssignableFrom(obj.getClass())) {
            return false;
        }

        final Playlist other = (Playlist) obj;

        if (!Objects.equals(this.name, other.name)) {
            return false;
        }

        if (!Objects.equals(this.user, other.user)) {
            return false;
        }

        return true;
    }
}
