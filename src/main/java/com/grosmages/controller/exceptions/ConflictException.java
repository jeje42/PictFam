package com.grosmages.controller.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.CONFLICT, reason="Forbidden")  // 404
public class ConflictException extends RuntimeException {

}
