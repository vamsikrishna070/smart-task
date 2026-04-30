export function Alert({ children, variant = 'info', className = '' }) {
  const variantClass = {
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    danger: 'bg-red-50 border-red-200 text-red-700',
  }[variant];

  return (
    <div className={`p-4 border rounded-lg ${variantClass} ${className}`}>
      {children}
    </div>
  );
}
