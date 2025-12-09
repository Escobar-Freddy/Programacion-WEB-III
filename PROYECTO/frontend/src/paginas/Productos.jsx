import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../componentes/Sidebar';
import Header from '../componentes/Header';

function Productos({ user, onLogout }) {
  const navigate = useNavigate();
  
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [message, setMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null); // Para mostrar loading en el botón específico

  // Obtener productos
  const Prod = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/muestraProductos');
      setProductos(response.data);
      setError(null);
    } catch (error) {
      console.error('Error productos:', error);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Prod();
  }, [Prod]);

  // Navegar a crear producto
  const CreaProducto = () => {
    navigate('/nuevo-producto');
  };

  // Navegar a editar producto
  const EditaProducto = (producto) => {
    navigate(`/editar-producto/${producto.id}`);
  };

  // Eliminar producto directamente
  const EliminaProducto = async (producto) => {
      const response = await axios.delete(`http://localhost:5000/eliminaProductos/${producto.id}`);
      setProductos(prev => prev.filter(p => p.id !== producto.id));
  };

  // Utilidades
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.codigo_referencia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock, stockMinimo) => {
    if (stock === 0) return { text: 'Agotado', class: 'out-of-stock' };
    if (stock <= stockMinimo) return { text: 'Bajo Stock', class: 'low-stock' };
    return { text: 'En Stock', class: 'in-stock' };
  };

  const formatCurrency = (amount) => {
    return `Bs. ${parseFloat(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Header user={user} onLogout={onLogout} />
          <div className="page-content">
            <div className="loading">Cargando productos...</div>
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
            <h1>📦 Gestión de Productos</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* NUEVO PRODUCTO - Solo admin y usuarios */}
              {(user?.rol === 'admin' || user?.rol === 'usuario') && (
                <button className="btn-primary" onClick={CreaProducto}>
                  ➕ Nuevo Producto
                </button>
              )}
              
              {/* ACTUALIZAR - Todos pueden */}
              <button className="btn-primary" onClick={Prod}>
                🔄 Actualizar
              </button>
            </div>
          </div>

          {/* MENSAJES */}
          {message && (
            <div className="message success" style={{ marginBottom: '20px' }}>
              ✅ {message}
            </div>
          )}

          {error && (
            <div className="message error" style={{ marginBottom: '20px' }}>
              ⚠️ {error}
            </div>
          )}

          {/* TABLA DE PRODUCTOS */}
          <div className="table-container">
            <div className="table-header">
              <div className="table-actions">
                <div className="entries-select">
                  <span>Mostrar</span>
                  <select
                    value={entriesPerPage}
                    onChange={handleEntriesChange}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>entradas</span>
                </div>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Buscar producto, código, categoría..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th>Código</th>
                  <th>Categoría</th>
                  <th>Marca</th>
                  <th>Precio Costo</th>
                  <th>Precio Venta</th>
                  <th>Stock</th>
                  <th>Mínimo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.length > 0 ? (
                  filteredProductos.slice(0, entriesPerPage).map((producto, index) => {
                    const stockStatus = getStockStatus(producto.stock, producto.stock_minimo);
                    return (
                      <tr key={producto.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div>
                            <strong>{producto.nombre}</strong>
                            {producto.descripcion && (
                              <div className="product-description">
                                {producto.descripcion}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <code>{producto.codigo_referencia || 'N/A'}</code>
                        </td>
                        <td>{producto.categoria || 'Sin categoría'}</td>
                        <td>{producto.marca || 'N/A'}</td>
                        <td className="price-cell">
                          {formatCurrency(producto.precio_costo)}
                        </td>
                        <td className="price-cell">
                          <strong>{formatCurrency(producto.precio_venta)}</strong>
                        </td>
                        <td>
                          <span className={`stock-number ${producto.stock === 0 ? 'zero' : producto.stock <= producto.stock_minimo ? 'warning' : ''}`}>
                            {producto.stock} {producto.unidad_medida || 'und'}
                          </span>
                        </td>
                        <td>
                          <span className="stock-minimo">
                            {producto.stock_minimo}
                          </span>
                        </td>
                        <td>
                          <span className={`stock-badge ${stockStatus.class}`}>
                            {stockStatus.text}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {/* EDITAR - Solo admin y usuarios */}
                            {(user?.rol === 'admin' || user?.rol === 'usuario') && (
                              <button
                                className="btn-edit"
                                title="Editar"
                                onClick={() => EditaProducto(producto)}
                              >
                                ✏️
                              </button>
                            )}
                            
                            {/* ELIMINAR - Solo admin */}
                            {user?.rol === 'admin' && (
                              <button
                                className="btn-delete"
                                title="Eliminar"
                                onClick={() => EliminaProducto(producto)}
                                disabled={deletingId === producto.id}
                                style={{
                                  opacity: deletingId === producto.id ? 0.6 : 1,
                                  cursor: deletingId === producto.id ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {deletingId === producto.id ? '⏳' : '🗑️'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11" style={{ textAlign: 'center', padding: '2rem' }}>
                      {productos.length === 0 
                        ? 'No hay productos registrados.' 
                        : 'No se encontraron productos que coincidan con la búsqueda.'
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="table-footer">
              <div className="table-info">
                {filteredProductos.length > 0 ? (
                  `Mostrando 1 a ${Math.min(filteredProductos.length, entriesPerPage)} de ${filteredProductos.length} entradas`
                ) : (
                  'No hay entradas para mostrar'
                )}
                {searchTerm && productos.length > 0 && ` (filtrado de ${productos.length} total)`}
              </div>
            </div>
          </div>

          {/* RESUMEN DE STOCK */}
          <div className="stock-summary">
            <h3>Resumen de Inventario</h3>
            <div className="summary-cards">
              <div className="summary-card total">
                <span className="summary-number">{productos.length}</span>
                <span className="summary-label">Total Productos</span>
              </div>
              <div className="summary-card in-stock">
                <span className="summary-number">
                  {productos.filter(p => p.stock > p.stock_minimo).length}
                </span>
                <span className="summary-label">En Stock</span>
              </div>
              <div className="summary-card low-stock">
                <span className="summary-number">
                  {productos.filter(p => p.stock > 0 && p.stock <= p.stock_minimo).length}
                </span>
                <span className="summary-label">Bajo Stock</span>
              </div>
              <div className="summary-card out-of-stock">
                <span className="summary-number">
                  {productos.filter(p => p.stock === 0).length}
                </span>
                <span className="summary-label">Agotados</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Productos;