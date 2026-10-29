import React, { useMemo, useState } from 'react';
import type { Equipo } from '../../services/equipoService';
import EquipoImagen from './EquipoImagen';
import './CatalogoUsuario.css';

type Filtro = 'TODOS' | 'DISPONIBLES' | 'PRESTAMO';

interface CatalogoUsuarioProps {
    equipos: Equipo[];
}

const normalizar = (t: string) =>
    t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const CatalogoUsuario: React.FC<CatalogoUsuarioProps> = ({ equipos }) => {
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState<Filtro>('TODOS');

    const disponibles = equipos.filter((e) => e.estado === 'DISPONIBLE').length;
    const enPrestamo = equipos.length - disponibles;

    const visibles = useMemo(() => {
        const q = normalizar(busqueda.trim());
        return equipos.filter((e) => {
            const coincideFiltro =
                filtro === 'TODOS' ||
                (filtro === 'DISPONIBLES' && e.estado === 'DISPONIBLE') ||
                (filtro === 'PRESTAMO' && e.estado !== 'DISPONIBLE');
            const coincideTexto =
                !q || normalizar(`${e.nombre} ${e.tipo} ${e.codigoPatrimonial}`).includes(q);
            return coincideFiltro && coincideTexto;
        });
    }, [equipos, busqueda, filtro]);

    const filtros: { id: Filtro; label: string; total: number }[] = [
        { id: 'TODOS', label: 'Todos', total: equipos.length },
        { id: 'DISPONIBLES', label: 'Disponibles', total: disponibles },
        { id: 'PRESTAMO', label: 'En préstamo', total: enPrestamo },
    ];

    return (
        <section className="catalogo">
            <div className="catalogo-hero">
                <div className="catalogo-hero__text">
                    <h2>Equipos para tus clases y proyectos</h2>
                    <p>Explora el catálogo y revisa qué equipos están listos para ser solicitados.</p>
                </div>
                <dl className="catalogo-stats">
                    <div>
                        <dt>Disponibles</dt>
                        <dd>{disponibles}</dd>
                    </div>
                    <div>
                        <dt>En préstamo</dt>
                        <dd>{enPrestamo}</dd>
                    </div>
                    <div>
                        <dt>Total</dt>
                        <dd>{equipos.length}</dd>
                    </div>
                </dl>
            </div>

            <div className="catalogo-toolbar">
                <input
                    className="catalogo-search"
                    type="search"
                    placeholder="Buscar por nombre, tipo o código"
                    aria-label="Buscar equipos"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <div className="catalogo-chips" role="group" aria-label="Filtrar por estado">
                    {filtros.map((f) => (
                        <button
                            key={f.id}
                            type="button"
                            className={`chip ${filtro === f.id ? 'chip--active' : ''}`}
                            aria-pressed={filtro === f.id}
                            onClick={() => setFiltro(f.id)}
                        >
                            {f.label}
                            <span className="chip__count">{f.total}</span>
                        </button>
                    ))}
                </div>
            </div>

            {equipos.length === 0 ? (
                <p className="state-box">No hay equipos registrados actualmente en el sistema.</p>
            ) : visibles.length === 0 ? (
                <p className="state-box">Ningún equipo coincide con tu búsqueda. Prueba con otro nombre o cambia el filtro.</p>
            ) : (
                <ul className="equipo-grid">
                    {visibles.map((equipo) => {
                        const libre = equipo.estado === 'DISPONIBLE';
                        const imagenUrl = (equipo as Equipo & { imagenUrl?: string | null }).imagenUrl;
                        return (
                            <li key={equipo.id} className={`equipo-card ${libre ? '' : 'equipo-card--ocupado'}`}>
                                <div className="equipo-card__media">
                                    <EquipoImagen tipo={equipo.tipo} nombre={equipo.nombre} imagenUrl={imagenUrl} />
                                    <span className={`badge equipo-card__badge ${libre ? 'badge--ok' : 'badge--warn'}`}>
                                        {libre ? 'Disponible' : equipo.estado}
                                    </span>
                                </div>
                                <div className="equipo-card__body">
                                    <p className="equipo-card__tipo">{equipo.tipo}</p>
                                    <h3 className="equipo-card__nombre">{equipo.nombre}</h3>
                                    <p className="equipo-card__codigo">Código {equipo.codigoPatrimonial}</p>
                                </div>
                                <p className="equipo-card__footer">
                                    {libre ? 'Listo para solicitar en el centro' : 'Aún no está disponible'}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
};

export default CatalogoUsuario;