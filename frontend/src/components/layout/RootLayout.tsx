import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { UserProvider } from '@/context/UserContext';
import { FamilyProvider } from '@/context/FamilyContext';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SubscriptionProvider>
          <UserProvider>
            <FamilyProvider>
              {children}
            </FamilyProvider>
          </UserProvider>
        </SubscriptionProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
