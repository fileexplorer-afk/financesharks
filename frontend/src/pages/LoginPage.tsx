import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, InputGroup, InputLabel } from "@/components/ui/input";
import { Heading, Text, Muted } from "@/components/ui/typography";
import { useAuth } from "@/hooks/useAuth";
import { DEMO_USER_NAME, DEMO_USER_EMAIL } from "@/lib/constants";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-sm">
          <motion.div variants={item} className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-gradient)] flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Sparkles size={20} className="text-[var(--bg-primary)]" />
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                Finance<span className="text-[var(--color-accent)]">Sharks</span>
              </span>
            </div>
            <Heading level={1} className="mb-2">{isSignUp ? "Create account" : "Welcome back"}</Heading>
            <Text className="text-[var(--text-secondary)]">
              {isSignUp ? "Start your financial journey." : "Sign in to your financial command center."}
            </Text>
          </motion.div>

          <motion.form variants={item} onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            {isSignUp && (
              <InputGroup>
                <InputLabel>Name</InputLabel>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </InputGroup>
            )}

            <InputGroup>
              <InputLabel>Email</InputLabel>
              <Input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <div className="flex items-center justify-between">
                <InputLabel>Password</InputLabel>
                {!isSignUp && (
                  <button type="button" className="text-xs text-[var(--color-accent)] hover:underline">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </InputGroup>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              loading={loading}
              rightIcon={<ArrowRight size={16} />}
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </motion.form>

          <motion.div variants={item} className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </motion.div>

          {!isSignUp && (
            <motion.div variants={item} className="mt-8 pt-8 border-t border-[var(--border-color)]">
              <Muted className="text-xs mb-3 text-center">Demo credentials</Muted>
              <button
                type="button"
                onClick={() => { setEmail(DEMO_USER_EMAIL); setPassword("demo1234"); }}
                className="w-full text-left p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:border-[var(--border-color-hover)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">{DEMO_USER_NAME}</span>
                <br />
                <Muted className="text-xs">{DEMO_USER_EMAIL} • Tap to autofill</Muted>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[var(--color-accent)]/5 via-transparent to-[var(--bg-secondary)] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08),transparent_50%)]" />
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/50 backdrop-blur-xl p-8 shadow-xl">
              <Sparkles size={24} className="text-[var(--color-accent)] mb-4" />
              <Heading level={3} className="mb-3">Your Financial Command Center</Heading>
              <Text className="text-[var(--text-secondary)] mb-6 text-sm leading-relaxed">
                Track investments, manage family budgets, get AI-powered insights, and achieve your financial goals — all in one place.
              </Text>
              <div className="space-y-3">
                {[
                  { label: "Smart Portfolio Tracking", desc: "Real-time P&L across all holdings" },
                  { label: "AI Market Insights", desc: "Data-driven investment recommendations" },
                  { label: "Family Collaboration", desc: "Shared budgets with household members" },
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                    <div>
                      <Text className="text-sm font-medium">{f.label}</Text>
                      <Muted className="text-xs">{f.desc}</Muted>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
