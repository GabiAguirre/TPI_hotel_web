package com.tp.webhotel.model;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Builder
public class ImagenHabitacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_imagen",nullable = false,updatable = false)
    private int id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_habitacion", nullable = false)
    private TipoHabitacion tipoHabitacion;
    private String nombre;
    private String tipo;
    @Lob
    private byte[] imagenData;

    public ImagenHabitacion() {}

    public ImagenHabitacion(int id, TipoHabitacion id_tipo_habitacion, String nombre, String tipo, byte[] imagenData) {
        this.id = id;
        this.tipoHabitacion = id_tipo_habitacion;
        this.nombre = nombre;
        this.tipo = tipo;
        this.imagenData = imagenData;
    }
}
