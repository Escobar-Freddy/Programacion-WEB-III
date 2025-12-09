import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../componentes/Sidebar';
import Header from '../componentes/Header';

function EditarProveedor({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingProveedor, setLoadingProveedor] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Cargar datos del proveedor
  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        setLoadingProveedor(true);
        setError('');

        const response = await axios.get(`http://localhost:5000/proveedores/${id}`);
        const proveedor = response.data;

        setFormData({
          nombre: proveedor.nombre || '',
          empresa: proveedor.empresa || '',
          telefono: proveedor.telefono || '',
          email: proveedor.email || '',
          direccion: proveedor.direccion || ''
        });
      } catch (error) {
        console.error('Error cargando proveedor:', error);
        setError('Error al cargar el proveedor: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoadingProveedor(false);
      }
    };

    if (id) {
      fetchProveedor();
    } else {
      setError('ID de proveedor no válido');
      setLoadingProveedor(false);
    }
  }, [id]);

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

      const response = await axios.put(`http://localhost:5000/proveedores/${id}`, proveedorData);
      
      if (response.data) {
        setMessage('✅ Proveedor actualizado correctamente');

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/proveedores');
        }, 2000);
      }
    } catch (error) {
      console.error('Error actualizando proveedor:', error);
      const errorMsg = error.response?.data?.message || 'Error al actualizar proveedor';
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

  if (loadingProveedor) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Header user={user} onLogout={onLogout} />
          <div className="page-content">
            <div className="loading">Cargando proveedor...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !loadingProveedor) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Header user={user} onLogout={onLogout} />
          <div className="page-content">
            <div className="page-header">
              <h1>✏️ Editar Proveedor</h1>
            </div>
            <div className="message error">
              {error}
              <button
                onClick={() => navigate('/proveedores')}
                style={{ marginLeft: '10px' }}
                className="btn-secondary"
              >
                Volver a Proveedores
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header user={user} onLogout={onLogout} />
        
        <div className="page-content">
          <div className="page-header">
            <h1>✏️ Editar Proveedor</h1>
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
                  {loading ? 'Guardando...' : '💾 Guardar Cambios'}
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

export default EditarProveedor;