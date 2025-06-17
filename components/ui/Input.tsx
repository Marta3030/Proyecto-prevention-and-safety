import React, { InputHTMLAttributes, ReactElement } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactElement<{ className?: string }>; // Changed from React.ReactNode / ReactElement
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, icon, className, type = 'text', ...props }, ref) => {
    const baseInputClasses = "flex h-10 w-full rounded-md border border-pns-border-light dark:border-pns-border-dark bg-transparent py-2 text-sm ring-offset-pns-bg-light dark:ring-offset-pns-bg-dark file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-pns-gray-400 dark:placeholder:text-pns-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pns-blue dark:focus-visible:ring-pns-blue-light focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    const inputPadding = icon ? "pl-10 pr-3" : "px-3";

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-pns-text-dark dark:text-pns-text-light mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-pns-gray-400 dark:text-pns-gray-500">
              {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
          )}
          <input
            type={type}
            id={id}
            ref={ref}
            className={`${baseInputClasses} ${inputPadding} ${error ? 'border-red-500 dark:border-red-500 focus-visible:ring-red-500' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
