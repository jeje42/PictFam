package com.grosmages.controller.entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
@Scope("prototype")
public class PlaylistForClient {
    Long id;
    String name;
    private Set<PlaylistVideoForClient> playlistVideos = new HashSet<PlaylistVideoForClient>(0);
}
