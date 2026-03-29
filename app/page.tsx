import Link from "next/link";
import { Home as HomeIcon, Sprout, TrendingUp, BarChart3, Shield, Zap, ArrowRight, DollarSign } from "lucide-react";

const features = [
  {
    icon: HomeIcon,
    title: "Real Estate Portfolio",
    description: "Track properties, manage tenants, monitor occupancy rates, and visualize rental revenue all in one place.",
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900/50",
  },
  {
    icon: Sprout,
    title: "Agriculture Management",
    description: "Manage farmland, track crop yields, monitor seasonal profits, and measure the performance of each plot.",
    color: "green",
    gradient: "from-green-500 to-emerald-600",
    bg: "bg-green-50 dark:bg-green-950/30",
    iconBg: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
    border: "border-green-100 dark:border-green-900/50",
  },
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    description: "Beautiful charts and reports that give you instant clarity on revenue streams, asset distribution, and growth trends.",
    color: "purple",
    gradient: "from-purple-500 to-violet-600",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    iconBg: "bg-purple-100 dark:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-900/50",
  },
  {
    icon: TrendingUp,
    title: "Revenue Tracking",
    description: "Stay on top of monthly income, annual returns, and asset appreciation with real-time financial metrics.",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900/50",
  },
];

const stats = [
  { label: "Asset Classes", value: "2+", icon: DollarSign },
  { label: "Portfolio Insights", value: "Real-time", icon: TrendingUp },
  { label: "Data Security", value: "Enterprise", icon: Shield },
  { label: "Setup Time", value: "< 5 min", icon: Zap },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 dark:border-gray-900 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">PropFusion</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-32 right-1/4 w-56 h-56 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 left-1/2 w-48 h-48 bg-green-400/15 dark:bg-green-500/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Smart Asset Management Platform
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Manage your{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
              entire portfolio
            </span>
            <br />
            in one place
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            PropFusion brings together real estate and agriculture assets into a
            single, powerful dashboard — with analytics that help you make
            smarter investment decisions.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
            <Link
              href="/auth/sign-up"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-base rounded-2xl hover:bg-gray-700 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.99]"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-2 px-8 py-4 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-base rounded-2xl hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-950 transition-all"
            >
              Sign in to your account
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-2xl"
              >
                <stat.icon className="w-4 h-4 text-gray-400 dark:text-gray-600 mb-1" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                <span className="text-xs text-gray-500 dark:text-gray-500 text-center">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-gray-50 dark:bg-gray-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                grow your wealth
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Purpose-built tools for multi-asset investors who want real clarity over their portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group p-8 rounded-3xl border ${feature.border} ${feature.bg} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-white p-12 text-center">
            {/* Decorative blobs inside banner */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white dark:text-gray-900 mb-4">
                Ready to take control?
              </h2>
              <p className="text-gray-400 dark:text-gray-600 text-lg mb-8 max-w-lg mx-auto">
                Join investors who use PropFusion to track, analyze, and grow their real estate and agriculture portfolios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/sign-up"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold text-base rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.99]"
                >
                  Create free account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 dark:border-gray-900/20 text-white dark:text-gray-900 font-semibold text-base rounded-2xl hover:bg-white/10 dark:hover:bg-gray-900/10 transition-all"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-900 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">PropFusion</span>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            © {new Date().getFullYear()} PropFusion. Smart investing, simplified.
          </p>
          <div className="flex gap-6">
            <Link href="/auth/sign-in" className="text-sm text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Sign In
            </Link>
            <Link href="/auth/sign-up" className="text-sm text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
