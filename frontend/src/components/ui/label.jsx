export function Label({ children, htmlFor = '', className = '' }) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium text-slate-700 ${className}`}>
      {children}
    </label>
  );
}
