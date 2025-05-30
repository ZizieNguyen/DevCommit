import React from 'react';

export const Badge = ({ 
  children, 
  variant = 'primary', 
  className = '',
  ...props 
}) => {
  // Mapa de variantes a clases
  const variantClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    warning: 'bg-yellow-500/10 text-yellow-700',
    danger: 'bg-red-500/10 text-red-700',
    success: 'bg-green-500/10 text-green-700',
    // Colores para categorías
    'categoria-1': 'bg-categoria-1/10 text-categoria-1',
    'categoria-2': 'bg-categoria-2/10 text-categoria-2',
    'categoria-3': 'bg-categoria-3/10 text-categoria-3',
    'categoria-4': 'bg-categoria-4/10 text-categoria-4',
    'categoria-5': 'bg-categoria-5/10 text-categoria-5',
  };

  return (
    <span 
      className={`
        inline-block text-sm font-medium px-2 py-1 rounded-full
        ${variantClasses[variant] || variantClasses.primary}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};