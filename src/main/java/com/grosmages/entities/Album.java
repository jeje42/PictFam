package com.grosmages.entities;

import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Component
@Entity
@Scope("prototype")
public class Album {
	private @Id @GeneratedValue Long id;
	private String name;
	
	@JsonIgnore
	private String path;
	
	private Boolean isRoot;
	
	@JsonIgnore
	@OneToOne(cascade = CascadeType.ALL)
	private Rights rights;
	
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private Set<Album> sons;

	private boolean isForPhoto;
    private boolean isForVideo;
	
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

        if (this.isForPhoto != other.isForPhoto) {
            return false;
        }

        if (this.isForVideo != other.isForVideo) {
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
