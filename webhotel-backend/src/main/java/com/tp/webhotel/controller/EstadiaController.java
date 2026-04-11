package com.tp.webhotel.controller;

import com.tp.webhotel.dtos.EstadiaRequestDto;
import com.tp.webhotel.model.Estadia;
import com.tp.webhotel.model.Habitacion;
import com.tp.webhotel.model.Usuario;
import com.tp.webhotel.service.EstadiaService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/estadias")
@AllArgsConstructor
@Validated
@Slf4j
public class EstadiaController {

    private final EstadiaService estadiaService;

    @GetMapping("/disponibilidad")
    public List<Habitacion> verificarDisponibilidad(
            @RequestParam int idTipoHabitacion,
            @RequestParam String fechaIngreso,
            @RequestParam String fechaEgreso) {
        log.info("[verificarDisponibilidad] idTipoHabitacion={}, fechaIngreso={}, fechaEgreso={}",
                idTipoHabitacion, fechaIngreso, fechaEgreso);
        return estadiaService.verificarDisponibilidad(
                idTipoHabitacion,
                Date.valueOf(fechaIngreso),
                Date.valueOf(fechaEgreso));
    }

    @PostMapping
    public ResponseEntity<Estadia> crear(
            @RequestBody @Valid EstadiaRequestDto dto,
            Authentication auth) {
        log.info("[crear] body={}", dto);
        Usuario usuario = (Usuario) auth.getPrincipal();
        return ResponseEntity.ok(estadiaService.crear(dto, usuario));
    }

    @GetMapping("/mis-estadias")
    public List<Estadia> getMisEstadias(Authentication auth) {
        Usuario usuario = (Usuario) auth.getPrincipal();
        return estadiaService.getMisEstadias(usuario.getId());
    }

    @GetMapping
    public List<Estadia> getAll() {
        return estadiaService.getAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estadia> modificar(
            @PathVariable int id,
            @RequestBody @Valid EstadiaRequestDto dto,
            Authentication auth) {
        Usuario usuario = (Usuario) auth.getPrincipal();
        return ResponseEntity.ok(estadiaService.modificar(id, dto, usuario));
    }

    @PatchMapping("/{id}/cancelar")
    @ResponseStatus(HttpStatus.OK)
    public void cancelar(@PathVariable int id, Authentication auth) {
        Usuario usuario = (Usuario) auth.getPrincipal();
        estadiaService.cancelar(id, usuario);
    }

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<Estadia> confirmar(@PathVariable int id, Authentication auth) {
        Usuario usuario = (Usuario) auth.getPrincipal();
        return ResponseEntity.ok(estadiaService.confirmar(id, usuario));
    }
    @GetMapping("/confirmadas")
    public List<Estadia> getConfirmadas() {
        return estadiaService.getConfirmadas();
    }
    @GetMapping("/en-curso")
    public List<Estadia> getEnCurso() {
        return estadiaService.getEnCurso();
    }
    @PatchMapping("/{id}/check-in")
    public ResponseEntity<Estadia> checkIn(@PathVariable int id, Authentication auth) {
        Usuario usuario = (Usuario) auth.getPrincipal();
        return ResponseEntity.ok(estadiaService.checkIn(id, usuario));
    }
    @PatchMapping("/{id}/check-out")
    public ResponseEntity<Estadia> checkOut(@PathVariable int id, Authentication auth) {
        Usuario usuario = (Usuario) auth.getPrincipal();
        return ResponseEntity.ok(estadiaService.checkOut(id, usuario));
    }
}
