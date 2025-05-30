import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  
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
    
    if (!formData.nombre) {
      errors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.email) {
      errors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Formato de correo inválido';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Enviamos solo los datos necesarios para el registro
      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      };
      
      await register(userData);
      navigate('/');
    } catch (error) {
      setFormErrors({
        general: error.message || 'Error al registrarse'
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h1>
        
        {formErrors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {formErrors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre completo"
            type="text"
            name="nombre"
            id="nombre"
            placeholder="Tu nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={formErrors.nombre}
            required
          />
          
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
          
          <TextField
            label="Confirmar contraseña"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="********"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={formErrors.confirmPassword}
            required
          />
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-6"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};