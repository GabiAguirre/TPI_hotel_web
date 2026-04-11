package com.tp.webhotel.repository;

import com.tp.webhotel.model.Servicio;



import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Integer> {
    List<Servicio> findByCostoGreaterThan(BigDecimal costo);
}
