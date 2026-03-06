import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import PlatformAdminDashboard from './PlatformAdminDashboard';
import TenantSuperAdminDashboard from './TenantSuperAdminDashboard';
import { Navigate } from 'react-router-dom';

export default function SuperAdminEntry() {
  const { user, role, loading } = useAuth();
  const userRole = (role || user?.role || '').toUpperCase();
  if (loading) return null;
  if (userRole === 'SUPER_ADMIN') return <PlatformAdminDashboard />;
  if (userRole === 'TENANT_SUPER_ADMIN') return <TenantSuperAdminDashboard />;
  return <Navigate to="/" replace />;
}

