package com.prestamos.api.repositories;

// Asumiendo que crearás la entidad Prestamo luego
import com.prestamos.api.entities.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrestamoRepository extends JpaRepository<Prestamo, Integer> {
    boolean existsByEquipoIdAndEstado(Integer equipoId, String estado);
}

