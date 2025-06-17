
import React from 'react';
import { Link } from 'react-router-dom';
import { LogoFull } from '../icons/Icons';
import useUIStore from '../../store/uiStore';

interface LogoProps {
  className?: string;
  textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ className, textClassName }) => {
  const darkMode = useUIStore((state) => state.darkMode);
  return (
    <Link to="/" className={`flex items-center space-x-2 ${className}`}>
      <LogoFull className="h-8 md:h-10 w-auto" isDark={darkMode} />
    </Link>
  );
};

export default Logo;
