import React from 'react';

export function Toaster() {
  return <div id="toast-container" className="fixed bottom-4 right-4 z-50 space-y-2"></div>;
}

export function useToast() {
  return {
    toast: ({ title, description, variant = 'default' }) => {
      console.log({ title, description, variant });
    },
  };
}

export function TooltipProvider({ children }) {
  return <>{children}</>;
}
