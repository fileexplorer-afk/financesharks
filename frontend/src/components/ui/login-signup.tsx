"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs-shadcn"
import {
  Eye,
  EyeOff,
  GitFork,
  Lock,
  Mail,
  ArrowRight,
  Globe,
  User,
  Sparkles,
} from "lucide-react"

interface LoginSignupProps {
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (name: string, email: string, password: string) => Promise<void>
  loading?: boolean
  error?: string
}

const inputCls =
  "flex h-10 w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"

const btnPrimaryCls =
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium h-10 px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full"

const btnOutlineCls =
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium h-10 px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border"

export default function LoginSignup({ onLogin, onRegister, loading, error }: LoginSignupProps) {
  const [tab, setTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const passwordChecks = [
    { label: "8+ characters", test: (p: string) => p.length >= 8 },
    { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "Number", test: (p: string) => /\d/.test(p) },
    { label: "Special character", test: (p: string) => /[\W_]/.test(p) },
  ]

  const passwordScore = password
    ? passwordChecks.filter(c => c.test(password)).length
    : 0

  const isPasswordValid = passwordScore === passwordChecks.length

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()

    type P = { x: number; y: number; v: number; o: number; c: string }
    let ps: P[] = []
    let raf = 0

    const getColor = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light'
      return isLight ? 'rgba(0,0,0,' : 'rgba(250,250,250,'
    }

    const make = () => {
      const base = getColor()
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        v: Math.random() * 0.25 + 0.05,
        o: Math.random() * 0.35 + 0.15,
        c: base,
      }
    }

    const init = () => {
      ps = []
      const count = Math.floor((canvas.width * canvas.height) / 9000)
      for (let i = 0; i < count; i++) ps.push(make())
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ps.forEach((p) => {
        p.y -= p.v
        if (p.y < 0) {
          p.x = Math.random() * canvas.width
          p.y = canvas.height + Math.random() * 40
          p.v = Math.random() * 0.25 + 0.05
          p.o = Math.random() * 0.35 + 0.15
          p.c = getColor()
        }
        ctx.fillStyle = `${p.c}${p.o})`
        ctx.fillRect(p.x, p.y, 0.7, 2.2)
      })
      raf = requestAnimationFrame(draw)
    }

    const onResize = () => {
      setSize()
      init()
    }

    window.addEventListener("resize", onResize)
    init()
    raf = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(email, password)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    onRegister(name, email, password)
  }

  return (
    <div className="fixed inset-0" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <style>{`
        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.7}
        .hline,.vline{position:absolute;will-change:transform,opacity}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .8s cubic-bezier(.22,.61,.36,1) forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .9s cubic-bezier(.22,.61,.36,1) forwards}
        .hline:nth-child(1){top:18%;animation-delay:.12s}
        .hline:nth-child(2){top:50%;animation-delay:.22s}
        .hline:nth-child(3){top:82%;animation-delay:.32s}
        .vline:nth-child(4){left:22%;animation-delay:.42s}
        .vline:nth-child(5){left:50%;animation-delay:.54s}
        .vline:nth-child(6){left:78%;animation-delay:.66s}
        .hline::after,.vline::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(245,158,11,.24),transparent);opacity:0;animation:shimmer .9s ease-out forwards}
        .hline:nth-child(1)::after{animation-delay:.12s}
        .hline:nth-child(2)::after{animation-delay:.22s}
        .hline:nth-child(3)::after{animation-delay:.32s}
        .vline:nth-child(4)::after{animation-delay:.42s}
        .vline:nth-child(5)::after{animation-delay:.54s}
        .vline:nth-child(6)::after{animation-delay:.66s}
        @keyframes drawX{0%{transform:scaleX(0);opacity:0}60%{opacity:.95}100%{transform:scaleX(1);opacity:.7}}
        @keyframes drawY{0%{transform:scaleY(0);opacity:0}60%{opacity:.95}100%{transform:scaleY(1);opacity:.7}}
        @keyframes shimmer{0%{opacity:0}35%{opacity:.25}100%{opacity:0}}

        .card-animate {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s cubic-bezier(.22,.61,.36,1) 0.4s forwards;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .login-input {
          border-color: var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }
        .login-input::placeholder {
          color: var(--text-tertiary);
        }
        .login-input:focus-visible {
          border-color: var(--color-accent);
          --tw-ring-color: var(--color-accent);
        }

        .btn-login-primary {
          background: var(--color-accent-gradient);
          color: var(--bg-primary);
          font-weight: 600;
          border: none;
        }
        .btn-login-primary:hover:not(:disabled) {
          opacity: 0.9;
        }
        .btn-login-primary:disabled {
          opacity: 0.5;
        }

        .btn-login-outline {
          border-color: var(--border-color);
          background: transparent;
          color: var(--text-secondary);
        }
        .btn-login-outline:hover {
          background: var(--bg-tertiary);
          border-color: var(--border-color-hover);
          color: var(--text-primary);
        }

        .tab-trigger-custom {
          color: var(--text-tertiary);
        }
        .tab-trigger-custom[data-state="active"] {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(80% 60% at 50% 30%, rgba(245,158,11,0.06), transparent 60%)' }} />

      <div className="accent-lines">
        <div className="hline" style={{ background: 'var(--border-color)' }} />
        <div className="hline" style={{ background: 'var(--border-color)' }} />
        <div className="hline" style={{ background: 'var(--border-color)' }} />
        <div className="vline" style={{ background: 'var(--border-color)' }} />
        <div className="vline" style={{ background: 'var(--border-color)' }} />
        <div className="vline" style={{ background: 'var(--border-color)' }} />
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen pointer-events-none"
      />

      <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 sm:px-6 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <span className="flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.14em] uppercase" style={{ color: 'var(--text-tertiary)' }}>
          <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
          FinanceSharks
        </span>
        <button className="btn-login-outline inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium h-9 px-3 sm:px-4 py-2 transition-colors gap-1.5">
          <span>Contact</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </header>

      <div className="h-full w-full grid place-items-center px-4">
        <div className="card-animate w-full max-w-sm rounded-xl shadow-sm"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow)',
          }}>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <div className="flex flex-col p-4 sm:p-6 pb-0">
              <TabsList className="grid w-full grid-cols-2 mb-5 rounded-lg p-1"
                style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                <TabsTrigger
                  value="login"
                  className="tab-trigger-custom rounded-md px-4 py-1.5 text-sm transition-colors"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="tab-trigger-custom rounded-md px-4 py-1.5 text-sm transition-colors"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="login" className="mt-0">
              <div className="px-4 sm:px-6 pb-2">
                <h3 className="text-xl sm:text-2xl font-semibold leading-none tracking-tight" style={{ color: 'var(--text-primary)' }}>Welcome back</h3>
                <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>Sign in to your account</p>
              </div>
              <div className="grid gap-4 sm:gap-5 p-4 sm:p-6 pt-4 sm:pt-5">
                {error && (
                  <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--color-danger)' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="grid gap-4 sm:gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="email" style={{ color: 'var(--text-primary)' }}>
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={`${inputCls} pl-10 login-input`}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password" style={{ color: 'var(--text-primary)' }}>
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`${inputCls} pl-10 pr-10 login-input`}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md"
                        style={{ color: 'var(--text-tertiary)' }}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        className="data-[state=checked]:text-zinc-900"
                        style={{ borderColor: 'var(--border-color)' }}
                      />
                      <Label htmlFor="remember" className="text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
                        Remember me
                      </Label>
                    </div>
                    <a href="#" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`${btnPrimaryCls} btn-login-primary`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Loading...
                      </span>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </form>

                <div className="relative">
                  <Separator style={{ backgroundColor: 'var(--border-color)' }} />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-3 px-2 text-[11px] uppercase tracking-widest"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-tertiary)',
                    }}>
                    or
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className={`${btnOutlineCls} btn-login-outline`}>
                    <GitFork className="h-4 w-4 mr-2" />
                    GitHub
                  </button>
                  <button className={`${btnOutlineCls} btn-login-outline`}>
                    <Globe className="h-4 w-4 mr-2" />
                    Google
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center pb-4 sm:pb-6 text-sm px-4 sm:px-6" style={{ color: 'var(--text-secondary)' }}>
                Don&apos;t have an account?&nbsp;
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className="bg-transparent border-none p-0 cursor-pointer text-sm"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Create one
                </button>
              </div>
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <div className="px-4 sm:px-6 pb-2">
                <h3 className="text-xl sm:text-2xl font-semibold leading-none tracking-tight" style={{ color: 'var(--text-primary)' }}>Create an account</h3>
                <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>Join us in a few seconds</p>
              </div>
              <div className="grid gap-4 sm:gap-5 p-4 sm:p-6 pt-4 sm:pt-5">
                {error && (
                  <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--color-danger)' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegister} className="grid gap-4 sm:gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="name" style={{ color: 'var(--text-primary)' }}>
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                      <input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={`${inputCls} pl-10 login-input`}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="reg-email" style={{ color: 'var(--text-primary)' }}>
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                      <input
                        id="reg-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={`${inputCls} pl-10 login-input`}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="reg-password" style={{ color: 'var(--text-primary)' }}>
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                      <input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className={`${inputCls} pl-10 pr-10 login-input`}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md"
                        style={{ color: 'var(--text-tertiary)' }}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {password && (
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="h-1 flex-1 rounded-full transition-colors"
                              style={{
                                backgroundColor: i <= passwordScore
                                  ? passwordScore <= 2
                                    ? 'var(--color-danger)'
                                    : passwordScore <= 3
                                      ? 'var(--color-warning, #f59e0b)'
                                      : 'var(--color-success, #22c55e)'
                                  : 'var(--border-color)',
                              }}
                            />
                          ))}
                        </div>
                        <ul className="text-xs space-y-0.5" style={{ color: 'var(--text-tertiary)' }}>
                          {passwordChecks.map((check) => {
                            const passed = check.test(password);
                            return (
                              <li key={check.label} style={{ color: passed ? 'var(--color-success, #22c55e)' : undefined }}>
                                {passed ? '✓' : '○'} {check.label}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      className="mt-0.5"
                      style={{ borderColor: 'var(--border-color)' }}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
                      I agree to the Terms & Privacy
                    </Label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !isPasswordValid}
                    className={`${btnPrimaryCls} btn-login-primary`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Loading...
                      </span>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </form>

                <div className="relative">
                  <Separator style={{ backgroundColor: 'var(--border-color)' }} />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-3 px-2 text-[11px] uppercase tracking-widest"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-tertiary)',
                    }}>
                    or
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className={`${btnOutlineCls} btn-login-outline`}>
                    <GitFork className="h-4 w-4 mr-2" />
                    GitHub
                  </button>
                  <button className={`${btnOutlineCls} btn-login-outline`}>
                    <Globe className="h-4 w-4 mr-2" />
                    Google
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center pb-4 sm:pb-6 text-sm px-4 sm:px-6" style={{ color: 'var(--text-secondary)' }}>
                Already have an account?&nbsp;
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="bg-transparent border-none p-0 cursor-pointer text-sm"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Log in
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
