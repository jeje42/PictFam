package com.grosmages.entities;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Embeddable;
import javax.persistence.ManyToOne;
import java.util.Objects;

@Data
@NoArgsConstructor
@Embeddable
public class PlaylistVideoId implements java.io.Serializable {

    @ManyToOne
    private Playlist playlist;

    @ManyToOne
    private Video video;

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PlaylistVideoId that = (PlaylistVideoId) o;

        if (!Objects.equals(playlist, that.playlist)) return false;
        if (!Objects.equals(video, that.video))
            return false;

        return true;
    }

    public int hashCode() {
        int result;
        result = (playlist != null ? playlist.hashCode() : 0);
        result = 31 * result + (video != null ? video.hashCode() : 0);
        return result;
    }
}
