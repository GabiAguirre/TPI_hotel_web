package com.tp.webhotel.model;


import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.NaturalId;
import org.springframework.validation.annotation.Validated;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Validated
public class Habitacion{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="nro_habitacion",nullable = false,updatable = false)
    private int nroHabitacion;
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_tipo_habitacion",nullable = false)
    private TipoHabitacion tipoHabitacion;

    public Habitacion(){}

    public Habitacion(int nroHabitacion,TipoHabitacion tipoHabitacion){
        this.nroHabitacion = nroHabitacion;
        this.tipoHabitacion = tipoHabitacion;
    }
}




