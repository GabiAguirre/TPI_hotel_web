package com.tp.webhotel.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DisponibilidadException extends RuntimeException {
    public DisponibilidadException(String message) {
        super(message);
    }
}
