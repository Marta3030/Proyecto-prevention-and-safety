
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { APP_NAME, ROUTES } from '../constants';
import { EnvelopeIcon, LockClosedIcon, LogoFull } from '../components/icons/Icons';
import useUIStore from '../store/uiStore';


const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error: authError, isAuthenticated } = useAuth();
  const darkMode = useUIStore((state) => state.darkMode);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    await login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pns-gray-50 dark:bg-pns-gray-900 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <LogoFull className="h-12 mb-2" isDark={darkMode}/>
          <h2 className="text-2xl font-bold text-center text-pns-text-dark dark:text-pns-text-light">{APP_NAME}</h2>
          <p className="text-sm text-pns-gray-500 dark:text-pns-gray-400">Bienvenido de nuevo</p>
        </div>
        
        {authError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="email"
            type="email"
            label="Correo Electrónico"
            icon={<EnvelopeIcon />}
            {...register('email')}
            error={errors.email?.message}
            placeholder="su@correo.com"
            disabled={isLoading}
          />
          <Input
            id="password"
            type="password"
            label="Contraseña"
            icon={<LockClosedIcon />}
            {...register('password')}
            error={errors.password?.message}
            placeholder="••••••••"
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
            {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-pns-gray-500 dark:text-pns-gray-400">
          ¿No tiene una cuenta?{' '}
          <a href="#" className="font-medium text-pns-blue hover:text-pns-blue-dark dark:text-pns-blue-light dark:hover:text-pns-blue">
            Contacte a soporte
          </a>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
