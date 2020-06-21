package com.grosmages.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.persistence.Entity;
import java.util.List;

@Data
@NoArgsConstructor
@Component
@Scope("prototype")
public class PlaylistPost {
    Playlist playlist;
    List<Video> videos;
}
