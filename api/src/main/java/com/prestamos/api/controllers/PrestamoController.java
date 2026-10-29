package com.prestamos.api.controllers;

import com.prestamos.api.dto.PrestamoRequest;
import com.prestamos.api.entities.Prestamo;
import com.prestamos.api.services.PrestamoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prestamos")
public class PrestamoController {

    @Autowired
    private PrestamoService prestamoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // USER y ADMIN pueden listar
    public ResponseEntity<List<Prestamo>> listarPrestamos() {
        return ResponseEntity.ok(prestamoService.listarTodos());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Solo ADMIN
    public ResponseEntity<Prestamo> registrarPrestamo(@RequestBody PrestamoRequest request) {
        if (request.getEquipoId() == null || request.getNombreSolicitante() == null 
            || request.getFechaPrestamo() == null || request.getFechaDevolucionPrevista() == null) {
            return ResponseEntity.badRequest().build(); // 400 ante datos inválidos[cite: 2]
        }
        Prestamo nuevoPrestamo = prestamoService.registrarPrestamo(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPrestamo); // 201 Created[cite: 2]
    }

    @PutMapping("/{id}/devolver")
    @PreAuthorize("hasRole('ADMIN')") // Solo ADMIN
    public ResponseEntity<Prestamo> registrarDevolucion(@PathVariable Integer id) {
        Prestamo prestamoDevuelto = prestamoService.registrarDevolucion(id);
        return ResponseEntity.ok(prestamoDevuelto); // 200 OK[cite: 2]
    }
}