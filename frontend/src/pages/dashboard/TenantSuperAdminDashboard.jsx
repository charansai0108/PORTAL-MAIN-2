import React from 'react';
import SuperAdminDashboard from './SuperAdminDashboard';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function TenantSuperAdminDashboard() {
  const { user, role, loading } = useAuth();
  const userRole = (role || user?.role || '').toUpperCase();
  if (loading) return null;
  if (userRole !== 'TENANT_SUPER_ADMIN') return <Navigate to="/" replace />;
  return <SuperAdminDashboard forceTenant={true} />;
}

