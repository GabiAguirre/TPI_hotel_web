package com.tp.webhotel.repository;

import com.tp.webhotel.model.Habitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface HabitacionRepository extends JpaRepository<Habitacion, Integer> {

    @Query("SELECT h FROM Habitacion h WHERE h.tipoHabitacion.id = :idTipo " +
           "AND h.id NOT IN (" +
           "  SELECT e.habitacion.id FROM Estadia e " +
           "  WHERE e.estado <> 'CANCELADA' " +
           "  AND e.fechaIngreso < :fechaEgreso AND e.fechaEgreso > :fechaIngreso" +
           ")")
    List<Habitacion> findDisponibles(
            @Param("idTipo") int idTipo,
            @Param("fechaIngreso") Date fechaIngreso,
            @Param("fechaEgreso") Date fechaEgreso);
}
