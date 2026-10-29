import { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import EquipoList from './components/Equipos/EquipoList';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <>
            <header className="app-header">
                <div className="app-header__inner">
                    <h1 className="app-header__title">Centro de Gestion de Equipos</h1>
                    <button className="btn btn--ghost" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </header>
            <main className="app-main">
                <EquipoList />
            </main>
        </>
    );
}

export default App;