package com.tp.webhotel.controller;



import com.tp.webhotel.dtos.UsuarioDto;
import com.tp.webhotel.model.Usuario;
import com.tp.webhotel.service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/user")
@AllArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;


    @PutMapping
    public Usuario update(int id, UsuarioDto usuarioDto){
        return usuarioService.update(id,usuarioDto);
    }


    @PutMapping(path = "/register")
    @ResponseStatus(HttpStatus.OK)
    public Usuario register(int id, UsuarioDto usuarioDto){
        return usuarioService.create(id,usuarioDto);
    }

    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") int id){
        usuarioService.delete(id);
    }


}
