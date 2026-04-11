package com.tp.webhotel.dtos;

import com.tp.webhotel.model.Servicio;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Getter
@Setter
@Validated
public class ServicioDto {
    @NotBlank(message = "Campo requerido")
    public String denominacion;
    public String descripcion;
    @NotNull(message = "Campo requerido")
    public BigDecimal costo;



    public Servicio toServicio(){
        Servicio servicio = new Servicio();
        servicio.setDenominacion(this.denominacion);
        servicio.setDescripcion(this.descripcion);
        servicio.setCosto(this.costo);

        return servicio;
    }
}

