// src/components/ui/TextField.jsx
import React, { useState } from 'react';

export const TextField = ({
  label,
  type = 'text',
  id,
  name,
  placeholder = '',
  value,
  onChange,
  error = '',
  required = false,
  className = '',
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id || name} 
          className="block mb-2 font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={id || name}
        name={name || id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-4 py-2 border rounded-lg transition-colors
          ${error ? 'border-red-500 bg-red-50' : 
            isFocused ? 'border-primary outline-none ring-1 ring-primary' : 
            'border-gray-300 focus:border-primary'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};