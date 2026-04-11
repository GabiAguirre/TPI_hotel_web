package com.tp.webhotel.dtos;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
public class EstadiaRequestDto {

    @Positive(message = "Debe seleccionar un tipo de habitación")
    public int idTipoHabitacion;

    @NotBlank(message = "La fecha de ingreso es requerida")
    public String fechaIngreso;

    @NotBlank(message = "La fecha de egreso es requerida")
    public String fechaEgreso;

    public List<Integer> idServicios = new ArrayList<>();
}
