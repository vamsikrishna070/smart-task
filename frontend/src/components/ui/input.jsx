import React from 'react';

export function Input({ className = '', ...props }) {
  const baseClasses = 'w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900';

  return (
    <input
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
}
