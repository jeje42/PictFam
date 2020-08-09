package com.grosmages.entities;

import javax.persistence.*;

import com.grosmages.event.PhotoListener;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Scope;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Component
@Entity(name = "Photo")
@Scope("prototype")
@EntityListeners(PhotoListener.class)
public class Photo extends MutlimediaAbstract {
}
