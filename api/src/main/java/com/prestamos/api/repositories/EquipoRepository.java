package com.prestamos.api.repositories;

import com.prestamos.api.entities.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipoRepository extends JpaRepository<Equipo, Integer> {
    boolean existsByCodigoPatrimonial(String codigoPatrimonial);
}