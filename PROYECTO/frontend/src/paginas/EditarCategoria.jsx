import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../componentes/Sidebar';
import Header from '../componentes/Header';

function EditarCategoria({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingCategoria, setLoadingCategoria] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Cargar datos de la categoría
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        setLoadingCategoria(true);
        setError('');
        
        const response = await axios.get(`http://localhost:5000/muestraCategoria/${id}`);
        const categoria = response.data;
        
        setFormData({
          nombre: categoria.nombre || '',
          descripcion: categoria.descripcion || ''
        });
      } catch (error) {
        console.error('Error cargando categoría:', error);
        setError('Error al cargar la categoría: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoadingCategoria(false);
      }
    };

    if (id) {
      fetchCategoria();
    } else {
      setError('ID de categoría no válido');
      setLoadingCategoria(false);
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
        setError('El nombre de la categoría es requerido');
        return;
      }

      const categoriaData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim()
      };

      const response = await axios.put(`http://localhost:5000/actualizaCategoria/${id}`, categoriaData);

      if (response.data.success) {
        setMessage('✅ Categoría actualizada correctamente');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/categorias');
        }, 2000);
      }
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      const errorMsg = error.response?.data?.message || 'Error al actualizar categoría';
      setError(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/categorias');
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  if (loadingCategoria) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Header user={user} onLogout={onLogout} />
          <div className="page-content">
            <div className="loading">Cargando categoría...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !loadingCategoria) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Header user={user} onLogout={onLogout} />
          <div className="page-content">
            <div className="page-header">
              <h1>✏️ Editar Categoría</h1>
            </div>
            <div className="message error">
              {error}
              <button 
                onClick={() => navigate('/categorias')} 
                style={{ marginLeft: '10px' }}
                className="btn-secondary"
              >
                Volver a Categorías
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
            <h1>✏️ Editar Categoría</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={handleGoHome}>
                🏠 Inicio
              </button>
              <button className="btn-secondary" onClick={handleCancel}>
                📑 Volver a Categorías
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
                <h3>Información de la Categoría</h3>
                
                <div className="form-group">
                  <label>Nombre de la Categoría *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Sistema Eléctrico"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Descripción de la categoría..."
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

export default EditarCategoria;