package com.grosmages.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@NoArgsConstructor
@Component
@Scope("prototype")
public class VideoUserPost {
    String videoId;
    Integer readingPosition;
}
