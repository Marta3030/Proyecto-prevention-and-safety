
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials } from '../types';
import { ROUTES } from '../constants';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Clear error when component mounts or unmounts
  useEffect(() => {
    clearError();
    setFocus('email');
    
    return () => {
      clearError();
    };
  }, [clearError, setFocus]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    clearError();
    
    try {
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      };
      
      await login(credentials);
      
      // Navigation is handled by the useEffect above
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDemoLogin = (role: string) => {
    const demoCredentials = {
      'admin': { email: 'admin@pns.com', password: 'password123' },
      'gerencia': { email: 'gerencia@pns.com', password: 'password123' },
      'rrhh': { email: 'rrhh@pns.com', password: 'password123' },
    };

    const credentials = demoCredentials[role as keyof typeof demoCredentials];
    if (credentials) {
      onSubmit({ ...credentials, rememberMe: false });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pns-blue to-pns-blue-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Shield className="h-8 w-8 text-pns-blue" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">
            {t('auth.welcome')}
          </h1>
          <p className="mt-2 text-sm text-blue-100">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
                {t('auth.email')}
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className="input-field"
                placeholder="usuario@ejemplo.com"
                disabled={isLoading || isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-pns-gray-700 dark:text-pns-gray-300 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="input-field pr-10"
                  placeholder="••••••••"
                  disabled={isLoading || isSubmitting}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading || isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-pns-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-pns-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('rememberMe')}
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-pns-blue focus:ring-pns-blue border-pns-gray-300 rounded"
                  disabled={isLoading || isSubmitting}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-pns-gray-700 dark:text-pns-gray-300">
                  {t('auth.remember')}
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-pns-blue hover:text-pns-blue-dark">
                  {t('auth.forgotPassword')}
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
            >
              {(isLoading || isSubmitting) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <span>{t('auth.login')}</span>
            </button>
          </form>

          {/* Demo Users */}
          <div className="mt-8 pt-6 border-t border-pns-gray-200 dark:border-pns-gray-700">
            <p className="text-sm text-pns-gray-600 dark:text-pns-gray-400 text-center mb-4">
              Usuarios de demostración:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading || isSubmitting}
                className="btn-secondary text-sm py-2"
              >
                👨‍💼 Administrador
              </button>
              <button
                onClick={() => handleDemoLogin('gerencia')}
                disabled={isLoading || isSubmitting}
                className="btn-secondary text-sm py-2"
              >
                🏢 Gerencia
              </button>
              <button
                onClick={() => handleDemoLogin('rrhh')}
                disabled={isLoading || isSubmitting}
                className="btn-secondary text-sm py-2"
              >
                👥 Recursos Humanos
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-blue-100">
            © 2024 Prevention & Safety. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
