import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../componentes/Sidebar';
import Header from '../componentes/Header';

function Categorias({ user, onLogout }) {
  const navigate = useNavigate();
  
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState('');

  // Obtener categorías
  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:5000/muestraCategoria');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
      setError('Error al cargar las categorías: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  // Navegar a crear categoría
  const handleCreateCategoria = () => {
    navigate('/nueva-categoria');
  };

  // Navegar a editar categoría
  const handleEdit = (categoria) => {
    navigate(`/editar-categoria/${categoria.id}`);
  };

  // Eliminar categoría directamente
  const handleDelete = async (categoria) => {   

      await axios.delete(`http://localhost:5000/eliminaCategoria/${categoria.id}`);
      setCategorias(prev => prev.filter(c => c.id !== categoria.id));
  };

  // Utilidades
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
  };

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Header user={user} onLogout={onLogout} />
          <div className="page-content">
            <div className="loading">Cargando categorías...</div>
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
            <h1>📑 Gestión de Categorías</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* NUEVA CATEGORÍA - Solo admin y usuarios */}
              {(user?.rol === 'admin' || user?.rol === 'usuario') && (
                <button className="btn-primary" onClick={handleCreateCategoria}>
                  ➕ Nueva Categoría
                </button>
              )}
              
              <button className="btn-primary" onClick={fetchCategorias}>
                🔄 Actualizar
              </button>
            </div>
          </div>

          {/* MENSAJES */}
          {message && (
            <div className="message success" style={{ marginBottom: '20px' }}>
              {message}
            </div>
          )}

          {error && (
            <div className="message error">
              {error}
              <button onClick={fetchCategorias} style={{ marginLeft: '10px' }} className="btn-secondary">
                Reintentar
              </button>
            </div>
          )}

          {/* TABLA DE CATEGORÍAS */}
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
                    placeholder="Buscar categoría, descripción..."
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
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Fecha Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategorias.length > 0 ? (
                  filteredCategorias.slice(0, entriesPerPage).map((categoria, index) => {
                    return (
                      <tr key={categoria.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{categoria.nombre}</strong>
                        </td>
                        <td>
                          {categoria.descripcion || 'Sin descripción'}
                        </td>
                        <td>
                          {categoria.created_at 
                            ? new Date(categoria.created_at).toLocaleDateString() 
                            : 'N/A'}
                        </td>
                        <td>
                          <div className="action-buttons">
                            {/* EDITAR - Solo admin y usuarios */}
                            {(user?.rol === 'admin' || user?.rol === 'usuario') && (
                              <button
                                className="btn-edit"
                                title="Editar"
                                onClick={() => handleEdit(categoria)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                              >
                                ✏️
                              </button>
                            )}
                            
                            {/* ELIMINAR - Solo admin */}
                            {user?.rol === 'admin' && (
                              <button
                                className="btn-delete"
                                title="Eliminar"
                                onClick={() => handleDelete(categoria)}
                                disabled={deletingId === categoria.id}
                                style={{ 
                                  background: 'none', 
                                  border: 'none', 
                                  cursor: deletingId === categoria.id ? 'not-allowed' : 'pointer', 
                                  fontSize: '18px',
                                  opacity: deletingId === categoria.id ? 0.5 : 1
                                }}
                              >
                                {deletingId === categoria.id ? '⏳' : '🗑️'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      {categorias.length === 0 ? 
                        'No hay categorías registradas. ¡Crea tu primera categoría!' : 
                        'No se encontraron categorías que coincidan con la búsqueda.'
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="table-footer">
              <div className="table-info">
                {filteredCategorias.length > 0 ? (
                  `Mostrando 1 a ${Math.min(filteredCategorias.length, entriesPerPage)} de ${filteredCategorias.length} entradas`
                ) : (
                  'No hay entradas para mostrar'
                )}
                {searchTerm && categorias.length > 0 && ` (filtrado de ${categorias.length} total)`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categorias;