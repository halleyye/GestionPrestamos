package com.prestamos.api.services;

import com.prestamos.api.dto.PrestamoRequest;
import com.prestamos.api.entities.Equipo;
import com.prestamos.api.entities.Prestamo;
import com.prestamos.api.repositories.EquipoRepository;
import com.prestamos.api.repositories.PrestamoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PrestamoService {

    @Autowired
    private PrestamoRepository prestamoRepository;

    @Autowired
    private EquipoRepository equipoRepository;

    public List<Prestamo> listarTodos() {
        return prestamoRepository.findAll();
    }

    @Transactional // Garantiza que si falla algo, no se guarde ni el préstamo ni el equipo
    public Prestamo registrarPrestamo(PrestamoRequest request) {
        // 1. Validar fechas: la fecha prevista no puede ser anterior a la fecha de préstamo[cite: 1]
        if (request.getFechaDevolucionPrevista().isBefore(request.getFechaPrestamo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha de devolución no puede ser anterior a la del préstamo");
        }

        // 2. Buscar el equipo
        Equipo equipo = equipoRepository.findById(request.getEquipoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo no encontrado"));

        // 3. Regla: No se podrá registrar un préstamo activo para un equipo que ya esté PRESTADO[cite: 1]
        if ("PRESTADO".equalsIgnoreCase(equipo.getEstado())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El equipo ya se encuentra prestado");
        }

        // 4. Cambiar estado del equipo a PRESTADO[cite: 1]
        equipo.setEstado("PRESTADO");
        equipoRepository.save(equipo);

        // 5. Crear y guardar el préstamo
        Prestamo prestamo = new Prestamo();
        prestamo.setEquipo(equipo);
        prestamo.setNombreSolicitante(request.getNombreSolicitante());
        prestamo.setFechaPrestamo(request.getFechaPrestamo());
        prestamo.setFechaDevolucionPrevista(request.getFechaDevolucionPrevista());
        prestamo.setEstado("ACTIVO");

        return prestamoRepository.save(prestamo);
    }

    @Transactional
    public Prestamo registrarDevolucion(Integer prestamoId) {
        Prestamo prestamo = prestamoRepository.findById(prestamoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Préstamo no encontrado"));

        if ("DEVUELTO".equalsIgnoreCase(prestamo.getEstado())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El préstamo ya fue devuelto anteriormente");
        }

        // 1. Cambiar estado del préstamo
        prestamo.setEstado("DEVUELTO");

        // 2. Cambiar estado del equipo asociado a DISPONIBLE[cite: 1]
        Equipo equipo = prestamo.getEquipo();
        equipo.setEstado("DISPONIBLE");
        
        equipoRepository.save(equipo);
        return prestamoRepository.save(prestamo);
    }
}