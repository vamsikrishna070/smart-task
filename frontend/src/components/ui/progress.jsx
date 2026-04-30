export function ProgressBar({ value = 0, max = 100, className = '' }) {
  const percentage = (value / max) * 100;

  return (
    <div className={`w-full h-2 bg-slate-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-blue-600 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
