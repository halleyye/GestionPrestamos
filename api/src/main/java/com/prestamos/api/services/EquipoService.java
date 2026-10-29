package com.prestamos.api.services;

import com.prestamos.api.entities.Equipo;
import com.prestamos.api.repositories.EquipoRepository;
import com.prestamos.api.repositories.PrestamoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class EquipoService {

    @Autowired
    private EquipoRepository equipoRepository;

    @Autowired
    private PrestamoRepository prestamoRepository;

    public List<Equipo> listarTodos() {
        return equipoRepository.findAll();
    }

    public Optional<Equipo> buscarPorId(Integer id) {
        return equipoRepository.findById(id);
    }

    public Equipo crear(Equipo equipo) {
        if (equipoRepository.existsByCodigoPatrimonial(equipo.getCodigoPatrimonial())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El código patrimonial ya existe");
        }
        equipo.setEstado("DISPONIBLE"); // Por defecto al crear
        return equipoRepository.save(equipo);
    }

    public Equipo actualizar(Integer id, Equipo equipoActualizado) {
        return equipoRepository.findById(id).map(equipo -> {
            equipo.setNombre(equipoActualizado.getNombre());
            equipo.setTipo(equipoActualizado.getTipo());
            // No actualizamos el código patrimonial ni el estado directamente aquí para proteger la lógica
            return equipoRepository.save(equipo);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo no encontrado"));
    }

    public void eliminar(Integer id) {
        if (!equipoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo no encontrado");
        }
        
        // Regla: No se permitirá eliminar un equipo con préstamos activos
        if (prestamoRepository.existsByEquipoIdAndEstado(id, "ACTIVO")) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No se puede eliminar un equipo con préstamos activos");
        }
        
        equipoRepository.deleteById(id);
    }
}