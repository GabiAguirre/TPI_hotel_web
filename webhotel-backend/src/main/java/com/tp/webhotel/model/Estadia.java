package com.tp.webhotel.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
public class Estadia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estadia", nullable = false, updatable = false)
    @JsonProperty("id_estadia")
    private int idEstadia;

    @Column(name = "fecha_ingreso")
    @JsonProperty("fecha_ingreso")
    private Date fechaIngreso;

    @Column(name = "fecha_egreso")
    @JsonProperty("fecha_egreso")
    private Date fechaEgreso;

    private String estado;

    @Column(name = "precio_total")
    @JsonProperty("precio_total")
    private BigDecimal precioTotal;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_habitacion")
    private Habitacion habitacion;

    @ManyToMany
    @JoinTable(
            name = "estadia_servicios",
            joinColumns = @JoinColumn(name = "id_estadia"),
            inverseJoinColumns = @JoinColumn(name = "id_servicio")
    )
    private Set<Servicio> servicios = new HashSet<>();

    public Estadia() {}

    public void agregarServicio(Servicio servicio) {
        if (servicio != null) {
            servicios.add(servicio);
        }
    }
}
