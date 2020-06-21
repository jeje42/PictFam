package com.grosmages.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class Video extends MutlimediaAbstract {

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "pk.video", cascade=CascadeType.ALL)
    private Set<PlaylistVideo> playlistVideos = new HashSet<PlaylistVideo>(0);
}
