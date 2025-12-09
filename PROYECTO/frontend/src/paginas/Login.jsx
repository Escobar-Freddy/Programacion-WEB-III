import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captchaText: ''
  });
  const [captcha, setCaptcha] = useState({ id: '', text: 'Cargando...' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadCaptcha = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/captcha`);
      setCaptcha({
        id: response.data.captchaId,
        text: response.data.captchaText
      });
    } catch (error) {
      console.error('Error cargando captcha:', error);
      setCaptcha({ id: 'error', text: 'Error al cargar' });
      setMessage('Error conectando con el servidor');
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'captchaText' ? value.toUpperCase() : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validar campos vacíos
    if (!formData.email || !formData.password || !formData.captchaText) {
      setMessage('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Por favor ingresa un email válido');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: formData.email.trim(),
        password: formData.password,
        captchaId: captcha.id,
        captchaText: formData.captchaText.toUpperCase()
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.data.success) {
        setMessage('✅ Login exitoso! Redirigiendo...');
        
        // Guardar datos de usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Notificar al componente padre después de un breve delay
        setTimeout(() => {
          if (onLogin && typeof onLogin === 'function') {
            onLogin(response.data.user);
          }
        }, 1000);
        
      } else {
        setMessage(`❌ ${response.data.message || 'Error en el login'}`);
        loadCaptcha(); // Recargar captcha en caso de error
      }
    } catch (error) {
      console.error('Error en login:', error);
      
      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.status === 401) {
          setMessage('❌ Credenciales incorrectas');
        } else if (error.response.status === 400) {
          setMessage(`❌ ${error.response.data.message || 'Error en la solicitud'}`);
        } else {
          setMessage(`❌ Error del servidor (${error.response.status})`);
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no hubo respuesta
        setMessage('❌ No se pudo conectar con el servidor. Verifica que esté corriendo.');
      } else {
        // Algo pasó al configurar la solicitud
        setMessage('❌ Error al procesar la solicitud');
      }
      
      loadCaptcha(); // Recargar captcha en caso de error
    } finally {
      setLoading(false);
      setFormData(prev => ({ ...prev, captchaText: '' }));
    }
  };

  // Estilos CSS en línea para evitar problemas de importación
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f2f5',
      padding: '20px'
    },
    loginForm: {
      background: 'white',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px'
    },
    title: {
      textAlign: 'center',
      marginBottom: '10px',
      color: '#333'
    },
    subtitle: {
      textAlign: 'center',
      color: '#666',
      marginBottom: '30px',
      fontSize: '14px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    captchaContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px'
    },
    captchaDisplay: {
      flex: 1,
      padding: '10px',
      background: '#f8f9fa',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '20px',
      fontWeight: 'bold',
      letterSpacing: '2px',
      textAlign: 'center',
      color: '#333'
    },
    captchaRefreshBtn: {
      background: 'none',
      border: '1px solid #ddd',
      borderRadius: '5px',
      padding: '10px',
      cursor: 'pointer',
      fontSize: '16px'
    },
    loginBtn: {
      width: '100%',
      padding: '12px',
      background: '#1890ff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    loginBtnDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    message: {
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginForm}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        <p style={styles.subtitle}>Sistema de Inventario de Repuestos</p>
        
        {message && (
          <div style={{
            ...styles.message,
            ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="usuario@ejemplo.com"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Ingresa tu contraseña"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="captcha" style={styles.label}>Captcha:</label>
            <div style={styles.captchaContainer}>
              <div style={styles.captchaDisplay}>
                {captcha.text}
              </div>
              <button 
                type="button" 
                onClick={loadCaptcha} 
                style={styles.captchaRefreshBtn}
                disabled={loading}
              >
                🔄
              </button>
            </div>
            <input
              type="text"
              id="captcha"
              name="captchaText"
              value={formData.captchaText}
              onChange={handleInputChange}
              required
              placeholder="Ingresa el texto de arriba"
              style={{ ...styles.input, textTransform: 'uppercase' }}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.loginBtn,
              ...(loading ? styles.loginBtnDisabled : {})
            }}
            disabled={loading}
            onMouseOver={(e) => {
              if (!loading) e.target.style.backgroundColor = '#40a9ff';
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.backgroundColor = '#1890ff';
            }}
          >
            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;