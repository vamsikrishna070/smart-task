export function Badge({ children, variant = 'default', className = '' }) {
  const variantClass = {
    default: 'bg-slate-200 text-slate-800',
    primary: 'bg-blue-200 text-blue-800',
    success: 'bg-green-200 text-green-800',
    warning: 'bg-yellow-200 text-yellow-800',
    danger: 'bg-red-200 text-red-800',
  }[variant];

  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-full ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
