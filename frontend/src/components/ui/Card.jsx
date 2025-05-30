import React from 'react';

export const Card = ({ 
  children, 
  hover = false, 
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        ${hover ? 'transition-shadow duration-200 hover:shadow-lg' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};