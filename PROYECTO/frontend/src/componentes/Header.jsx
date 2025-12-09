import React from 'react';

function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header-user">
        <span>Bienvenido, <strong>{user?.nombre}</strong></span>
        <span className="user-role" style={{
          backgroundColor: 
            user?.rol === 'admin' ? '#e74c3c' : 
            user?.rol === 'usuario' ? '#3498db' : '#95a5a6'
        }}>
          {user?.rol?.toUpperCase()}
        </span>
        <button onClick={onLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}

export default Header;