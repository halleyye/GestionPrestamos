package com.prestamos.api.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Maneja las excepciones de negocio (404 Not Found, 409 Conflict, 400 Bad Request) lanzadas en los Services[cite: 2]
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex) {
        ErrorResponse errorResponse = new ErrorResponse(ex.getReason(), ex.getStatusCode().value());
        return ResponseEntity.status(ex.getStatusCode()).body(errorResponse);
    }

    // 2. Maneja errores de base de datos (Ej: intentar guardar un código patrimonial duplicado) -> 409 Conflict[cite: 2]
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        ErrorResponse errorResponse = new ErrorResponse("Conflicto de datos: el registro ya existe o viola una restricción", HttpStatus.CONFLICT.value());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    // 3. Maneja JSON mal formado en las peticiones POST/PUT -> 400 Bad Request[cite: 2]
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        ErrorResponse errorResponse = new ErrorResponse("Datos inválidos o formato JSON incorrecto", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // 4. Maneja intentos de acceso a rutas sin el rol adecuado (Ej: USER intentando crear un equipo) -> 403 Forbidden[cite: 2]
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        ErrorResponse errorResponse = new ErrorResponse("No tienes permisos suficientes para realizar esta acción", HttpStatus.FORBIDDEN.value());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }
}