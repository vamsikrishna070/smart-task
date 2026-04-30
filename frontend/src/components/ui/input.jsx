import React from 'react';

export function Input({ type = 'text', value, onChange, placeholder = '', required = false, className = '' }) {
  const baseClasses = 'w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`${baseClasses} ${className}`}
    />
  );
}
