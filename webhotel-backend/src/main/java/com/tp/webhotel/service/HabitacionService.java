package com.tp.webhotel.service;

import com.tp.webhotel.model.Habitacion;
import com.tp.webhotel.repository.HabitacionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.List;

@Service
@AllArgsConstructor
public class HabitacionService {

    private HabitacionRepository habitacionRepository;

    public List<Habitacion> getAll() {
        return habitacionRepository.findAll();
    }

    public Habitacion getById(int id) {
        return habitacionRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public Habitacion create(Habitacion habitacion) {
        return habitacionRepository.save(habitacion);
    }

    @Transactional
    public Habitacion update(int id,Habitacion habitacion) {
        Habitacion habitacionUpdate = habitacionRepository.getReferenceById(id);
        habitacionUpdate.setNroHabitacion(habitacion.getNroHabitacion());
        habitacionUpdate.setTipoHabitacion(habitacion.getTipoHabitacion());
        return habitacionRepository.save(habitacionUpdate);

    }

    public void delete(int id) {
        habitacionRepository.deleteById(id);
    }


}
