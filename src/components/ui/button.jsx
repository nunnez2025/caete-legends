import React from 'react';

export const Button = ({ 
  children, 
  className = '', 
  size = 'md',
  variant = 'primary',
  disabled = false,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white',
    secondary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
    danger: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white',
    ghost: 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
  };

  return (
    <button
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        font-bold rounded-xl shadow-lg transform hover:scale-105 active:scale-95
        transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
        disabled:transform-none ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};