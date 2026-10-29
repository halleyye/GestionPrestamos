import api from './api';

export interface Equipo {
    id: number;
    codigoPatrimonial: string;
    nombre: string;
    tipo: string;
    estado: string;
}

export interface PrestamoRequest {
    equipoId: number;
    nombreSolicitante: string;
    fechaPrestamo: string;
    fechaDevolucionPrevista: string;
}

export const obtenerEquipos = async (): Promise<Equipo[]> => {
    const response = await api.get('/equipos');
    return response.data;
};

export const crearEquipo = async (equipo: Partial<Equipo>): Promise<Equipo> => {
    const response = await api.post('/equipos', equipo);
    return response.data;
};

export const actualizarEquipo = async (id: number, equipo: Partial<Equipo>): Promise<Equipo> => {
    const response = await api.put(`/equipos/${id}`, equipo);
    return response.data;
};

export const eliminarEquipo = async (id: number): Promise<void> => {
    await api.delete(`/equipos/${id}`);
};

export const registrarPrestamo = async (prestamo: PrestamoRequest): Promise<void> => {
    await api.post('/prestamos', prestamo);
};

export const obtenerPrestamos = async (): Promise<any[]> => {
    const response = await api.get('/prestamos');
    return response.data;
};

export const registrarDevolucion = async (prestamoId: number): Promise<void> => {
    await api.put(`/prestamos/${prestamoId}/devolver`);
};