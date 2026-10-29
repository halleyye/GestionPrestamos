import React, { useState } from 'react';

// Ilustraciones de línea por tipo de equipo (se usan cuando no hay foto real)
const normalizar = (t: string) =>
    t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

type Categoria = 'laptop' | 'proyector' | 'camara' | 'tablet' | 'monitor' | 'audio' | 'generico';

const detectarCategoria = (tipo: string, nombre: string): Categoria => {
    const t = normalizar(`${tipo} ${nombre}`);
    if (/laptop|portatil|notebook|macbook/.test(t)) return 'laptop';
    if (/proyector|projector|datashow/.test(t)) return 'proyector';
    if (/camara|camera|webcam/.test(t)) return 'camara';
    if (/tablet|ipad/.test(t)) return 'tablet';
    if (/monitor|pantalla|display|tv|television/.test(t)) return 'monitor';
    if (/microfono|parlante|bocina|audio|altavoz|speaker/.test(t)) return 'audio';
    return 'generico';
};

const dibujos: Record<Categoria, React.ReactNode> = {
    laptop: (
        <>
            <rect x="24" y="14" width="72" height="46" rx="4" />
            <path d="M10 68h100l-6 8H16z" />
            <path d="M52 64h16" />
        </>
    ),
    proyector: (
        <>
            <rect x="14" y="28" width="92" height="34" rx="8" />
            <circle cx="76" cy="45" r="11" />
            <circle cx="76" cy="45" r="4" />
            <path d="M26 40h18M26 46h18M26 52h18M30 62v7M90 62v7" />
        </>
    ),
    camara: (
        <>
            <rect x="16" y="28" width="88" height="48" rx="8" />
            <path d="M40 28l5-9h30l5 9" />
            <circle cx="60" cy="52" r="15" />
            <circle cx="60" cy="52" r="6" />
            <circle cx="91" cy="38" r="2" />
        </>
    ),
    tablet: (
        <>
            <rect x="30" y="8" width="60" height="74" rx="7" />
            <circle cx="60" cy="74" r="2.5" />
            <path d="M52 15h16" />
        </>
    ),
    monitor: (
        <>
            <rect x="14" y="12" width="92" height="54" rx="5" />
            <path d="M60 66v12M42 78h36" />
        </>
    ),
    audio: (
        <>
            <rect x="34" y="8" width="52" height="74" rx="8" />
            <circle cx="60" cy="28" r="7" />
            <circle cx="60" cy="58" r="14" />
            <circle cx="60" cy="58" r="5" />
        </>
    ),
    generico: (
        <>
            <rect x="34" y="26" width="52" height="40" rx="6" />
            <path d="M46 26v-8M60 26v-8M74 26v-8M46 66v8M60 66v8M74 66v8M34 40h-8M34 52h-8M86 40h8M86 52h8" />
            <rect x="48" y="38" width="24" height="16" rx="3" />
        </>
    ),
};

interface EquipoImagenProps {
    tipo: string;
    nombre: string;
    imagenUrl?: string | null;
}

const EquipoImagen: React.FC<EquipoImagenProps> = ({ tipo, nombre, imagenUrl }) => {
    const [fallo, setFallo] = useState(false);

    if (imagenUrl && !fallo) {
        return (
            <img
                className="equipo-card__photo"
                src={imagenUrl}
                alt={nombre}
                loading="lazy"
                onError={() => setFallo(true)}
            />
        );
    }

    return (
        <svg
            className="equipo-card__art"
            viewBox="0 0 120 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label={`Ilustración de ${tipo || nombre}`}
        >
            {dibujos[detectarCategoria(tipo, nombre)]}
        </svg>
    );
};

export default EquipoImagen;