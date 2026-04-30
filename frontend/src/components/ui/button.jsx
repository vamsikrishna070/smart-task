import React from 'react';

export function Button({ children, onClick, className = '', disabled = false, variant = 'primary', size = 'md', type = 'button' }) {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    outline: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-blue-500',
    destructive: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={finalClasses}
    >
      {children}
    </button>
  );
}
