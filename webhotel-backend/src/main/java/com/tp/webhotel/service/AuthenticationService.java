package com.tp.webhotel.service;


import com.tp.webhotel.model.Rol;
import com.tp.webhotel.model.Usuario;
import com.tp.webhotel.repository.UsuarioRepository;
import com.tp.webhotel.security.AunthenticationResponse;
import com.tp.webhotel.security.AuthenticationRequest;
import com.tp.webhotel.security.JwtService;
import com.tp.webhotel.security.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;
    public AunthenticationResponse register(RegisterRequest request) {
        var user = Usuario.builder()
                .nombre(request.getNombre())
               .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .dni(request.getDni())
                .rol(Rol.USER)
                .enabled(true)
                .build();
        usuarioRepository.save(user);
        var extraClaims = new java.util.HashMap<String, Object>();
        extraClaims.put("nombre", user.getNombre());
        extraClaims.put("userId", user.getId());
        extraClaims.put("rol", user.getRol().name());
        var jwtToken = jwtService.generateToken(extraClaims, user);
        return AunthenticationResponse.builder().token(jwtToken).build();
    }

    public AunthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = usuarioRepository.findOneByEmail(request.getEmail())
                .orElseThrow();

        var extraClaims = new java.util.HashMap<String, Object>();
        extraClaims.put("nombre", user.getNombre());
        extraClaims.put("userId", user.getId());
        extraClaims.put("rol", user.getRol().name());
        var jwtToken = jwtService.generateToken(extraClaims, user);
        return AunthenticationResponse.builder().token(jwtToken).build();
    }
}
