import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../componentes/Sidebar';
import Header from '../componentes/Header';

function NuevoProducto({ user, onLogout }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo_referencia: '',
    categoria: '',
    marca: '',
    precio_costo: '',
    precio_venta: '',
    stock: '',
    stock_minimo: '0',
    unidad_medida: 'UNID.'
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
        setError('El nombre del producto es requerido');
        return;
      }
      if (!formData.precio_costo || !formData.precio_venta || !formData.stock) {
        setError('Precio costo, precio venta y stock son requeridos');
        return;
      }

      // Preparar datos
      const productoData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        codigo_referencia: formData.codigo_referencia.trim(),
        categoria: formData.categoria.trim(),
        marca: formData.marca.trim(),
        precio_costo: parseFloat(formData.precio_costo),
        precio_venta: parseFloat(formData.precio_venta),
        stock: parseInt(formData.stock),
        stock_minimo: parseInt(formData.stock_minimo) || 0,
        unidad_medida: formData.unidad_medida
      };

      const response = await axios.post('http://localhost:5000/insertaProductos/adi', productoData);
      if (response.data.success) {
        setMessage('✅ Producto creado correctamente');
        // Limpiar formulario
        setFormData({
          nombre: '',
          descripcion: '',
          codigo_referencia: '',
          categoria: '',
          marca: '',
          precio_costo: '',
          precio_venta: '',
          stock: '',
          stock_minimo: '0',
          unidad_medida: 'UNID.'
        });
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/productos');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creando producto:', error);
      const errorMsg = error.response?.data?.message || 'Error al crear producto';
      setError(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/productos');
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
            <h1>➕ Nuevo Producto</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={handleGoHome}>
                🏠 Inicio
              </button>
              <button className="btn-secondary" onClick={handleCancel}>
                📦 Volver a Productos
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
                <h3>Información Básica</h3>
                
                <div className="form-group">
                  <label>Nombre del Producto *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Bujía para Toyota"
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
                    placeholder="Descripción detallada del producto..."
                  />
                </div>

                <div className="form-group">
                  <label>Código Referencia</label>
                  <input
                    type="text"
                    name="codigo_referencia"
                    value={formData.codigo_referencia}
                    onChange={handleInputChange}
                    placeholder="Ej: BKR5EY"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Categorización</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Categoría</label>
                    <input
                      type="text"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleInputChange}
                      placeholder="Ej: Motor"
                    />
                  </div>

                  <div className="form-group">
                    <label>Marca</label>
                    <input
                      type="text"
                      name="marca"
                      value={formData.marca}
                      onChange={handleInputChange}
                      placeholder="Ej: NGK"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Precios y Stock</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Precio Costo *</label>
                    <input
                      type="number"
                      name="precio_costo"
                      step="0.01"
                      min="0"
                      value={formData.precio_costo}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Precio Venta *</label>
                    <input
                      type="number"
                      name="precio_venta"
                      step="0.01"
                      min="0"
                      value={formData.precio_venta}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Mínimo</label>
                    <input
                      type="number"
                      name="stock_minimo"
                      min="0"
                      value={formData.stock_minimo}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Unidad Medida</label>
                    <select
                      name="unidad_medida"
                      value={formData.unidad_medida}
                      onChange={handleInputChange}
                    >
                      <option value="UNID.">UNIDADES</option>
                      <option value="JGO.">JUEGOS</option>
                      <option value="LTS.">LITROS</option>
                      <option value="MTS.">METROS</option>
                      <option value="PZ.">PIEZAS</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : '✅ Crear Producto'}
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

export default NuevoProducto;