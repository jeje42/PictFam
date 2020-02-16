package com.grosmages.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import javax.persistence.*;

@Data
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class MutlimediaAbstract {
	protected @Id @GeneratedValue Long id;
    protected String name;
	@JsonIgnore @Nullable @Lob private byte[] thumnail;
	@JsonIgnore protected String path;
	
	@ManyToOne
    protected Album album;
	
	@JsonIgnore
	@OneToOne(cascade = CascadeType.ALL)
    protected Rights rights;
	
	@Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        if (!MutlimediaAbstract.class.isAssignableFrom(obj.getClass())) {
            return false;
        }

        final MutlimediaAbstract other = (MutlimediaAbstract) obj;
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
