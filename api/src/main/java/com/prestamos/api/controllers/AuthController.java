package com.prestamos.api.controllers;

import com.prestamos.api.dto.AuthResponse;
import com.prestamos.api.dto.LoginRequest;
import com.prestamos.api.entities.Usuario;
import com.prestamos.api.repositories.UsuarioRepository;
import com.prestamos.api.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(request.getUsername());
        
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Verificar contraseña
            if (passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
                String token = jwtUtil.generateToken(usuario.getUsername(), usuario.getRol());
                return ResponseEntity.ok(new AuthResponse(token));
            }
        }
        // Retornar 401 ante credenciales incorrectas
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
    }
}