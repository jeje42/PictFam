package com.grosmages.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Component
@Entity
@Scope("prototype")
public class Rights {
	private @Id @GeneratedValue Long id;
	
	@ManyToOne
	private User owner;

	@ManyToOne
	private SystemGroupLocal systemGroupLocal;
	
	private Boolean ownerRead;
	private Boolean ownerWrite;
	private Boolean groupRead;
	private Boolean groupWrite;
	private Boolean othersRead;
	private Boolean othersWrite;
	
	@Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        if (!Rights.class.isAssignableFrom(obj.getClass())) {
            return false;
        }

        final Rights other = (Rights) obj;
        if ((this.ownerRead == null) ? (other.ownerRead != null) : !this.ownerRead.equals(other.ownerRead)) {
            return false;
        }

        if ((this.ownerWrite == null) ? (other.ownerWrite != null) : !this.ownerWrite.equals(other.ownerWrite)) {
        	return false;
        }
        
        if ((this.groupRead == null) ? (other.groupRead != null) : !this.groupRead.equals(other.groupRead)) {
        	return false;
        }
        
        if ((this.groupWrite == null) ? (other.groupWrite != null) : !this.groupWrite.equals(other.groupWrite)) {
        	return false;
        }
        
        if ((this.othersRead == null) ? (other.othersRead != null) : !this.othersRead.equals(other.othersRead)) {
        	return false;
        }
        
        if ((this.othersWrite == null) ? (other.othersWrite != null) : !this.othersWrite.equals(other.othersWrite)) {
        	return false;
        }

        return true;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 53 * hash + (this.ownerRead != null ? this.ownerRead.hashCode() : 0)
        		+ (this.ownerWrite != null ? this.ownerWrite.hashCode() : 0)
        		+ (this.groupRead != null ? this.groupRead.hashCode() : 0)
        		+ (this.groupWrite != null ? this.groupWrite.hashCode() : 0)
        		+ (this.othersRead != null ? this.othersRead.hashCode() : 0)
        		+ (this.othersWrite != null ? this.othersWrite.hashCode() : 0)
        		;
        return hash;
    }
}
