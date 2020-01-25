package com.grosmages.entities;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

@Data
public class GroupParsed {
	private @Id @GeneratedValue Long id;
	String name;
	String gid;
	
	Set<String> users = new HashSet<String>();
}
