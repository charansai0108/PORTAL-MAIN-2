import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css'
import Preloader from './components/landing/PreLoader'
import NotificationModal from './components/Notification'
import DevTeam from './components/landing/DevTeam'
import LoginModal from './components/landing/LoginModal'
import SetuLandingPage from './components/landing/setu/SetuLandingPage'
import ProtectedRoute from './components/ProtectedRoute'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import SuperAdminEntry from './pages/dashboard/SuperAdminEntry'
import InterviewSessionPage from './pages/InterviewSessionPage'
import InterviewSessionToken from './pages/InterviewSessionToken'
import InterviewerDashboard from './pages/interview/InterviewerDashboard'
import InterviewerRoundEvaluation from './pages/interview/InterviewerRoundEvaluation'
import Assessment from './pages/Assessment'
import RecruiterScreening from './pages/recruiter/RecruiterScreening'
import JobDescriptionPage from './pages/JobDescriptionPage'
import AuthPage from './pages/AuthPage'
import Unsubscribe from './pages/Unsubscribe'
import ResetPassword from './pages/ResetPassword'
import Endorsement from './pages/Endorsement'
import PublicProfile from './pages/PublicProfile'
import GoogleAuthCallback from './pages/GoogleAuthCallback'
import CalendarOAuthCallback from './pages/CalendarOAuthCallback'
import StudentOnboarding from './pages/StudentOnboarding'
import { useAuth } from './hooks/useAuth'
import { AuthProvider } from './context/AuthContextJWT'
import AuthRedirect from './components/AuthRedirect'
import { ToastProvider } from './components/ui/Toast'

const LANDING_PRELOADER_KEY = 'landingPreloaderSeen';

function LandingPage() {
  const navigate = useNavigate();
  const { tenant } = useAuth();
  const [isLoading, setIsLoading] = useState(() => sessionStorage.getItem(LANDING_PRELOADER_KEY) === '1');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState('Student');

  const openLoginModal = (type = 'Student') => {
    setLoginRole(type);
    setIsLoginOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginOpen(false);
  };

  const handleMeetDevTeam = () => navigate('/dev-team');

  const handleContactTeam = () => {
    document.getElementById('setu-footer-contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {isLoading ? (
        <Preloader onComplete={() => { sessionStorage.setItem(LANDING_PRELOADER_KEY, '1'); setIsLoading(false); }} />
      ) : (
        <main className="w-full min-h-screen">
          <NotificationModal />

          <LoginModal
            isOpen={isLoginOpen}
            onClose={handleCloseLoginModal}
            defaultRole={loginRole}
          />

          <SetuLandingPage
            onLoginOpen={openLoginModal}
            onContactTeam={handleContactTeam}
            onMeetDevTeam={handleMeetDevTeam}
            logo={tenant?.logo}
            collegeName={tenant?.name}
          />
        </main>
      )}
    </>
  )
}

function AppContent() {
  const { loading, tenant } = useAuth();

  // Apply tenant branding colors
  useEffect(() => {
    if (tenant?.themeColor) {
      document.documentElement.style.setProperty('--tenant-primary', tenant.themeColor);
      // Use theme color to generate a subtle background variant if needed
      document.documentElement.style.setProperty('--tenant-primary-light', `${tenant.themeColor}15`);
    }
  }, [tenant]);

  // Global listener for calendar OAuth popup - survives tab switches so we always receive the result
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'GOOGLE_CALENDAR_RESULT') {
        window.dispatchEvent(new CustomEvent('calendar-oauth-complete', { detail: event.data }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <AuthRedirect />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage defaultMode="login" />} />
        <Route path="/signup" element={<AuthPage defaultMode="register" />} />
        <Route path="/forgot" element={<AuthPage defaultMode="forgot" />} />
        <Route path="/dev-team" element={<DevTeam />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/google-callback" element={<GoogleAuthCallback />} />
        <Route path="/calendar/oauth-callback" element={<CalendarOAuthCallback />} />
        <Route path="/profile/:publicProfileId" element={<PublicProfile />} />
        <Route path="/endorse/:token" element={<Endorsement />} />
        <Route path="/endorsement/:token" element={<Endorsement />} /> {/* Legacy route support */}
        <Route path="/interview/:token" element={<InterviewSessionToken />} /> {/* Legacy token-based interview session */}
        <Route path="/interview/session/:sessionId" element={<InterviewerDashboard />} /> {/* New interviewer dashboard */}
        <Route path="/interview/round/:roundId" element={<InterviewerRoundEvaluation />} /> {/* Interviewer round evaluation */}
        <Route path="/recruiter/screening" element={<RecruiterScreening />} /> {/* Token-based recruiter screening (no login) */}
        <Route path="/job/:jobId" element={<JobDescriptionPage />} /> {/* Job Description Page */}

        {/* Protected routes */}
        <Route element={<ProtectedRoute allowRoles={['student']} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/onboarding" element={<StudentOnboarding />} />
        </Route>

        <Route element={<ProtectedRoute allowRoles={['recruiter']} />}>
          <Route path="/recruiter" element={<RecruiterDashboard />} />
        </Route>

        {/* Admin routes - ADMIN, RECRUITER and TENANT_SUPER_ADMIN can access */}
        <Route element={<ProtectedRoute allowRoles={['admin', 'recruiter', 'tenant_super_admin']} />}>
          <Route path="/admin/interview-session/:interviewId" element={<InterviewSessionPage />} />
          <Route path="/admin/assessment/:interviewId/:roundName" element={<Assessment />} />
          <Route path="/admin/job/:jobId" element={<AdminDashboard />} />
          <Route path="/admin/jobs/:jobId/applications" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Super Admin routes - Landlord and Community Boss only */}
        <Route element={<ProtectedRoute allowRoles={['super_admin', 'tenant_super_admin']} />}>
          <Route path="/super-admin/interview-session/:interviewId" element={<InterviewSessionPage />} />
          <Route path="/super-admin/assessment/:interviewId/:roundName" element={<Assessment />} />
          <Route path="/super-admin/job/:jobId" element={<SuperAdminEntry />} />
          <Route path="/super-admin/jobs/:jobId/applications" element={<SuperAdminEntry />} />
          <Route path="/super-admin" element={<SuperAdminEntry />} />
        </Route>

        {/* Admin-only routes - Only ADMIN can access */}
        <Route element={<ProtectedRoute allowRoles={['admin']} />}>
          {/* Add admin-only routes here if needed */}
        </Route>

        {/* Interviewer routes (token-based, no auth required) */}
        <Route path="/interview/session/:sessionId" element={<InterviewerDashboard />} />
        <Route path="/interview/round/:roundId" element={<InterviewerRoundEvaluation />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  )
}

export default App;
