package com.tp.webhotel.repository;

import com.tp.webhotel.model.ImagenHabitacion;
import com.tp.webhotel.model.TipoHabitacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImagenHabitacionRepository extends JpaRepository<ImagenHabitacion, Integer> {
    List<ImagenHabitacion> findByTipoHabitacion(TipoHabitacion id_tipo_habitacion);
}
