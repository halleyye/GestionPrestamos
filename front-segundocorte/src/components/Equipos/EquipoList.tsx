import React, { useState, useEffect } from 'react';
import { 
    obtenerEquipos, crearEquipo, actualizarEquipo, 
    eliminarEquipo, registrarPrestamo, registrarDevolucion, 
    obtenerPrestamos
} from '../../services/equipoService';
import type { Equipo } from '../../services/equipoService';
import CatalogoUsuario from './CatalogoUsuario';

// Función auxiliar para extraer el rol del JWT sin librerías extra
const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.rol;
    } catch {
        return null;
    }
};

const EquipoList: React.FC = () => {
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // Estados para formularios inline
    const [modoFormulario, setModoFormulario] = useState<'NADA' | 'CREAR' | 'EDITAR' | 'PRESTAR'>('NADA');
    const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
    
    // Campos de formulario
    const [formData, setFormData] = useState({
        codigoPatrimonial: '', nombre: '', tipo: '', 
        solicitante: '', fechaDevolucion: ''
    });

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const data = await obtenerEquipos();
            setEquipos(data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ocurrió un error al cargar los equipos.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        setIsAdmin(getRoleFromToken() === 'ADMIN');
        cargarDatos();
    }, []);

    // Manejadores de CRUD y Lógica de Negocio
    const handleCrearOEditar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modoFormulario === 'CREAR') {
                await crearEquipo({
                    codigoPatrimonial: formData.codigoPatrimonial,
                    nombre: formData.nombre,
                    tipo: formData.tipo
                });
            } else if (modoFormulario === 'EDITAR' && equipoSeleccionado) {
                await actualizarEquipo(equipoSeleccionado.id, {
                    nombre: formData.nombre,
                    tipo: formData.tipo
                });
            }
            setModoFormulario('NADA');
            cargarDatos();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Error al procesar el equipo');
        }
    };

    const handleEliminar = async (id: number) => {
        if (!window.confirm('¿Seguro que deseas eliminar este equipo?')) return;
        try {
            await eliminarEquipo(id);
            cargarDatos();
        } catch (err: any) {
            alert(err.response?.data?.error || 'No se pudo eliminar el equipo');
        }
    };

    const handlePrestar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!equipoSeleccionado) return;
        try {
            const hoy = new Date().toISOString().split('T')[0];
            await registrarPrestamo({
                equipoId: equipoSeleccionado.id,
                nombreSolicitante: formData.solicitante,
                fechaPrestamo: hoy,
                fechaDevolucionPrevista: formData.fechaDevolucion
            });
            setModoFormulario('NADA');
            cargarDatos();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Error al registrar el préstamo');
        }
    };

    const handleDevolver = async (equipoId: number) => {
        if (!window.confirm('¿Confirmar la devolución del equipo?')) return;
        try {
            // Buscamos el préstamo ACTIVO de este equipo
            const prestamos = await obtenerPrestamos();
            const prestamoActivo = prestamos.find(p => p.equipo.id === equipoId && p.estado === 'ACTIVO');
            
            if (prestamoActivo) {
                await registrarDevolucion(prestamoActivo.id);
                cargarDatos();
            } else {
                alert('No se encontró un préstamo activo para este equipo.');
            }
        } catch (err: any) {
            alert(err.response?.data?.error || 'Error al registrar la devolución');
        }
    };

    // Preparar formularios
    const abrirFormularioCrear = () => {
        setFormData({ codigoPatrimonial: '', nombre: '', tipo: '', solicitante: '', fechaDevolucion: '' });
        setModoFormulario('CREAR');
    };

    const abrirFormularioEditar = (equipo: Equipo) => {
        setEquipoSeleccionado(equipo);
        setFormData({ ...formData, nombre: equipo.nombre, tipo: equipo.tipo });
        setModoFormulario('EDITAR');
    };

    const abrirFormularioPrestar = (equipo: Equipo) => {
        setEquipoSeleccionado(equipo);
        setFormData({ ...formData, solicitante: '', fechaDevolucion: '' });
        setModoFormulario('PRESTAR');
    };

    if (cargando && equipos.length === 0) return <p className="state-box">Cargando equipos, por favor espera...</p>;
    if (error) return <p className="state-box state-box--error" role="alert">{error}</p>;

    // Vista de usuario: catálogo visual con imágenes (el admin conserva la tabla de gestión)
    if (!isAdmin) return <CatalogoUsuario equipos={equipos} />;

    return (
        <section className="equipo-list-container">
            <div className="equipo-list-header">
                <div>
                    <h2>Catálogo de equipos</h2>
                    <p>{equipos.length} {equipos.length === 1 ? 'equipo registrado' : 'equipos registrados'}</p>
                </div>
                {isAdmin && (
                    <button className="btn btn--primary" onClick={abrirFormularioCrear}>
                        + Nuevo Equipo
                    </button>
                )}
            </div>

            {/* Formulario Inline para Crear/Editar */}
            {(modoFormulario === 'CREAR' || modoFormulario === 'EDITAR') && (
                <div className="table-wrapper" style={{ padding: 'var(--space-5)', marginBottom: '1rem' }}>
                    <h3>{modoFormulario === 'CREAR' ? 'Registrar Nuevo Equipo' : `Editar Equipo: ${equipoSeleccionado?.codigoPatrimonial}`}</h3>
                    <form className="login-form" onSubmit={handleCrearOEditar} style={{ marginTop: '1rem' }}>
                        {modoFormulario === 'CREAR' && (
                            <div className="form-field">
                                <label>Código Patrimonial</label>
                                <input required value={formData.codigoPatrimonial} onChange={e => setFormData({...formData, codigoPatrimonial: e.target.value})} />
                            </div>
                        )}
                        <div className="form-field">
                            <label>Nombre</label>
                            <input required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                        </div>
                        <div className="form-field">
                            <label>Tipo</label>
                            <input required value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn--primary">Guardar</button>
                            <button type="button" className="btn btn--ghost" onClick={() => setModoFormulario('NADA')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Formulario Inline para Prestar */}
            {modoFormulario === 'PRESTAR' && (
                <div className="table-wrapper" style={{ padding: 'var(--space-5)', marginBottom: '1rem' }}>
                    <h3>Prestar Equipo: {equipoSeleccionado?.nombre} ({equipoSeleccionado?.codigoPatrimonial})</h3>
                    <form className="login-form" onSubmit={handlePrestar} style={{ marginTop: '1rem' }}>
                        <div className="form-field">
                            <label>Nombre del Solicitante</label>
                            <input required value={formData.solicitante} onChange={e => setFormData({...formData, solicitante: e.target.value})} />
                        </div>
                        <div className="form-field">
                            <label>Fecha de Devolución Prevista</label>
                            <input type="date" required min={new Date().toISOString().split('T')[0]} value={formData.fechaDevolucion} onChange={e => setFormData({...formData, fechaDevolucion: e.target.value})} />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn--primary">Registrar Préstamo</button>
                            <button type="button" className="btn btn--ghost" onClick={() => setModoFormulario('NADA')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            {equipos.length === 0 ? (
                <p className="state-box">No hay equipos registrados actualmente en el sistema.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="equipo-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                {isAdmin && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {equipos.map((equipo) => (
                                <tr key={equipo.id}>
                                    <td className="cell-code">{equipo.codigoPatrimonial}</td>
                                    <td className="cell-name">{equipo.nombre}</td>
                                    <td>{equipo.tipo}</td>
                                    <td>
                                        <span className={`badge ${equipo.estado === 'DISPONIBLE' ? 'badge--ok' : 'badge--warn'}`}>
                                            {equipo.estado}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {equipo.estado === 'DISPONIBLE' ? (
                                                    <>
                                                        <button className="btn btn--ghost" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => abrirFormularioPrestar(equipo)}>Prestar</button>
                                                        <button className="btn btn--ghost" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => abrirFormularioEditar(equipo)}>Editar</button>
                                                        <button className="btn btn--ghost" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--danger-text)' }} onClick={() => handleEliminar(equipo.id)}>Eliminar</button>
                                                    </>
                                                ) : (
                                                    <button className="btn btn--ghost" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleDevolver(equipo.id)}>Devolver</button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default EquipoList;