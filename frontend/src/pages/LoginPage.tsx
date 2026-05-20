import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoginSignup from "@/components/ui/login-signup";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (email: string, password: string) => {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return null;

  return (
    <LoginSignup
      onLogin={handleLogin}
      onRegister={handleRegister}
      loading={loading}
      error={error}
    />
  );
}
