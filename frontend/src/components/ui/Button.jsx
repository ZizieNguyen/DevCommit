import React from 'react';
import { Link } from 'react-router-dom';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  as,
  disabled = false,
  className = '',
  ...props 
}) => {
  // Configurar clases base
  const baseClasses = 'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Clases según variante
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-secondary text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 focus:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  // Clases según tamaño
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4',
    large: 'py-3 px-6 text-lg',
  };
  
  // Combinar todas las clases
  const classes = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${fullWidth ? 'w-full' : ''} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();
  
  // Si es un enlace, usar Link de react-router
  if (as === 'a' && props.href) {
    return (
      <a className={classes} {...props}>
        {children}
      </a>
    );
  }
  
  // Si es un enlace interno, usar Link
  if (as === 'link' && props.to) {
    return (
      <Link className={classes} {...props}>
        {children}
      </Link>
    );
  }
  
  // Por defecto, renderizar como botón
  return (
    <button 
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};