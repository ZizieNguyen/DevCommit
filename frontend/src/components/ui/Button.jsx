import React from 'react';
import { Link } from 'react-router-dom';

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  as = 'button',
  href,
  to,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-block rounded-md transition-colors text-center font-medium';
  
  const variantStyles = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white',
    accent: 'bg-accent hover:bg-accent-dark text-white',
    outline: 'bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  const sizeStyles = {
    small: 'text-xs py-1 px-3',
    medium: 'text-sm py-2 px-4',
    large: 'text-base py-3 px-6',
  };
  
  const classes = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.medium}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;
  
  if (as === 'link' && to) {
    return <Link to={to} className={classes} {...props}>{children}</Link>;
  }
  
  if (as === 'a' && href) {
    return <a href={href} className={classes} {...props}>{children}</a>;
  }
  
  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};