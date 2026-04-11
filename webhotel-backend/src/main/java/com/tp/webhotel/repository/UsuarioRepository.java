package com.tp.webhotel.repository;

import com.tp.webhotel.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario,Integer> {

    public Optional<Usuario> findOneByEmail(String email);
}
