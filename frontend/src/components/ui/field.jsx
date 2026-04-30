export function Field({ children, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
}
