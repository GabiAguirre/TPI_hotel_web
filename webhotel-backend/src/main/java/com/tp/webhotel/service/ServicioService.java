package com.tp.webhotel.service;

import com.tp.webhotel.dtos.ServicioDto;
import com.tp.webhotel.model.Servicio;
import com.tp.webhotel.repository.ServicioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@AllArgsConstructor
public class ServicioService {
    private final ServicioRepository servicioRepository;

    public List<Servicio> getAll() {
        return servicioRepository.findAll();
    }

    public Servicio getById(int id) {
        return servicioRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public Servicio create(ServicioDto servicioDto) {
        return servicioRepository.save(servicioDto.toServicio());
    }

    @Transactional
    public Servicio update(int id, ServicioDto servicioDto) {
        Servicio servicioUpdate = servicioRepository.getReferenceById(id);
        servicioUpdate.setDenominacion(servicioDto.denominacion);
        servicioUpdate.setDescripcion(servicioDto.descripcion);
        servicioUpdate.setCosto(servicioDto.costo);

        return servicioRepository.save(servicioUpdate);
    }

    public void delete(int id) {
        servicioRepository.deleteById(id);
    }
    public List<Servicio> getByCostoMayorA(BigDecimal costo) {
    return servicioRepository.findByCostoGreaterThan(costo);
}
}
