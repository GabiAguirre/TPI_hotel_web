package com.tp.webhotel.dtos;

import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@Validated
public class HabitacionDto {
    @NotNull
    public int nroHabitacion;

    @NotNull
    public int idTipoHabitacion;
}
