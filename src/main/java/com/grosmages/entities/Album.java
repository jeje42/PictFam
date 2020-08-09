package com.grosmages.entities;

import java.util.Objects;
import java.util.Set;

import javax.persistence.*;

import com.grosmages.event.AlbumListener;
import lombok.*;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@Component
@Entity
@Scope("prototype")
@EntityListeners(AlbumListener.class)
public class Album {
	private @Id @GeneratedValue Long id;
	String name;
	
	@JsonIgnore
	String path;
	
	@JsonIgnore
	@OneToOne(cascade = CascadeType.ALL)
	Rights rights;

	@ManyToOne
    Album father;
	
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "father")
	Set<Album> sons;

	Boolean forPhoto;
    Boolean forVideo;
	
	@Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        if (!Album.class.isAssignableFrom(obj.getClass())) {
            return false;
        }

        final Album other = (Album) obj;
        if (!Objects.equals(this.name, other.name)) {
            return false;
        }

        if (this.forPhoto != other.forPhoto) {
            return false;
        }

        if (this.forVideo != other.forVideo) {
            return false;
        }

        return true;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 53 * hash + (this.name != null ? this.name.hashCode() : 0);
        return hash;
    }
}
