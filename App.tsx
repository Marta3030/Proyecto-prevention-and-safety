import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ROUTES } from './constants';
import { UserRole } from './types'; // Corrected import for UserRole
import useUIStore from './store/uiStore';
import { useAuth } from './hooks/useAuth';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const RiskManagementPage = lazy(() => import('./pages/RiskManagementPage'));
const IncidentManagementPage = lazy(() => import('./pages/IncidentManagementPage'));
const CommitteePage = lazy(() => import('./pages/CommitteePage'));
const DocumentManagementPage = lazy(() => import('./pages/DocumentManagementPage'));
const AlertsPage = lazy(() => import('./pages/AlertsPage'));
const AuditsPage = lazy(() => import('./pages/AuditsPage'));
const TrainingPage = lazy(() => import('./pages/TrainingPage'));
const CompliancePage = lazy(() => import('./pages/CompliancePage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
// ISO Standards Pages
const ISO45001Page = lazy(() => import('./pages/iso/ISO45001Page'));
const ISO14001Page = lazy(() => import('./pages/iso/ISO14001Page'));
const ISO9001Page = lazy(() => import('./pages/iso/ISO9001Page'));

const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-pns-bg-light dark:bg-pns-bg-dark">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pns-blue dark:border-pns-orange"></div>
  </div>
);

const App: React.FC = () => {
  const darkMode = useUIStore((state) => state.darkMode);
  const { isAuthenticated } = useAuth(); // To redirect if already logged in from /login

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <HashRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <LoginPage />} />
          
          <Route element={<ProtectedRoute />}> {/* Protects all routes within Layout */}
            <Route element={<Layout />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route 
                path={ROUTES.RISK_MANAGEMENT} 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.GERENCIA, UserRole.PREVENCION, UserRole.OPERACIONES]}>
                    <RiskManagementPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.INCIDENT_MANAGEMENT} 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.GERENCIA, UserRole.PREVENCION, UserRole.RRHH, UserRole.OPERACIONES]}>
                    <IncidentManagementPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.COMMITTEE_MEETINGS} 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.GERENCIA, UserRole.PREVENCION, UserRole.COMITE, UserRole.RRHH]}>
                    <CommitteePage />
                  </ProtectedRoute>
                } 
              />
               <Route 
                path={ROUTES.DOCUMENT_MANAGEMENT} 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.GERENCIA, UserRole.PREVENCION, UserRole.RRHH, UserRole.COMITE, UserRole.OPERACIONES]}>
                    <DocumentManagementPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.ALERTS} 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.GERENCIA, UserRole.PREVENCION]}>
                    <AlertsPage />
                  </ProtectedRoute>
                } 
              />
               <Route 
                path={ROUTES.AUDITS_INSPECTIONS} 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.GERENCIA, UserRole.PREVENCION]}>
                    <AuditsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.TRAINING} 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.RRHH, UserRole.PREVENCION]}>
                    <TrainingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.COMPLIANCE} 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.GERENCIA, UserRole.PREVENCION]}>
                    <CompliancePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.REPORTS} 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.GERENCIA, UserRole.PREVENCION, UserRole.RRHH]}>
                    <ReportsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
              {/* ISO Standards Routes */}
              <Route 
                path={ROUTES.ISO_45001} 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.GERENCIA, UserRole.PREVENCION]}>
                    <ISO45001Page />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.ISO_14001} 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.GERENCIA, UserRole.PREVENCION, UserRole.OPERACIONES]}>
                    <ISO14001Page />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.ISO_9001} 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.GERENCIA, UserRole.PREVENCION, UserRole.OPERACIONES]}>
                    <ISO9001Page />
                  </ProtectedRoute>
                } 
              />
              {/* Add more protected routes here */}
            </Route>
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;