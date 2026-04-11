package com.tp.webhotel.controller;

import com.tp.webhotel.dtos.ServicioDto;
import com.tp.webhotel.model.Servicio;
import com.tp.webhotel.service.ServicioService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping(path = "/api/servicios")
@AllArgsConstructor
@Validated
public class ServicioController {
    private final ServicioService servicioService;

    @GetMapping
    public List<Servicio> getAll(){return servicioService.getAll();}

    @GetMapping("/{id}")
    public Servicio getById(@PathVariable("id") int id){
        return servicioService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public void create(@RequestBody @Valid ServicioDto servicioDto){
        servicioService.create(servicioDto);
    }

    @PutMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Servicio update(@PathVariable("id") int id, @RequestBody @Valid ServicioDto servicioDto){
        return servicioService.update(id,servicioDto);
    }

    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") int id){
        servicioService.delete(id);
    }
    @GetMapping("/precio-mayor")
    public List<Servicio> getByCostoMayorA(@RequestParam("valor") BigDecimal valor) {
    return servicioService.getByCostoMayorA(valor);
}


}
