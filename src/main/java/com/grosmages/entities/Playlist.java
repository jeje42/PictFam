package com.grosmages.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@Data
@NoArgsConstructor
@Component
@Entity
@Scope("prototype")
public class Playlist {
    private @Id
    @GeneratedValue
    Long id;

    String name;

    @JsonIgnore
    @ManyToOne
    User user;

    @ManyToMany
    List<Video> videos;

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