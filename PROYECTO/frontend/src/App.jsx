import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './paginas/Login';
import Dashboard from './paginas/Dashboard';
import Productos from './paginas/Productos';
import NuevoProducto from './paginas/NuevoProducto';
import EditarProducto from './paginas/EditarProducto';
import Categorias from './paginas/Categorias';
import NuevaCategoria from './paginas/NuevaCategoria';
import EditarCategoria from './paginas/EditarCategoria';
import Usuarios from './paginas/Usuarios';
import Proveedores from './paginas/Proveedores';
import NuevoProveedor from './paginas/NuevoProveedor';
import EditarProveedor from './paginas/EditarProveedor';
import Reportes from './paginas/Reportes';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };
// aca llama a login
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando aplicación...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta de login - accesible solo si no está logueado */}
          <Route
            path="/login"
            element={
              isLoggedIn ?
              <Navigate to="/dashboard" /> :
              <Login onLogin={handleLogin} />
            }
          />
          
          {/* Ruta principal del dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          
          {/* Rutas de productos */}
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <Productos user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nuevo-producto"
            element={
              <ProtectedRoute>
                <NuevoProducto user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-producto/:id"
            element={
              <ProtectedRoute>
                <EditarProducto user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          
          {/* Rutas de categorías */}
          <Route
            path="/categorias"
            element={
              <ProtectedRoute>
                <Categorias user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nueva-categoria"
            element={
              <ProtectedRoute>
                <NuevaCategoria user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-categoria/:id"
            element={
              <ProtectedRoute>
                <EditarCategoria user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          
          {/* Rutas de usuarios */}
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <Usuarios user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          
          {/* Rutas de proveedores */}
          <Route
            path="/proveedores"
            element={
              <ProtectedRoute>
                <Proveedores user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nuevo-proveedor"
            element={
              <ProtectedRoute>
                <NuevoProveedor user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-proveedor/:id"
            element={
              <ProtectedRoute>
                <EditarProveedor user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          
          {/* Ruta de reportes */}
          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <Reportes user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          
          {/* Ruta para errores 404 */}
          <Route
            path="/404"
            element={
              <div className="error-page">
                <h1>404</h1>
                <p>Página no encontrada</p>
                {isLoggedIn ? (
                  <a href="/dashboard">Volver al Dashboard</a>
                ) : (
                  <a href="/login">Ir al Login</a>
                )}
              </div>
            }
          />
          
          {/* Rutas por defecto */}
          <Route
            path="/"
            element={
              isLoggedIn ?
              <Navigate to="/dashboard" /> :
              <Navigate to="/login" />
            }
          />
          
          {/* Captura todas las rutas no definidas */}
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;