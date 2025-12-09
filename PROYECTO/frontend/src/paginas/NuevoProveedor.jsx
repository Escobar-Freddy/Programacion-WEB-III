import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../componentes/Sidebar';
import Header from '../componentes/Header';

function NuevoProveedor({ user, onLogout }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Validaciones básicas
      if (!formData.nombre.trim()) {
        setError('El nombre del proveedor es requerido');
        return;
      }
      if (!formData.empresa.trim()) {
        setError('El nombre de la empresa es requerido');
        return;
      }
      if (!formData.telefono.trim()) {
        setError('El teléfono es requerido');
        return;
      }

      const proveedorData = {
        nombre: formData.nombre.trim(),
        empresa: formData.empresa.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        direccion: formData.direccion.trim()
      };

      const response = await axios.post('http://localhost:5000/proveedores', proveedorData);
      
      if (response.data) {
        setMessage('✅ Proveedor creado correctamente');
        // Limpiar formulario
        setFormData({
          nombre: '',
          empresa: '',
          telefono: '',
          email: '',
          direccion: ''
        });

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/proveedores');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creando proveedor:', error);
      const errorMsg = error.response?.data?.message || 'Error al crear proveedor';
      setError(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/proveedores');
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header user={user} onLogout={onLogout} />
        
        <div className="page-content">
          <div className="page-header">
            <h1>➕ Nuevo Proveedor</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={handleGoHome}>
                🏠 Inicio
              </button>
              <button className="btn-secondary" onClick={handleCancel}>
                🏢 Volver a Proveedores
              </button>
            </div>
          </div>

          {message && (
            <div className="message success">
              {message}
            </div>
          )}
          {error && (
            <div className="message error">
              {error}
            </div>
          )}

          <div className="form-container">
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-section">
                <h3>Información del Proveedor</h3>
                
                <div className="form-group">
                  <label>Nombre del Proveedor *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Carlos Mendoza"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Empresa *</label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    placeholder="Ej: Repuestos Automotrices S.A."
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="Ej: +1 234-567-8901"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ej: proveedor@empresa.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Dirección</label>
                  <textarea
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Dirección completa del proveedor..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : '✅ Crear Proveedor'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancel}
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NuevoProveedor;