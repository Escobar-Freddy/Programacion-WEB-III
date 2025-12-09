import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../componentes/Sidebar';
import Header from '../componentes/Header';

// Función para calcular fortaleza de contraseña
const getPasswordStrength = (password) => {
  if (!password || password.length === 0) return { text: 'Vacía', color: '#95a5a6', score: 0 };
  if (password.length < 6) return { text: 'Muy Débil', color: '#e74c3c', score: 1 };
  
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (score === 1) return { text: 'Débil', color: '#e67e22', score: 2 };
  if (score === 2) return { text: 'Intermedia', color: '#f1c40f', score: 3 };
  if (score === 3) return { text: 'Buena', color: '#2ecc71', score: 4 };
  if (score === 4) return { text: 'Fuerte', color: '#27ae60', score: 5 };
  
  return { text: 'Débil', color: '#e74c3c', score: 2 };
};

function Usuarios({ user, onLogout }) {
  const navigate = useNavigate();
  
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [message, setMessage] = useState('');
  
  // Estados para CRUD
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'edit'
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'usuario'
    // ELIMINADO: activo: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [deletingId, setDeletingId] = useState(null);

  // Obtener usuarios
  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/verusuario');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      setError('Error al cargar los usuarios: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // Utilidades
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.rol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Funciones CRUD
  const openCreateModal = () => {
    setFormData({
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
      rol: 'usuario'
      // ELIMINADO: activo: true
    });
    setFormErrors({});
    setModalType('create');
    setShowModal(true);
  };

  const openEditModal = (usuario) => {
    setSelectedUsuario(usuario);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      confirmPassword: '',
      rol: usuario.rol
      // ELIMINADO: activo: usuario.activo === 1 || usuario.activo === true
    });
    setFormErrors({});
    setModalType('edit');
    setShowModal(true);
  };

  // Eliminar usuario
  const handleDelete = async (usuario) => {
    if (user?.rol !== 'admin') {
      setError('Solo los administradores pueden eliminar usuarios');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Verificación extra si es el usuario actual
    if (usuario.id === user?.id) {
      setError('No puedes eliminar tu propio usuario');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setDeletingId(usuario.id);
      
      await axios.delete(`http://localhost:5000/eliusuario/${usuario.id}`);
      
      setUsuarios(prev => prev.filter(u => u.id !== usuario.id));
      setMessage(`🗑️ Usuario "${usuario.nombre}" eliminado correctamente`);
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      setError('Error al eliminar usuario: ' + (error.response?.data?.error || error.message));
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedUsuario(null);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo al editar
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email no válido';
    }
    
    if (modalType === 'create' && !formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (modalType === 'create' && formData.password) {
      const fuerza = getPasswordStrength(formData.password);
      if (fuerza.score <= 2) {
        errors.password = `❌ Contraseña ${fuerza.text.toLowerCase()}. Debe ser al menos "Intermedia" (3/5).`;
      }
    }
    
    if (modalType === 'edit' && formData.password) {
      const fuerza = getPasswordStrength(formData.password);
      if (fuerza.score <= 2) {
        errors.password = `❌ Contraseña ${fuerza.text.toLowerCase()}. Debe ser al menos "Intermedia" (3/5).`;
      }
    }
    
    return errors;
  };

  const handleCreate = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Validación adicional para contraseña débil
    if (formData.password) {
      const fuerza = getPasswordStrength(formData.password);
      
      // Rechazar contraseñas "Muy Débil" o "Débil"
      if (fuerza.score <= 2) {
        setFormErrors({
          ...formErrors,
          password: `❌ Contraseña ${fuerza.text.toLowerCase()}. Debe ser al menos "Intermedia" (3/5).`
        });
        setError(`La contraseña es muy débil. Recomendaciones:
        • Mínimo 6 caracteres
        • Incluir letras minúsculas y MAYÚSCULAS
        • Agregar números
        • Usar símbolos (!@#$%^&*)`);
        return;
      }
      
      // Advertencia para contraseñas "Intermedia"
      if (fuerza.score === 3) {
        if (!window.confirm(`⚠️ Tu contraseña es solo "${fuerza.text}" (3/5).\n\n¿Deseas continuar o prefieres mejorar la contraseña?\n\nRecomendación: Agrega más tipos de caracteres para mayor seguridad.`)) {
          return;
        }
      }
    }

    try {
      setLoading(true);
      
      // Datos simplificados - SIN campo activo
      const usuarioData = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        rol: formData.rol
        // ELIMINADO: activo: formData.activo
      };

      console.log('Creando usuario (sin activo):', usuarioData);
      
      const response = await axios.post('http://localhost:5000/insertausuario/adi', usuarioData);
      
      setMessage('✅ Usuario creado exitosamente');
      closeModal();
      fetchUsuarios();
      
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      console.error('Respuesta del error:', error.response?.data);
      setError('Error al crear usuario: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Validación adicional para contraseña nueva
    if (formData.password) {
      const fuerza = getPasswordStrength(formData.password);
      
      // Rechazar contraseñas "Muy Débil" o "Débil"
      if (fuerza.score <= 2) {
        setFormErrors({
          ...formErrors,
          password: `❌ Contraseña ${fuerza.text.toLowerCase()}. Debe ser al menos "Intermedia" (3/5).`
        });
        setError(`La nueva contraseña es muy débil. Recomendaciones:
        • Mínimo 6 caracteres
        • Incluir letras minúsculas y MAYÚSCULAS
        • Agregar números
        • Usar símbolos (!@#$%^&*)`);
        return;
      }
      
      // Advertencia para contraseñas "Intermedia"
      if (fuerza.score === 3) {
        if (!window.confirm(`⚠️ La nueva contraseña es solo "${fuerza.text}" (3/5).\n\n¿Deseas continuar o prefieres mejorar la contraseña?`)) {
          return;
        }
      }
    }

    try {
      setLoading(true);
      
      // Datos simplificados - SIN campo activo
      const usuarioData = {
        nombre: formData.nombre,
        email: formData.email,
        rol: formData.rol
        // ELIMINADO: activo: formData.activo
      };

      // Solo agregar password si se proporcionó uno nuevo
      if (formData.password && formData.password.trim() !== '') {
        usuarioData.password = formData.password;
      }

      console.log('Actualizando usuario (sin activo):', usuarioData);
      
      const response = await axios.put(`http://localhost:5000/actusuario/${selectedUsuario.id}`, usuarioData);
      
      setMessage('✅ Usuario actualizado exitosamente');
      closeModal();
      fetchUsuarios();
      
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      console.error('Respuesta del error:', error.response?.data);
      setError('Error al actualizar usuario: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (modalType === 'create') {
      handleCreate();
    } else if (modalType === 'edit') {
      handleUpdate();
    }
  };

  const getStatusBadge = (activo) => {
    if (activo === 1 || activo === true) {
      return <span className="stock-badge in-stock">Activo</span>;
    } else {
      return <span className="stock-badge out-stock">Inactivo</span>;
    }
  };

  if (loading && usuarios.length === 0) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Header user={user} onLogout={onLogout} />
          <div className="page-content">
            <div className="loading">Cargando usuarios...</div>
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
            <h1>👥 Gestión de Usuarios</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" onClick={fetchUsuarios}>
                🔄 Actualizar
              </button>
              <button className="btn-success" onClick={openCreateModal}>
                ➕ Nuevo Usuario
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
              ⚠️ {error}
              <button onClick={fetchUsuarios} style={{ marginLeft: '10px' }} className="btn-secondary">
                Reintentar
              </button>
            </div>
          )}

          {/* TABLA DE USUARIOS */}
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
                    placeholder="Buscar usuario, email, rol..."
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
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.slice(0, entriesPerPage).map((usuario, index) => {
                    return (
                      <tr key={usuario.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{usuario.nombre}</strong>
                        </td>
                        <td>{usuario.email}</td>
                        <td>
                          <span className={`stock-badge ${usuario.rol === 'admin' ? 'in-stock' : 'low-stock'}`}>
                            {usuario.rol}
                          </span>
                        </td>
                        <td>
                          {getStatusBadge(usuario.activo)}
                        </td>
                        <td>
                          {formatDate(usuario.created_at)}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-action edit" 
                              onClick={() => openEditModal(usuario)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn-action delete" 
                              onClick={() => handleDelete(usuario)}
                              title="Eliminar"
                              disabled={deletingId === usuario.id || usuario.id === user?.id}
                              style={{
                                opacity: (deletingId === usuario.id || usuario.id === user?.id) ? 0.6 : 1,
                                cursor: (deletingId === usuario.id || usuario.id === user?.id) ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {deletingId === usuario.id ? '⏳' : '🗑️'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                      {usuarios.length === 0 ? 
                        'No hay usuarios registrados.' : 
                        'No se encontraron usuarios que coincidan con la búsqueda.'
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="table-footer">
              <div className="table-info">
                {filteredUsuarios.length > 0 ? (
                  `Mostrando 1 a ${Math.min(filteredUsuarios.length, entriesPerPage)} de ${filteredUsuarios.length} entradas`
                ) : (
                  'No hay entradas para mostrar'
                )}
                {searchTerm && usuarios.length > 0 && ` (filtrado de ${usuarios.length} total)`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PARA CRUD - SIN CAMPO ACTIVO */}
      {showModal && modalType !== 'delete' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalType === 'create' ? '➕ Crear Usuario' : '✏️ Editar Usuario'}
              </h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={formErrors.nombre ? 'error' : ''}
                    placeholder="Ej: RAMIRO"
                    required
                  />
                  {formErrors.nombre && (
                    <span className="error-text">{formErrors.nombre}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={formErrors.email ? 'error' : ''}
                    placeholder="Ej: usuario@empresa.com"
                    required
                  />
                  {formErrors.email && (
                    <span className="error-text">{formErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    {modalType === 'create' ? 'Contraseña *' : 'Nueva Contraseña'}
                    {modalType === 'edit' && ' (dejar vacío para mantener la actual)'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={formErrors.password ? 'error' : ''}
                    placeholder="••••••••"
                    required={modalType === 'create'}
                  />
                  
                  {/* Visualizador de fortaleza de contraseña */}
                  {formData.password && modalType !== 'delete' && (
                    <div style={{ 
                      marginTop: '8px',
                      padding: '10px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '6px',
                      border: '1px solid #e9ecef',
                      fontSize: '0.85em'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontWeight: 'bold',
                          color: getPasswordStrength(formData.password).color
                        }}>
                          🔐 Fortaleza: {getPasswordStrength(formData.password).text}
                        </span>
                        <span style={{
                          color: '#7f8c8d'
                        }}>
                          {getPasswordStrength(formData.password).score}/5
                        </span>
                      </div>
                      
                      <div style={{
                        height: '6px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        marginBottom: '10px'
                      }}>
                        <div style={{
                          width: `${(getPasswordStrength(formData.password).score / 5) * 100}%`,
                          height: '100%',
                          backgroundColor: getPasswordStrength(formData.password).color,
                          borderRadius: '3px',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '10px',
                        fontSize: '0.8em'
                      }}>
                        <span style={{ 
                          color: formData.password.length >= 6 ? '#27ae60' : '#95a5a6',
                          fontWeight: formData.password.length >= 6 ? 'bold' : 'normal'
                        }}>
                          ✓ 6+ caracteres
                        </span>
                        <span style={{ 
                          color: /[a-z]/.test(formData.password) ? '#27ae60' : '#95a5a6',
                          fontWeight: /[a-z]/.test(formData.password) ? 'bold' : 'normal'
                        }}>
                          {/[a-z]/.test(formData.password) ? '✓ minúscula' : '✗ minúscula'}
                        </span>
                        <span style={{ 
                          color: /[A-Z]/.test(formData.password) ? '#27ae60' : '#95a5a6',
                          fontWeight: /[A-Z]/.test(formData.password) ? 'bold' : 'normal'
                        }}>
                          {/[A-Z]/.test(formData.password) ? '✓ MAYÚSCULA' : '✗ MAYÚSCULA'}
                        </span>
                        <span style={{ 
                          color: /\d/.test(formData.password) ? '#27ae60' : '#95a5a6',
                          fontWeight: /\d/.test(formData.password) ? 'bold' : 'normal'
                        }}>
                          {/\d/.test(formData.password) ? '✓ número' : '✗ número'}
                        </span>
                        <span style={{ 
                          color: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '#27ae60' : '#95a5a6',
                          fontWeight: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'bold' : 'normal'
                        }}>
                          {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '✓ símbolo' : '✗ símbolo'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {formErrors.password && (
                    <span className="error-text">{formErrors.password}</span>
                  )}
                </div>

                {formData.password && (
                  <div className="form-group">
                    <label>Confirmar Contraseña *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={formErrors.confirmPassword ? 'error' : ''}
                      placeholder="••••••••"
                    />
                    {formErrors.confirmPassword && (
                      <span className="error-text">{formErrors.confirmPassword}</span>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label>Rol</label>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleInputChange}
                    style={{ textTransform: 'capitalize' }}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSubmit}
                disabled={loading}
                style={{ 
                  backgroundColor: '#1890ff',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Procesando...' : 
                 modalType === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS adicionales */}
      <style>{`
        .action-buttons {
          display: flex;
          gap: 5px;
          justify-content: center;
        }
        
        .btn-action {
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }
        
        .btn-action.edit {
          background-color: #3498db;
          color: white;
        }
        
        .btn-action.delete {
          background-color: #e74c3c;
          color: white;
        }
        
        .btn-action.edit:hover {
          background-color: #2980b9;
        }
        
        .btn-action.delete:hover {
          background-color: #c0392b;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        
        .modal-body {
          padding: 20px;
        }
        
        .modal-footer {
          padding: 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-group input.error,
        .form-group select.error {
          border-color: #e74c3c;
        }
        
        .error-text {
          color: #e74c3c;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }
      `}</style>
    </div>
  );
}

export default Usuarios;