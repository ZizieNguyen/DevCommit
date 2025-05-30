import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const { login, loading } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario escribe
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Formato de correo inválido';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      setFormErrors({
        general: error.message || 'Error al iniciar sesión'
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        
        {formErrors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {formErrors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            type="email"
            name="email"
            id="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            required
          />
          
          <TextField
            label="Contraseña"
            type="password"
            name="password"
            id="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            required
          />
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-6"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" className="text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};