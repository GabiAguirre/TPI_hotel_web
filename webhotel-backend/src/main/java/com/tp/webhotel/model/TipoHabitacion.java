package com.tp.webhotel.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
public class TipoHabitacion{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_habitacion",nullable = false,updatable = false)
    private int id;
    private String denominacion;
    private String descripcion;
    @Column(name = "capacidad_personas")
    @JsonProperty("capacidad_personas")
    @NotNull
    private int capacidadPersonas;
    @Column(name = "precio_por_dia")
    @JsonProperty("precio_por_dia")
    @NotNull
    private BigDecimal precioPorDia;

    public TipoHabitacion(){}

    public TipoHabitacion(int id,String denominacion,String descripcion,int capacidadPersonas,BigDecimal precioPorDia){
        this.id = id;
        this.denominacion = denominacion;
        this.descripcion = descripcion;
        this.capacidadPersonas = capacidadPersonas;
        this.precioPorDia = precioPorDia;
    }

}
