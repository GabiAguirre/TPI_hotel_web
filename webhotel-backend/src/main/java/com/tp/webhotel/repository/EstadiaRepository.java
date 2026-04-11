package com.tp.webhotel.repository;

import com.tp.webhotel.model.Estadia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface EstadiaRepository extends JpaRepository<Estadia, Integer> {

    @Query("SELECT e FROM Estadia e WHERE e.usuario.id = :idUsuario ORDER BY e.fechaIngreso DESC")
    List<Estadia> findByUsuarioIdOrderByFechaIngresoDesc(@Param("idUsuario") int idUsuario);

       @Query("SELECT COUNT(e) FROM Estadia e WHERE e.habitacion.nroHabitacion = :idHabitacion " +
           "AND e.idEstadia <> :idEstadia " +
           "AND e.estado <> 'CANCELADA' " +
           "AND e.fechaIngreso < :fechaEgreso AND e.fechaEgreso > :fechaIngreso")
    long countConflicto(
            @Param("idHabitacion") int idHabitacion,
            @Param("fechaIngreso") Date fechaIngreso,
            @Param("fechaEgreso") Date fechaEgreso,
            @Param("idEstadia") int idEstadia);
    List<Estadia> findByEstado(String estado);
}
