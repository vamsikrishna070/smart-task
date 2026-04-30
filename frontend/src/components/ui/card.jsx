import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
