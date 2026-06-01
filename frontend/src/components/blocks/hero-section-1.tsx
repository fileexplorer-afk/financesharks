import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Menu, X, Sparkles, TrendingUp, Shield, BarChart3,
  Sun, Moon, Star, Users, Zap, Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { useTheme } from '@/hooks/useTheme'

const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
    visible: {
      opacity: 1, filter: 'blur(0px)', y: 0,
      transition: { type: 'spring' as const, bounce: 0.3, duration: 1.5 },
    },
  },
}

export default function LandingPage() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <HeroContent />
        <FeaturesSection />
        <StatsSection />
        <PricingSection />
        <CTASection />
        <FooterSection />
      </main>
    </>
  )
}

function HeroContent() {
  return (
    <section>
      <div className="relative pt-24 md:pt-36">
        {/* Background glow elements */}
        <div aria-hidden className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
          <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        <AnimatedGroup
          variants={{
            container: { visible: { transition: { delayChildren: 1 } } },
            item: {
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.3, duration: 2 } },
            },
          }}
          className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=3276&q=75"
            alt=""
            className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32"
            width="3276" height="4095"
          />
        </AnimatedGroup>

        <div aria-hidden className="absolute inset-0 -z-10 size-full" style={{ background: 'radial-gradient(125% 125% at 50% 100%, transparent 0%, var(--bg-primary) 75%)' }} />

        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
            <AnimatedGroup variants={transitionVariants}>
              <div className="group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300"
                style={{ borderColor: 'var(--glass-border)', background: 'var(--glass-bg)', backdropFilter: 'blur(var(--glass-blur))', boxShadow: 'var(--glass-shadow)' }}>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Introducing AI-Powered Financial Insights</span>
                <span className="block h-4 w-0.5" style={{ backgroundColor: 'var(--border-color)' }} />
                <div className="size-6 overflow-hidden rounded-full duration-500" style={{ background: 'var(--bg-primary)' }}>
                  <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                    <span className="flex size-6"><ArrowRight className="m-auto size-3" style={{ color: 'var(--color-accent)' }} /></span>
                    <span className="flex size-6"><ArrowRight className="m-auto size-3" style={{ color: 'var(--color-accent)' }} /></span>
                  </div>
                </div>
              </div>

              <h1 className="mt-6 sm:mt-8 max-w-4xl mx-auto text-balance text-4xl sm:text-5xl md:text-7xl lg:mt-16 xl:text-[5.25rem] leading-tight font-bold tracking-tight"
                style={{ color: 'var(--text-primary)' }}>
                Your Financial <span style={{ color: 'var(--color-accent)' }}>Command Center</span>
              </h1>
              <p className="mx-auto mt-4 sm:mt-8 max-w-2xl text-balance text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Track investments, manage family budgets, get AI-powered insights, and achieve your financial goals — all in one platform.
              </p>
            </AnimatedGroup>

            <AnimatedGroup
              variants={{
                container: { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } } },
                ...transitionVariants,
              }}
              className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
              <div className="rounded-[14px] p-0.5" style={{ border: '1px solid rgba(245, 158, 11, 0.2)', background: 'rgba(245, 158, 11, 0.08)' }}>
                <Link to="/login">
                  <Button variant="primary" size="lg" className="rounded-xl px-5 text-base">
                    <span className="text-nowrap">Start Free Trial</span>
                  </Button>
                </Link>
              </div>
              <Link to="#features">
                <Button size="lg" variant="ghost" className="h-10.5 rounded-xl px-5">
                  <span className="text-nowrap" style={{ color: 'var(--text-secondary)' }}>Learn More</span>
                </Button>
              </Link>
            </AnimatedGroup>
          </div>
        </div>

        {/* Dashboard Preview */}
        <AnimatedGroup
          variants={{
            container: { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } } },
            ...transitionVariants,
          }}>
          <div className="relative mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
            <div aria-hidden className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, transparent 35%, var(--bg-primary) 100%)' }} />
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-lg"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(var(--glass-blur))',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-shadow)',
              }}>
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden" style={{ background: 'var(--bg-primary)', aspectRatio: '16/10' }}>
                <img className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2700&q=75"
                  alt="FinanceSharks Dashboard"
                  width="2700" height="1440" />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(7,7,10,0.4) 100%)' }} />
              </div>
            </div>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: TrendingUp,
      title: "Smart Portfolio Tracking",
      desc: "Real-time P&L across all your holdings with interactive charts, performance metrics, and automated rebalancing suggestions.",
    },
    {
      icon: BarChart3,
      title: "AI Market Insights",
      desc: "Data-driven investment recommendations powered by machine learning algorithms that analyze market trends and your personal goals.",
    },
    {
      icon: Shield,
      title: "Family Collaboration",
      desc: "Shared budgets and financial goals with real-time sync across household members, permissions controls, and expense tracking.",
    },
    {
      icon: Users,
      title: "Multi-Account Support",
      desc: "Manage multiple investment accounts, bank connections, and credit cards from a single unified dashboard.",
    },
    {
      icon: Zap,
      title: "Automated Reports",
      desc: "Generate comprehensive financial reports, tax summaries, and performance analyses with one click.",
    },
    {
      icon: Star,
      title: "Goal Planning",
      desc: "Set and track financial goals with milestone tracking, progress visualization, and smart recommendations.",
    },
  ]

  return (
    <section id="features" className="pb-16 pt-24 md:pb-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Everything you need to <span style={{ color: 'var(--color-accent)' }}>win</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
            Powerful tools for modern financial management
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(var(--glass-blur))',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-shadow)',
              }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'var(--color-accent-gradient)', boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)' }}>
                <f.icon size={22} style={{ color: 'var(--bg-primary)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    { value: "$2.4B+", label: "Assets Tracked" },
    { value: "50K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.8/5", label: "User Rating" },
  ]

  return (
      <section className="pb-16 md:pb-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow)',
          }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: 'var(--color-accent)' }}>{s.value}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      desc: "Perfect for getting started",
      features: ["Up to 5 accounts", "Basic tracking", "Monthly reports", "Community support"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$12",
      period: "/month",
      desc: "For serious investors",
      features: ["Unlimited accounts", "AI insights", "Real-time sync", "Priority support", "Family sharing"],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$29",
      period: "/month",
      desc: "For teams & families",
      features: ["Everything in Pro", "Custom reports", "API access", "Dedicated manager", "SLA guarantee"],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="pb-16 md:pb-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Simple, transparent <span style={{ color: 'var(--color-accent)' }}>pricing</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>No hidden fees. Cancel anytime.</p>
        </div>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((p, i) => (
            <div key={i} className="relative">
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold z-20"
                  style={{ background: 'var(--color-accent-gradient)', color: 'var(--bg-primary)' }}>
                  Most Popular
                </div>
              )}
              <motion.div
                whileHover="hover"
                transition={{ duration: 1, ease: "backInOut" }}
                variants={{
                  hover: { scale: 1.04 },
                }}
                className="rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col overflow-hidden"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(var(--glass-blur))',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--glass-shadow)',
                }}
              >
                <BackgroundShapes />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{p.price}</span>
                    <span className="text-sm ml-1" style={{ color: 'var(--text-tertiary)' }}>{p.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <Check size={16} style={{ color: 'var(--color-accent)' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/login" className="relative z-10 mt-auto">
                  <Button variant={i === 0 ? 'ghost' : i === 1 ? 'gold' : 'primary'} size="lg" className="w-full rounded-xl">
                    {p.cta}
                  </Button>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BackgroundShapes() {
  return (
    <motion.svg
      width="320"
      height="420"
      viewBox="0 0 320 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 z-0 pointer-events-none"
      variants={{
        hover: { scale: 1.5 },
      }}
      transition={{ duration: 1, ease: "backInOut" }}
    >
      <motion.circle
        variants={{
          hover: { scaleY: 0.5, y: -25 },
        }}
        transition={{ duration: 1, ease: "backInOut", delay: 0.2 }}
        cx="160.5"
        cy="114.5"
        r="101.5"
        fill="rgba(245,158,11,0.06)"
      />
      <motion.ellipse
        variants={{
          hover: { scaleY: 2.25, y: -25 },
        }}
        transition={{ duration: 1, ease: "backInOut", delay: 0.2 }}
        cx="160.5"
        cy="320"
        rx="101.5"
        ry="43.5"
        fill="rgba(245,158,11,0.06)"
      />
    </motion.svg>
  )
}

function CTASection() {
  return (
    <section className="pb-16 md:pb-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <div className="rounded-xl sm:rounded-2xl p-6 sm:p-10 md:p-16"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow)',
          }}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            Ready to take control of your <span style={{ color: 'var(--color-accent)' }}>finances</span>?
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of users who trust FinanceSharks to manage their financial future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login">
              <Button variant="primary" size="lg" className="rounded-xl px-8 text-base">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="#features">
              <Button variant="ghost" size="lg" className="rounded-xl px-8 text-base">
                <span style={{ color: 'var(--text-secondary)' }}>See Features</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  const footerLinks = [
    { title: "Product", links: ["Features", "Pricing", "Integrations", "Changelog"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
    { title: "Support", links: ["Docs", "API Reference", "Community", "Status"] },
    { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
  ]

  return (
    <footer className="pb-8" style={{ borderTop: '1px solid var(--border-color)' }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-accent-gradient)' }}>
                <Sparkles size={16} style={{ color: 'var(--bg-primary)' }} />
              </div>
              <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Finance<span style={{ color: 'var(--color-accent)' }}>Sharks</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              Your all-in-one financial command center for tracking investments, managing budgets, and achieving goals.
            </p>
          </div>
          {footerLinks.map((group, i) => (
            <div key={i}>
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm duration-150 hover:opacity-80" style={{ color: 'var(--text-tertiary)' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 text-center text-xs" style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-color)' }}>
          &copy; {new Date().getFullYear()} FinanceSharks. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

const menuItems = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Contact', href: '#contact' },
]

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { theme, toggleTheme } = useTheme()

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header>
      <nav data-state={menuState && 'active'} className="fixed z-20 w-full px-2 group">
        <div className={[
          'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
          isScrolled ? 'max-w-4xl rounded-2xl lg:px-5' : '',
        ].filter(Boolean).join(' ')}
          style={isScrolled ? {
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow)',
          } : {}}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link to="/" aria-label="home" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--color-accent-gradient)', boxShadow: '0 0 16px rgba(245, 158, 11, 0.3)' }}>
                  <Sparkles size={16} style={{ color: 'var(--bg-primary)' }} />
                </div>
                <span className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Finance<span style={{ color: 'var(--color-accent)' }}>Sharks</span>
                </span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" style={{ color: 'var(--text-primary)' }} />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" style={{ color: 'var(--text-primary)' }} />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a href={item.href} className="block duration-150 hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden w-full lg:flex lg:w-fit lg:items-center lg:gap-4 group-data-[state=active]:flex group-data-[state=active]:flex-col group-data-[state=active]:gap-5 group-data-[state=active]:rounded-2xl group-data-[state=active]:border group-data-[state=active]:p-5"
              style={menuState ? {
                borderColor: 'var(--glass-border)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(var(--glass-blur))',
                boxShadow: 'var(--glass-shadow)',
              } : {}}>
              {/* Mobile nav links */}
              <div className="w-full lg:hidden">
                <ul className="space-y-4 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a href={item.href} onClick={() => setMenuState(false)} className="block duration-150 hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Actions row */}
              <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:w-auto lg:flex-row">
                <Link to="/login" className="lg:hidden" onClick={() => setMenuState(false)}>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setMenuState(false)}>
                  <Button size="sm" className="w-full sm:w-auto">
                    <span>Get Started</span>
                  </Button>
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg transition-colors duration-200 hover:opacity-80 self-center"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
