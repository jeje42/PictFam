package com.grosmages.controller.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
@Scope("prototype")
public class PlaylistVideoForClient {
    Integer position;
    Long videoId;
    String videoName;
}
