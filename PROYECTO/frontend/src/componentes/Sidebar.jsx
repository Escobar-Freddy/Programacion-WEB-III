import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🏗️ Sistema Inventario</h2>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-item">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">PaginaPrincipal</span>
          </Link>
        </div>

        <div className="nav-item">
          <Link 
            to="/productos" 
            className={`nav-link ${isActive('/productos') ? 'active' : ''}`}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-label">Productos</span>
          </Link>
        </div>

        <div className="nav-item">
          <Link 
            to="/categorias" 
            className={`nav-link ${isActive('/categorias') ? 'active' : ''}`}
          >
            <span className="nav-icon">📑</span>
            <span className="nav-label">Categorias</span>
          </Link>
        </div>

        <div className="nav-item">
          <Link 
            to="/usuarios" 
            className={`nav-link ${isActive('/usuarios') ? 'active' : ''}`}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-label">Usuarios</span>
          </Link>
        </div>

        <div className="nav-item">
          <Link 
            to="/reportes" 
            className={`nav-link ${isActive('/reportes') ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Reportes</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;