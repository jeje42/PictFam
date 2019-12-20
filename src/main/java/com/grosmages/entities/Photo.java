package com.grosmages.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

import org.springframework.context.annotation.Scope;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Component
@Entity
@Scope("prototype")
public class Photo {
	private @Id @GeneratedValue Long id;
	private String name;
	@JsonIgnore @Nullable @Lob private byte[] thumnail;
	@JsonIgnore private String path;
	
	@ManyToOne
	private Album album;
	
	@Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        if (!Photo.class.isAssignableFrom(obj.getClass())) {
            return false;
        }

        final Photo other = (Photo) obj;
        if ((this.name == null) ? (other.name != null) : !this.name.equals(other.name)) {
            return false;
        }

        if ((this.path == null) ? (other.path != null) : !this.path.equals(other.path)) {
            return false;
        }

        return true;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 53 * hash + (this.name != null ? this.name.hashCode() : 0);
        hash = 53 * hash + (this.path != null ? this.path.hashCode() : 0);
        return hash;
    }
}
