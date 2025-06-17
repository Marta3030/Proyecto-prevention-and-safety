
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, titleClassName = '', footer, actions }) => {
  return (
    <div className={`bg-pns-card-bg-light dark:bg-pns-card-bg-dark border border-pns-border-light dark:border-pns-border-dark rounded-lg shadow-md ${className}`}>
      {(title || actions) && (
        <div className="px-4 py-3 sm:px-6 flex justify-between items-center border-b border-pns-border-light dark:border-pns-border-dark">
          {title && <h3 className={`text-lg font-semibold leading-6 text-pns-text-dark dark:text-pns-text-light ${titleClassName}`}>{title}</h3>}
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-6">
        {children}
      </div>
      {footer && (
        <div className="px-4 py-3 sm:px-6 border-t border-pns-border-light dark:border-pns-border-dark">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
