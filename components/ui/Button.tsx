
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-pns-bg-light dark:ring-offset-pns-bg-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pns-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors duration-150 ease-in-out";

  const variantStyles = {
    default: 'bg-pns-blue text-pns-text-light hover:bg-pns-blue/90 dark:bg-pns-blue dark:hover:bg-pns-blue/90',
    destructive: 'bg-red-500 text-pns-text-light hover:bg-red-500/90 dark:bg-red-600 dark:hover:bg-red-600/90',
    outline: 'border border-pns-border-light dark:border-pns-border-dark bg-transparent hover:bg-pns-gray-100 dark:hover:bg-pns-gray-800 text-pns-text-dark dark:text-pns-text-light',
    secondary: 'bg-pns-orange text-pns-text-light hover:bg-pns-orange/90 dark:bg-pns-orange dark:hover:bg-pns-orange/80',
    ghost: 'hover:bg-pns-gray-100 dark:hover:bg-pns-gray-800 text-pns-text-dark dark:text-pns-text-light',
    link: 'text-pns-blue dark:text-pns-blue-light underline-offset-4 hover:underline',
  };

  const sizeStyles = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};

export default Button;
