import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};