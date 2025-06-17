
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { EnvelopeIcon, UserCircleIcon, LockClosedIcon } from '../components/icons/Icons';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-pns-text-dark dark:text-pns-text-light">Configuración de Cuenta</h1>
      
      <Card title="Perfil de Usuario">
        {user && (
          <form className="space-y-4">
            <Input 
                label="Nombre Completo" 
                id="name" 
                defaultValue={user.name} 
                icon={<UserCircleIcon />}
            />
            <Input 
                label="Correo Electrónico" 
                id="email" 
                type="email" 
                defaultValue={user.email} 
                icon={<EnvelopeIcon />}
                disabled 
            />
             <Input 
                label="Rol" 
                id="role" 
                defaultValue={user.role} 
                disabled
            />
            <Button type="submit">Guardar Cambios</Button>
          </form>
        )}
      </Card>

      <Card title="Cambiar Contraseña">
        <form className="space-y-4">
            <Input 
                label="Contraseña Actual" 
                id="currentPassword" 
                type="password"
                icon={<LockClosedIcon />}
            />
            <Input 
                label="Nueva Contraseña" 
                id="newPassword" 
                type="password"
                icon={<LockClosedIcon />}
            />
            <Input 
                label="Confirmar Nueva Contraseña" 
                id="confirmNewPassword" 
                type="password"
                icon={<LockClosedIcon />}
            />
            <Button type="submit">Actualizar Contraseña</Button>
        </form>
      </Card>
       <Card title="Preferencias">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-pns-text-dark dark:text-pns-text-light">Notificaciones por correo</span>
                    <label htmlFor="emailNotifications" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" id="emailNotifications" className="sr-only peer" defaultChecked/>
                        <div className="w-11 h-6 bg-pns-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pns-blue-light dark:peer-focus:ring-pns-blue-dark rounded-full peer dark:bg-pns-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pns-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-pns-gray-600 peer-checked:bg-pns-blue"></div>
                    </label>
                </div>
                 <div className="flex items-center justify-between">
                    <span className="text-pns-text-dark dark:text-pns-text-light">Idioma</span>
                    <select className="bg-pns-card-bg-light dark:bg-pns-card-bg-dark border border-pns-border-light dark:border-pns-border-dark rounded-md p-2 text-sm">
                        <option>Español</option>
                        <option>English (Próximamente)</option>
                    </select>
                </div>
            </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
