import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../componentes/Sidebar';
import Header from '../componentes/Header';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header user={user} onLogout={onLogout} />
        
        <div className="dashboard-content">
          <div className="welcome-section">
            <h1>Bienvenido al Sistema de Artículos para Automoviles</h1>
            <p>Hola <strong>{user?.nombre}</strong>, has iniciado sesión correctamente.</p>
          </div>
          
          {/* Tarjetas de Funcionalidades */}
          <div className="stats-grid">
            <div className="stat-card" onClick={() => navigate('/proveedores')} style={{cursor: 'pointer'}}>
              <div className="stat-icon">🏢</div>
              <div className="stat-info">
                <h3>Proveedores</h3>
                <p>Gestión de proveedores</p>
              </div>
            </div>
         
            <div className="stat-card" onClick={() => navigate('/graficos')} style={{cursor: 'pointer'}}>
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>Gráficos Estadísticos</h3>
                <p>Estadísticas del sistema</p>
              </div>
            </div>
          </div>

          {/* Sección de Contacto */}
          <div className="recent-activity">
            <h2>📞 Contáctenos</h2>
            <div className="contact-list">
              <div className="contact-item">
                <div className="contact-avatar">👨‍💼</div>
                <div className="contact-info">
                  <h4>Santos Vargas Sergio Edison</h4>
                  <p><strong>Gerente General</strong></p>
                  <p>📞 75858853</p>
                  <p>✉️ sergiosantosvargas33@gmail.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-avatar">👩‍💼</div>
                <div className="contact-info">
                  <h4>Escobar Catunta Freddy Elias</h4>
                  <p><strong>Vendedor</strong></p>
                  <p>📞 73084626</p>
                  <p>✉️ fescobarc@fcpn.edu.bo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;