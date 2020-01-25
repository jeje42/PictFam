package com.grosmages.entities;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Entity
@Component
@Scope("prototype")
public class SystemGroupLocal {
	private @Id @GeneratedValue Long id;
	String name;
	String gid;
	
	@ManyToMany(mappedBy = "groups")
	private Set<User> users = new HashSet<>();
}
