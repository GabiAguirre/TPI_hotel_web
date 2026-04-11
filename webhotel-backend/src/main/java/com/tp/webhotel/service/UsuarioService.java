package com.tp.webhotel.service;

import com.tp.webhotel.dtos.UsuarioDto;
import com.tp.webhotel.model.Usuario;
import com.tp.webhotel.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;

@Service
@AllArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;




    public Usuario update(int id,UsuarioDto usuarioDto) {
        Usuario usuarioUpdate = new Usuario();
        usuarioUpdate = usuarioRepository.findById(id).orElseThrow(EntityNotFoundException::new);

        usuarioUpdate.setDni(usuarioDto.dni);
        usuarioUpdate.setNroTarjetaCredito(usuarioDto.nroTarjetaCredito);

        return usuarioRepository.save(usuarioUpdate);

    }


    public Usuario create(int id, UsuarioDto usuarioDto) {
        Usuario usuarioCreate = new Usuario();

        usuarioCreate = usuarioRepository.findById(id).orElseThrow(EntityNotFoundException::new);

        usuarioCreate.setNombre(usuarioDto.nombre);
        usuarioCreate.setApellido(usuarioDto.apellido);
        usuarioCreate.setNroTarjetaCredito(usuarioDto.nroTarjetaCredito);
        usuarioCreate.setDni(usuarioDto.dni);

        return usuarioRepository.save(usuarioCreate);




    }

    public void delete(int id) {
        usuarioRepository.deleteById(id);
    }
}
