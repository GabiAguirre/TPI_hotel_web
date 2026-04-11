package com.tp.webhotel.model;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class RolConverter implements AttributeConverter<Rol, String> {

    @Override
    public String convertToDatabaseColumn(Rol rol) {
        if (rol == null) return null;
        return rol.name();
    }

    @Override
    public Rol convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return Rol.valueOf(dbData);
    }
}
