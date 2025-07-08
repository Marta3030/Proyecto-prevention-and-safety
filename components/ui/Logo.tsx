
import React from 'react';
import { Shield } from 'lucide-react';

interface LogoProps {
  className?: string;
  textClassName?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showText = true, 
  size = 'md' 
}) => {
  const sizeClasses: Record<string, string> = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizes: Record<string, string> = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo circular con casco de seguridad */}
      <div className={`${sizeClasses[size]} relative rounded-full bg-gradient-to-b from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-yellow-600`}>
        {/* Casco de seguridad */}
        <div className="relative">
          <Shield className="h-6 w-6 text-gray-800" />
          {/* Silueta de trabajador */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-gray-800 rounded-full opacity-80"></div>
        </div>
        
        {/* Texto circular alrededor (simulado con posicionamiento) */}
        <div className="absolute inset-0 rounded-full border-2 border-yellow-600">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-yellow-900 tracking-wider">
            PREVENTION
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-yellow-900 tracking-wider">
            & SAFETY
          </div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-pns-orange ${textSizes[size]} leading-tight`}>
            PREVENTION
          </span>
          <span className={`font-bold text-pns-orange ${textSizes[size]} leading-tight`}>
            AND SAFETY
          </span>
          <span className="text-xs text-pns-gray-600 dark:text-pns-gray-400 font-medium">
            Safety for Everyone
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
