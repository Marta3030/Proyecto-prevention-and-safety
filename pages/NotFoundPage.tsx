import React from 'react';
import { Link } from 'react-router-dom';
// Button component is not used directly for the link anymore, styling is applied to Link
import { ROUTES } from '../constants';
import { ShieldCheckIcon } from '../components/icons/Icons'; // Using a relevant icon

const NotFoundPage: React.FC = () => {
  const buttonClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-pns-bg-light dark:ring-offset-pns-bg-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pns-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors duration-150 ease-in-out bg-pns-blue text-pns-text-light hover:bg-pns-blue/90 dark:bg-pns-blue dark:hover:bg-pns-blue/90 h-10 px-4 py-2";

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center px-4">
        <ShieldCheckIcon className="w-24 h-24 text-pns-orange mb-6" />
      <h1 className="text-6xl font-extrabold text-pns-blue dark:text-pns-blue-light mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-pns-text-dark dark:text-pns-text-light mb-3">Página No Encontrada</h2>
      <p className="text-pns-gray-600 dark:text-pns-gray-400 mb-8 max-w-md">
        Lo sentimos, la página que está buscando no existe o ha sido movida.
        Verifique la URL o regrese al inicio.
      </p>
      <Link to={ROUTES.DASHBOARD} className={buttonClasses}>
        Volver al Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;