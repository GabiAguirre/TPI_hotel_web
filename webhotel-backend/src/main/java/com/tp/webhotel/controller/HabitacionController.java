package com.tp.webhotel.controller;

import com.tp.webhotel.dtos.HabitacionDto;
import com.tp.webhotel.model.Habitacion;
import com.tp.webhotel.model.TipoHabitacion;
import com.tp.webhotel.service.HabitacionService;
import com.tp.webhotel.service.TipoHabitacionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

//@CrossOrigin(origins = {"http://localhost:8080"}) Esto se utiliza para permitir las peticiones de ciertos origenes unicamente, cuando tengamos el front lo descomentamos
@RestController
@RequestMapping(path = "api/habitaciones")
@AllArgsConstructor
@Validated
public class HabitacionController {
    private final HabitacionService habitacionService;
    private final TipoHabitacionService tipoHabitacionService;

    @GetMapping
    public List<Habitacion> getAll() {
        return habitacionService.getAll();
    }

    @GetMapping("/{id}")
    public Habitacion getById(@PathVariable("id") int id){
        return habitacionService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public Habitacion create(@RequestBody @Valid HabitacionDto habitacionDto) {
        Habitacion habitacion = new Habitacion();
        TipoHabitacion tipoHabitacion = tipoHabitacionService.getById(habitacionDto.idTipoHabitacion);
        habitacion.setNroHabitacion(habitacionDto.nroHabitacion);
        habitacion.setTipoHabitacion(tipoHabitacion);
        return habitacionService.create(habitacion);
    }

    @PutMapping(path = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Habitacion update(@PathVariable("id") int id, @RequestBody @Valid HabitacionDto habitacionDto) {
        TipoHabitacion tipoHabitacion = tipoHabitacionService.getById(habitacionDto.idTipoHabitacion);
        Habitacion habitacion = new Habitacion();
        habitacion.setTipoHabitacion(tipoHabitacion);
        habitacion.setNroHabitacion(habitacionDto.nroHabitacion);
        return habitacionService.update(id,habitacion);

    }

    @DeleteMapping(path = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") int id){
        habitacionService.delete(id);
    }
}
