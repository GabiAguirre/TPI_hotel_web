package com.tp.webhotel.controller;

import com.tp.webhotel.dtos.TipoHabitacionDto;
import com.tp.webhotel.model.TipoHabitacion;
import com.tp.webhotel.service.ImagenHabitacionService;
import com.tp.webhotel.service.TipoHabitacionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

//@CrossOrigin(origins = {"http://localhost:8080"}) Esto se utiliza para permitir las peticiones de ciertos origenes unicamente, cuando tengamos el front lo descomentamos
@RestController
@RequestMapping(path = "/api/tipohabitaciones")
@AllArgsConstructor
@Validated
public class TipoHabitacionController {

    private final TipoHabitacionService tipoHabitacionService;
    private final ImagenHabitacionService imagenHabitacionService;

    @GetMapping
    public List<TipoHabitacion> getAll() {
        return tipoHabitacionService.getAll();
    }

    @GetMapping("/{id}")
    public TipoHabitacion getById(@PathVariable("id") int id){ return tipoHabitacionService.getById(id);}

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public void create(@RequestBody @Valid TipoHabitacionDto tipoHabitacionDto){
        tipoHabitacionService.create(tipoHabitacionDto);
    }

    @GetMapping("/{idTipoHabitacion}/imagenes")
    @ResponseStatus(HttpStatus.OK)
    public List<byte[]> descargarImagenes(@PathVariable("idTipoHabitacion") TipoHabitacion id_tipo_habitacion) throws IOException {
        return imagenHabitacionService.descargarImagenes(id_tipo_habitacion);
    }

    @PostMapping("/{idTipoHabitacion}/imagen")
    @ResponseStatus(HttpStatus.OK)
    public void subirImagen(@RequestBody @Valid MultipartFile archivo, @PathVariable("idTipoHabitacion") TipoHabitacion id_tipo_habitacion) throws IOException {
        imagenHabitacionService.subirImagen(archivo, id_tipo_habitacion);
    }

    @PutMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TipoHabitacion update(@PathVariable("id") int id,@RequestBody @Valid TipoHabitacionDto tipoHabitacionDto) {
        return tipoHabitacionService.update(id, tipoHabitacionDto);
    }
    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") int id){
        tipoHabitacionService.delete(id);
    }
}
