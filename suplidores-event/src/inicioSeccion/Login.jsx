// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje('');

    try {
      const res = await axios.post('/api/login', {
        username,
        password,
      });

      localStorage.setItem('token', res.data.token);
      setMensaje('Login exitoso');
      navigate('/dashboardproveedor');
    } catch (err) {
      setMensaje(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(to bottom right, #94c8d6, #012e33)'
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <form 
          onSubmit={handleLogin} 
          style={{ 
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <h2 style={{ 
            fontSize: '1.875rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#012e33'
          }}>
            Iniciar Sesión
          </h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="username" 
              style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}
            >
              Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="password" 
              style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#012e33',
              color: 'white',
              borderRadius: '0.5rem',
              fontWeight: '500',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Iniciando sesión...' : 'Entrar'}
          </button>

          {mensaje && (
            <p style={{ 
              marginTop: '1rem',
              textAlign: 'center',
              color: mensaje.includes('exitoso') ? '#059669' : '#DC2626'
            }}>
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
