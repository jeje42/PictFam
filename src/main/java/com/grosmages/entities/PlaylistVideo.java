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
@Table(name = "playlist_videos")
@Scope("prototype")
@AssociationOverrides({
        @AssociationOverride(name = "pk.playlist",
                joinColumns = @JoinColumn(name = "PLAYLIST_ID")),
        @AssociationOverride(name = "pk.video",
                joinColumns = @JoinColumn(name = "VIDEO_ID")) })
public class PlaylistVideo implements java.io.Serializable {

    @EmbeddedId
    private PlaylistVideoId pk = new PlaylistVideoId();

    private Integer position;

    @Transient
    public Playlist getPlaylist() {
        return getPk().getPlaylist();
    }

    public void setPlaylist(Playlist playlist) {
        getPk().setPlaylist(playlist);
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

        PlaylistVideo that = (PlaylistVideo) o;

        if (getPk() != null ? !getPk().equals(that.getPk())
                : that.getPk() != null)
            return false;

        if(getPosition() != null ? !getPosition().equals(that.getPosition()) : that.getPosition() != null)
            return false;

        return true;
    }

    public int hashCode() {
        return (getPk() != null ? getPk().hashCode() : 0);
    }
}
