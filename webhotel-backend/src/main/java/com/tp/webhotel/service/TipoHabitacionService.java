package com.tp.webhotel.service;

import com.tp.webhotel.dtos.TipoHabitacionDto;
import javax.persistence.EntityNotFoundException;
import com.tp.webhotel.model.TipoHabitacion;
import com.tp.webhotel.repository.TipoHabitacionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@AllArgsConstructor
public class TipoHabitacionService {

    private TipoHabitacionRepository tipoHabitacionRepository;


    public List<TipoHabitacion> getAll() {
        return tipoHabitacionRepository.findAll();
    }

    public TipoHabitacion getById(int id){
        return tipoHabitacionRepository.findById(id).orElseThrow(EntityNotFoundException::new);

    }


    public TipoHabitacion create(TipoHabitacionDto tipoHabitacionDto) {
       return tipoHabitacionRepository.save(tipoHabitacionDto.toTipoHabitacion());
    }

    @Transactional
    public TipoHabitacion update(int id,TipoHabitacionDto tipoHabitacionDto) {
        TipoHabitacion tipoHabitacionUpdate = tipoHabitacionRepository.getReferenceById(id);
        tipoHabitacionUpdate.setDescripcion(tipoHabitacionDto.descripcion);
        tipoHabitacionUpdate.setDenominacion(tipoHabitacionDto.denominacion);
        tipoHabitacionUpdate.setCapacidadPersonas(tipoHabitacionDto.cantidadPersonas);
        tipoHabitacionUpdate.setPrecioPorDia(tipoHabitacionDto.precioPorDia);

        return tipoHabitacionRepository.save(tipoHabitacionUpdate);


    }


    public void delete(int id) {
        tipoHabitacionRepository.deleteById(id);
    }
}
