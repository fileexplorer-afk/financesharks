import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import BoxLoader from '@/components/ui/box-loader';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--bg-primary)]">
        <BoxLoader />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
