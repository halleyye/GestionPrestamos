package com.prestamos.api.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "equipos")
public class Equipo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "codigo_patrimonial", unique = true, nullable = false)
    private String codigoPatrimonial;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private String estado; // 'DISPONIBLE' o 'PRESTADO'

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getCodigoPatrimonial() { return codigoPatrimonial; }
    public void setCodigoPatrimonial(String codigoPatrimonial) { this.codigoPatrimonial = codigoPatrimonial; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}