package com.tp.webhotel.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class EstadiaInvalidaException extends RuntimeException {
    public EstadiaInvalidaException(String message) {
        super(message);
    }
}
