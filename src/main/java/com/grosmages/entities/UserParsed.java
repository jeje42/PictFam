package com.grosmages.entities;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Getter
@Setter
@ToString
@Entity
public class UserParsed {
	private @Id @GeneratedValue Long id;
	String name;
	String uid;
	String password;
	Boolean admin;
}
