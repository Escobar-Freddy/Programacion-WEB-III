import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../componentes/Sidebar';
import Header from '../componentes/Header';

function Proveedores({ user, onLogout }) {
  const navigate = useNavigate();

  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [message, setMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Obtener proveedores
  const Provee = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:5000/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error fetching proveedores:', error);
      setError('Error al cargar los proveedores: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Provee();
  }, [Provee]);

  // Navegar a crear proveedor
  const handleCreateProveedor = () => {
    navigate('/nuevo-proveedor');
  };

  // Navegar a editar proveedor
  const handleEdit = (proveedor) => {
    navigate(`/editar-proveedor/${proveedor.id}`);
  };

  // Eliminar proveedor
  const handleDelete = async (proveedor) => {   
      const response = await axios.delete(`http://localhost:5000/proveedores/${proveedor.id}`);
        setProveedores(prev => prev.filter(p => p.id !== proveedor.id));
  };

  // Utilidades
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
  };

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.telefono?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Header user={user} onLogout={onLogout} />
          <div className="page-content">
            <div className="loading">Cargando proveedores...</div>
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
            <h1>🏢 Gestión de Proveedores</h1>
              <div style={{ display: 'flex', gap: '10px' }}>
                {(user?.rol === 'admin' || user?.rol === 'usuario') && (
                  <button className="btn-primary" onClick={handleCreateProveedor}>
                    ➕ Nuevo Proveedor
                  </button>
                )}
                
                <button className="btn-primary" onClick={Provee}>
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

          {/* TABLA DE PROVEEDORES */}
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
                    placeholder="Buscar proveedor, empresa, teléfono..."
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
                  <th>Empresa</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Dirección</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProveedores.length > 0 ? (
                  filteredProveedores.slice(0, entriesPerPage).map((proveedor, index) => {
                    return (
                      <tr key={proveedor.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{proveedor.nombre}</strong>
                        </td>
                        <td>{proveedor.empresa || 'No especificada'}</td>
                        <td>
                          {proveedor.telefono ? (
                            <a href={`tel:${proveedor.telefono}`} className="phone-link">
                              {proveedor.telefono}
                            </a>
                          ) : (
                            'No especificado'
                          )}
                        </td>
                        <td>
                          {proveedor.email ? (
                            <a href={`mailto:${proveedor.email}`} className="email-link">
                              {proveedor.email}
                            </a>
                          ) : (
                            'No especificado'
                          )}
                        </td>
                        <td>
                          {proveedor.direccion || 'No especificada'}
                        </td>
                        <td>
                          {new Date(proveedor.created_at).toLocaleDateString()}
                        </td>
                          <td>
                            <div className="action-buttons">
                              {(user?.rol === 'admin' || user?.rol === 'usuario') && (
                                <button
                                  className="btn-edit"
                                  title="Editar"
                                  onClick={() => handleEdit(proveedor)}
                                >
                                  ✏️
                                </button>
                              )}
                              
                              {user?.rol === 'admin' && (
                                <button
                                  className="btn-delete"
                                  title="Eliminar"
                                  onClick={() => handleDelete(proveedor)}
                                  disabled={deletingId === proveedor.id}
                                  style={{
                                    opacity: deletingId === proveedor.id ? 0.6 : 1,
                                    cursor: deletingId === proveedor.id ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  {deletingId === proveedor.id ? '⏳' : '🗑️'}
                                </button>
                              )}
                            </div>
                          </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                      {proveedores.length === 0 ?
                        'No hay proveedores registrados. ¡Registra tu primer proveedor!' :
                        'No se encontraron proveedores que coincidan con la búsqueda.'
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="table-footer">
              <div className="table-info">
                {filteredProveedores.length > 0 ? (
                  `Mostrando 1 a ${Math.min(filteredProveedores.length, entriesPerPage)} de ${filteredProveedores.length} entradas`
                ) : (
                  'No hay entradas para mostrar'
                )}
                {searchTerm && proveedores.length > 0 && ` (filtrado de ${proveedores.length} total)`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Proveedores;