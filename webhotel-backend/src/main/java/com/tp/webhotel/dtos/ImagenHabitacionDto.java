package com.tp.webhotel.dtos;

import com.tp.webhotel.model.TipoHabitacion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ImagenHabitacionDto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_imagen",nullable = false,updatable = false)
    private int id;
    private TipoHabitacion id_tipo_habitacion;
    private String nombre;
    private String tipo;
    @Lob
    private byte[] imagenData;
}
