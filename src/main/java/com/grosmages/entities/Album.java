package com.grosmages.entities;

import java.util.List;
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
	
	@OneToMany(fetch = FetchType.EAGER, mappedBy = "album", cascade = CascadeType.MERGE)
	private List<Photo> photos;
	
	@OneToOne
	private Album parent;
	
	@OneToMany
	private Set<Album> sons;
	
	@Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        if (!Album.class.isAssignableFrom(obj.getClass())) {
            return false;
        }

        final Album other = (Album) obj;
        if ((this.name == null) ? (other.name != null) : !this.name.equals(other.name)) {
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
