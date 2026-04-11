package com.tp.webhotel.dtos;

import com.tp.webhotel.model.TipoHabitacion;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Getter
@Setter
public class TipoHabitacionDto {
    @NotBlank(message = "Campo requerido")
    public String denominacion;
    public String descripcion;
    public int cantidadPersonas;
    @NotNull(message = "Campo requerido")
    public BigDecimal precioPorDia;


    public TipoHabitacion toTipoHabitacion(){
        TipoHabitacion tipoHabitacion = new TipoHabitacion();
        tipoHabitacion.setDenominacion(this.denominacion);
        tipoHabitacion.setDescripcion(this.descripcion);
        tipoHabitacion.setCapacidadPersonas(this.cantidadPersonas);
        tipoHabitacion.setPrecioPorDia(this.precioPorDia);


        return tipoHabitacion;
    }
}
