import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SIDEBAR_NAV_ITEMS } from '../../constants';
import { UserRole, NavigationItem } from '../../types';
import useUIStore from '../../store/uiStore';
import { ChevronDownIcon, ChevronRightIcon, XMarkIcon } from '../icons/Icons';
import Button from '../ui/Button';

const SidebarNavItem: React.FC<{ item: NavigationItem; closeSidebar: () => void; currentRole: UserRole | undefined }> = ({ item, closeSidebar, currentRole }) => {
  const location = useLocation();
  
  // 1. Verificación de visibilidad basada en el rol
  if (!currentRole || !item.allowedRoles.includes(currentRole)) {
    return null;
  }

  const hasChildren = item.children && item.children.length > 0;

  // 2. Lógica de isActive refinada
  // Determina si el elemento de navegación actual (padre o hoja) debe considerarse activo.
  let calculatedIsActive = false;
  if (item.path) {
    if (item.path === '/') {
      // Para la ruta raíz ('/'), solo está activa si la ubicación actual es exactamente '/'.
      calculatedIsActive = location.pathname === '/';
    } else {
      // Para cualquier otra ruta:
      // - Está activa si la ubicación actual coincide exactamente con la ruta del elemento, O
      // - Si el elemento tiene hijos Y la ubicación actual comienza con la ruta del elemento seguida de una barra.
      //   Esto maneja casos en los que un elemento de menú padre debe aparecer activo cuando uno de sus hijos está activo.
      calculatedIsActive = location.pathname === item.path || 
                           (hasChildren && location.pathname.startsWith(item.path + '/'));
    }
  }
  
  // 3. Inicializar el estado `isOpen` para los elementos padre
  // Si el elemento tiene hijos Y se calcula como activo, comienza abierto.
  // Esto asegura que los menús padre que contienen la ruta activa estén expandidos por defecto.
  const [isOpen, setIsOpen] = useState(hasChildren && calculatedIsActive);

  // 4. Manejar clics en los elementos de navegación
  const handleItemClick = () => {
    if (hasChildren) {
      // Si es un elemento padre, alterna su estado abierto/cerrado.
      setIsOpen(!isOpen);
    } else {
      // Si es un elemento hoja (sin hijos), cierra la barra lateral (útil para móviles).
      closeSidebar();
    }
  };

  // 5. Estilos de íconos dinámicos basados en el estado activo
  const iconClasses = (active: boolean) => 
    `mr-3 h-5 w-5 flex-shrink-0 ${active ? 'text-pns-orange dark:text-pns-orange-light' : 'text-pns-gray-400 dark:text-pns-gray-500 group-hover:text-pns-text-dark dark:group-hover:text-pns-text-light'}`;

  return (
    <li>
      {hasChildren ? (
         // Si el elemento tiene hijos, renderiza un botón para alternar su submenú.
         <button
          onClick={handleItemClick}
          className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md
            ${calculatedIsActive ? 'bg-pns-blue-light dark:bg-pns-blue-dark text-pns-blue-dark dark:text-pns-blue-light' : 'text-pns-text-dark dark:text-pns-text-light hover:bg-pns-gray-200 dark:hover:bg-pns-gray-700 hover:text-pns-text-dark dark:hover:text-pns-text-light'}
            transition-colors duration-150 ease-in-out`}
          aria-expanded={isOpen}
        >
          {/* Ícono y nombre para el botón padre */}
          <item.icon className={iconClasses(calculatedIsActive)} />
          <span className="flex-1 text-left">{item.name}</span>
          {/* Ícono de chevron que indica el estado abierto/cerrado */}
          {isOpen ? <ChevronDownIcon className="ml-auto h-4 w-4" /> : <ChevronRightIcon className="ml-auto h-4 w-4" />}
        </button>
      ) : (
        // Si el elemento no tiene hijos, renderiza un NavLink.
        <NavLink
          to={item.path} // item.path siempre debe estar definido aquí según el tipo NavigationItem
          onClick={handleItemClick}
          // La prop `className` de NavLink puede aceptar una función con `isActive`
          className={({ isActive: navIsActive }) =>
            `group flex items-center px-3 py-2.5 text-sm font-medium rounded-md
            ${navIsActive ? 'bg-pns-blue-light dark:bg-pns-blue-dark text-pns-blue-dark dark:text-pns-blue-light' : 'text-pns-text-dark dark:text-pns-text-light hover:bg-pns-gray-200 dark:hover:bg-pns-gray-700 hover:text-pns-text-dark dark:hover:text-pns-text-light'}
            transition-colors duration-150 ease-in-out`
          }
        >
         {/* Los hijos de NavLink también pueden ser una función con `isActive` para renderizar contenido */}
         {({ isActive: navIsActive }) => ( 
            <>
              {/* Usa el isActive de NavLink para estilizar su contenido directo */}
              <item.icon className={iconClasses(navIsActive)} />
              <span className="flex-1">{item.name}</span>
            </>
          )}
        </NavLink>
      )}
      {/* Renderiza los hijos si existen y el padre está abierto */}
      {hasChildren && isOpen && (
        <ul className="pl-5 mt-1 space-y-1">
          {item.children?.map((child) => (
            <SidebarNavItem 
              key={child.path || child.name} 
              item={child} 
              closeSidebar={closeSidebar} 
              currentRole={currentRole} 
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar: React.FC = () => {
  const { userRole } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const closeSidebar = () => {
    if (window.innerWidth < 768) { // Solo cerrar en móvil
      setSidebarOpen(false);
    }
  };
  
  if (!sidebarOpen && window.innerWidth < 768) { // Solo retornar null si la barra lateral está cerrada Y en móvil
      return null;
  }

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-pns-nav-bg-light dark:bg-pns-nav-bg-dark border-r border-pns-border-light dark:border-pns-border-dark transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] flex-col shadow-lg md:shadow-none ${sidebarOpen ? 'flex' : 'hidden md:flex'}`}>
       <div className="flex items-center justify-end p-2 md:hidden">
         <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú lateral">
           <XMarkIcon className="h-6 w-6" />
         </Button>
       </div>
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <ul className="space-y-1.5">
          {SIDEBAR_NAV_ITEMS.map((item) => (
            <SidebarNavItem key={item.path || item.name} item={item} closeSidebar={closeSidebar} currentRole={userRole} />
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-pns-border-light dark:border-pns-border-dark">
        <p className="text-xs text-center text-pns-gray-500 dark:text-pns-gray-400">
          © {new Date().getFullYear()} Prevention & Safety
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
