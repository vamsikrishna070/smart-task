import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function Select({ options = [], value, onChange, placeholder = 'Select...', disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-500 flex items-center justify-between"
      >
        <span>
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder}
        </span>
        <ChevronDown size={16} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 border border-slate-300 rounded-lg bg-white shadow-lg z-10">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange({ target: { value: opt.value } });
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-slate-100 ${
                value === opt.value ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
