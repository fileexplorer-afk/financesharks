import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { GoalsPage } from '@/pages/GoalsPage';
import { InsightsPage } from '@/pages/InsightsPage';
import { CollaborationPage } from '@/pages/CollaborationPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PricingPage } from '@/pages/PricingPage';
import { AdminPage } from '@/pages/AdminPage';
import LandingPage from '@/pages/LandingPage';

const P = ({ children }: { children: React.ReactNode }) => <ProtectedRoute>{children}</ProtectedRoute>;

function App() {
  return (
    <RootLayout>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<P><ProfilePage /></P>} />
          <Route path="/dashboard" element={<P><DashboardPage /></P>} />
          <Route path="/portfolio" element={<P><PortfolioPage /></P>} />
          <Route path="/transactions" element={<P><TransactionsPage /></P>} />
          <Route path="/goals" element={<P><GoalsPage /></P>} />
          <Route path="/insights" element={<P><InsightsPage /></P>} />
          <Route path="/collaboration" element={<P><CollaborationPage /></P>} />
          <Route path="/reports" element={<P><ReportsPage /></P>} />
          <Route path="/settings" element={<P><SettingsPage /></P>} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/admin" element={<P><AdminPage /></P>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </RootLayout>
  );
}

export default App
