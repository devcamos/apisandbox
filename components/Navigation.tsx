"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/components/providers/SessionProvider";
import { Menu, X, LogOut, User, ChevronDown, BookOpen, Cloud, Brain, Compass, Settings, CreditCard, Sparkles, Lock, Shield, Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { PageSearch } from "./PageSearch";
import { ManageSubscriptionButton } from "@/components/premium/ManageSubscriptionButton";

function mobileExploreBadgeClass(badge: string | undefined) {
  if (badge === "Free") return "bg-green-500/20 text-green-400";
  if (badge === "Docs") return "bg-slate-500/30 text-slate-300";
  return "bg-purple-500/20 text-purple-400";
}

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [subscription, setSubscription] = useState<{ tier: "FREE" | "PREMIUM"; isExpired: boolean } | null>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // MENTOR NOTE: Conditional Navigation
  // Show different nav items based on authentication status
  const publicNavItems = [
    { name: "Home", href: "/" },
  ];

  const protectedNavItems = [{ name: "Dashboard", href: "/dashboard" }];

  const navItems = session ? protectedNavItems : [...publicNavItems, { name: "Upgrade", href: "/upgrade" }];

  // Fetch subscription status
  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/subscription/status")
        .then(res => res.json())
        .then(data => setSubscription(data))
        .catch(() => setSubscription({ tier: "FREE", isExpired: false }));
    }
  }, [session]);

  useEffect(() => {
    setIsOpen(false);
    setExploreOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Close explore dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setExploreOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    if (exploreOpen || profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [exploreOpen, profileOpen]);

  // Explore menu sections
  // Phase 5–6 are a separate group so they stay visible between core phases and advanced topics
  // (and so the menu stays obvious after deploy — older builds only listed 0–4 under "Phases").
  const exploreSections = [
    {
      title: "Phases",
      icon: BookOpen,
      items: [
        { name: "Phase 0: Getting Started", href: "/phase-0", badge: "Free" },
        { name: "Phase 1: Integration Mindset", href: "/phase-1", badge: "Free" },
        { name: "Phase 2: Third-Party Integrations", href: "/phase-2", badge: "Premium" },
        { name: "Phase 3: Inter-Service Communication", href: "/phase-3", badge: "Premium" },
        { name: "Phase 4: Principal-Level Architecture", href: "/phase-4", badge: "Premium" },
      ],
    },
    {
      title: "Algorithms & Practice",
      icon: Sparkles,
      items: [
        { name: "Phase 5: API Algorithms", href: "/phase-5", badge: "Premium" },
        { name: "Phase 6: Algorithm Visualizer", href: "/phase-6", badge: "Premium" },
        { name: "Phase 7: Monetisation", href: "/phase-7", badge: "Premium" },
        { name: "Phase 8: Data Science", href: "/phase-8", badge: "Premium" },
        { name: "Phase 9: Database Fundamentals", href: "/phase-9", badge: "Premium" },
      ],
    },
    {
      title: "Advanced Topics",
      icon: Compass,
      items: [
        { name: "Cloud Migration", href: "/cloud", badge: "Premium" },
        { name: "AI Learning", href: "/ai", badge: "Premium" },
        { name: "Java Track", href: "/docs/java", badge: "Docs" },
      ],
    },
  ];

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-white text-lg sm:text-xl">API Sandbox</span>
              <span className="hidden sm:block text-[10px] uppercase tracking-wider text-gray-500">Learn · Build · Ship</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {session && (
              <div className="relative" ref={exploreRef}>
                <button
                  onClick={() => setExploreOpen(!exploreOpen)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                    pathname.startsWith("/phase") || pathname.startsWith("/cloud") || pathname.startsWith("/ai")
                      ? "bg-blue-500/10 text-blue-400 font-semibold"
                      : "text-gray-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  Explore
                  <ChevronDown className={`w-4 h-4 transition-transform ${exploreOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Explore Dropdown */}
                {exploreOpen && (
                  <div className="absolute top-full left-0 mt-2 w-96 max-h-[min(90vh,40rem)] overflow-y-auto bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
                    <div className="p-4">
                      {exploreSections.map((section, idx) => {
                        const SectionIcon = section.icon;
                        return (
                          <div key={section.title} className={idx > 0 ? "mt-6 pt-6 border-t border-slate-700" : ""}>
                            <div className="flex items-center gap-2 mb-3">
                              <SectionIcon className="w-4 h-4 text-blue-400" />
                              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                                {section.title}
                              </h3>
                            </div>
                            <div className="space-y-1">
                              {section.items.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setExploreOpen(false)}
                                  className={`block px-3 py-2 rounded-lg transition-all group ${
                                    pathname === item.href
                                      ? "bg-blue-500/10 text-blue-400"
                                      : "text-gray-300 hover:text-white hover:bg-slate-700"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">{item.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${mobileExploreBadgeClass(item.badge)}`}>
                                      {item.badge}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-slate-700 p-4 bg-slate-900/50">
                      <Link
                        href="/dashboard"
                        onClick={() => setExploreOpen(false)}
                        className="block text-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
                      >
                        View All in Dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Link
              href="/story"
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                pathname === "/story"
                  ? "bg-amber-500/10 text-amber-300 font-semibold"
                  : "text-amber-300/70 hover:text-amber-200 hover:bg-amber-500/10"
              }`}
            >
              <Heart className="w-4 h-4" />
              Story
            </Link>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-all ${
                  pathname === item.href
                    ? "bg-blue-500/10 text-blue-400 font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Search */}
            {session && (
              <div className="mx-4">
                <PageSearch />
              </div>
            )}

            {/* Auth Buttons */}
            {status === "loading" ? (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-700">
                <div className="w-20 h-8 rounded-lg bg-slate-800 animate-pulse" />
                <div className="w-20 h-8 rounded-lg bg-slate-800 animate-pulse" />
              </div>
            ) : session ? (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-700">
                {/* User Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                        {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium hidden lg:block">
                        {session.user?.name || session.user?.email}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                      {/* Profile Header */}
                      <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                            {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">
                              {session.user?.name || "User"}
                            </p>
                            <p className="text-gray-400 text-sm truncate">
                              {session.user?.email}
                            </p>
                          </div>
                        </div>
                        {/* Subscription Badge */}
                        {subscription && (
                          <div className="flex items-center gap-2">
                            {subscription.tier === "PREMIUM" ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
                                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                <span className="text-purple-300 text-xs font-semibold">Premium Member</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-700/50 border border-slate-600 rounded-lg">
                                <Lock className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-gray-400 text-xs font-semibold">Free Plan</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Profile Menu Items */}
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700 transition-all"
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm">Dashboard</span>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700 transition-all"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">Settings</span>
                        </Link>
                        {subscription?.tier === "PREMIUM" ? (
                          <ManageSubscriptionButton
                            onNavigate={() => setProfileOpen(false)}
                          />
                        ) : (
                          <Link
                            href="/upgrade"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700 transition-all"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span className="text-sm">Upgrade to Premium</span>
                          </Link>
                        )}
                        <div className="border-t border-slate-700 my-2"></div>
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-700">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div id="mobile-navigation-menu" className="md:hidden py-4 space-y-2">
            <div className="px-4 py-2">
              <Link
                href="/story"
                onClick={() => setIsOpen(false)}
                className="block mb-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-200 flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Before You Begin
              </Link>
              {session && (
                <>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <BookOpen className="w-3 h-3" />
                    Explore
                  </div>
                  <div className="space-y-4 ml-2">
                    {exploreSections.map((section) => {
                      const SectionIcon = section.icon;
                      return (
                        <div key={section.title}>
                          <div className="flex items-center gap-2 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                            <SectionIcon className="w-3 h-3 text-blue-400 shrink-0" />
                            {section.title}
                          </div>
                          <div className="space-y-1 border-l border-slate-700 pl-3">
                            {section.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-lg transition-all ${
                                  pathname === item.href
                                    ? "bg-blue-500/10 text-blue-400 font-semibold"
                                    : "text-gray-300 hover:text-white hover:bg-slate-800"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm">{item.name}</span>
                                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded ${mobileExploreBadgeClass(item.badge)}`}>
                                    {item.badge}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Search */}
            {session && (
              <div className="px-4 py-4 border-t border-slate-700">
                <PageSearch />
              </div>
            )}

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  pathname === item.href
                    ? "bg-blue-500/10 text-blue-400 font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            {status === "loading" ? (
              <div className="px-4 py-2 space-y-2">
                <div className="h-10 rounded-lg bg-slate-800 animate-pulse" />
                <div className="h-10 rounded-lg bg-slate-800 animate-pulse" />
              </div>
            ) : session ? (
              <div className="px-4 py-2 space-y-2 border-t border-slate-700 mt-4 pt-4">
                {/* Mobile Profile Section */}
                <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                      {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  {subscription && (
                    <div className="flex items-center gap-2">
                      {subscription.tier === "PREMIUM" ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded text-xs">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span className="text-purple-300 font-semibold">Premium</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-700/50 border border-slate-600 rounded text-xs">
                          <Lock className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-400 font-semibold">Free</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-all text-center"
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                {subscription?.tier === "PREMIUM" ? (
                  <div className="px-4">
                    <ManageSubscriptionButton
                      onNavigate={() => setIsOpen(false)}
                      className="w-full justify-center px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800"
                    />
                  </div>
                ) : (
                  <Link
                    href="/upgrade"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-all text-center"
                  >
                    Upgrade to Premium
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false)
                    signOut({ callbackUrl: "/" })
                  }}
                  className="w-full px-4 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-4 py-2 space-y-2 border-t border-slate-700 mt-4 pt-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-all text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
