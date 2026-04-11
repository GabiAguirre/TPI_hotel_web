package com.tp.webhotel.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
public class Servicio{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)// id auto generado
    @Column(name = "id_servicio",nullable = false,updatable = false)
    private int id;
    private String denominacion;
    private String descripcion;

    @Positive
    private BigDecimal costo;



    public Servicio(){}

    public Servicio(int id,String denominacion,String descripcion,BigDecimal costo){
        this.id = id;
        this.denominacion = denominacion;
        this.descripcion = descripcion;
        this.costo = costo;
    }

}
