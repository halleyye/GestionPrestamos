package com.prestamos.api.controllers;

import com.prestamos.api.entities.Equipo;
import com.prestamos.api.services.EquipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

    @Autowired
    private EquipoService equipoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // Ambos pueden listar
    public ResponseEntity<List<Equipo>> listarEquipos() {
        return ResponseEntity.ok(equipoService.listarTodos()); // 200 OK
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // Ambos pueden consultar
    public ResponseEntity<Equipo> obtenerEquipo(@PathVariable Integer id) {
        return equipoService.buscarPorId(id)
                .map(ResponseEntity::ok) // 200 OK
                .orElse(ResponseEntity.notFound().build()); // 404 Not Found
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Solo ADMIN
    public ResponseEntity<Equipo> registrarEquipo(@RequestBody Equipo equipo) {
        if (equipo.getCodigoPatrimonial() == null || equipo.getNombre() == null || equipo.getTipo() == null) {
            return ResponseEntity.badRequest().build(); // 400 ante datos inválidos
        }
        Equipo nuevoEquipo = equipoService.crear(equipo);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEquipo); // 201 Created
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Solo ADMIN
    public ResponseEntity<Equipo> modificarEquipo(@PathVariable Integer id, @RequestBody Equipo equipo) {
        if (equipo.getNombre() == null || equipo.getTipo() == null) {
            return ResponseEntity.badRequest().build(); // 400 ante datos inválidos
        }
        return ResponseEntity.ok(equipoService.actualizar(id, equipo)); // 200 OK
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Solo ADMIN
    public ResponseEntity<Void> eliminarEquipo(@PathVariable Integer id) {
        equipoService.eliminar(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}