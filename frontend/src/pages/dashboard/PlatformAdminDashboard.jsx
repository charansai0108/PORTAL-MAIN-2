import React from 'react';
import SuperAdminDashboard from './SuperAdminDashboard';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function PlatformAdminDashboard() {
  const { user, role, loading } = useAuth();
  const userRole = (role || user?.role || '').toUpperCase();
  if (loading) return null;
  if (userRole !== 'SUPER_ADMIN') return <Navigate to="/" replace />;
  return <SuperAdminDashboard forceLandlord={true} />;
}

