"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/brand/Logo";
import {
  Menu,
  X,
  ArrowRight,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, signOutUser } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore Meals", href: "/meals" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Weekly Menu", href: "/#weekly-menu" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Kitchen Partner", href: "/kitchen-partner" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      {/* Top Campus Pilot Live Status Bar */}
      <div className="bg-brand-primary text-white text-[11px] font-medium py-1.5 px-4 text-center border-b border-brand-secondary/40 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="hidden sm:flex items-center gap-2 text-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>DBS Campus Pilot • Manduwala & Kandoli PG Hubs</span>
          </div>

          <div className="flex-1 text-center flex items-center justify-center gap-1.5">
            <span className="font-semibold text-brand-accent">Today's Schedule:</span>
            <span>Lunch drops 12:30 PM • Dinner drops 8:00 PM</span>
            <span className="hidden md:inline text-white/50">•</span>
            <span className="hidden md:inline text-white/80">Cutoff: Lunch 9:00 AM | Dinner 4:00 PM</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-brand-accent hover:underline">
            <Link href="/meals" className="flex items-center gap-1">
              <span>Today's Thalis</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-card border-b border-brand-border/80 py-3"
            : "bg-white/70 backdrop-blur-sm border-b border-brand-border/40 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div className="shrink-0">
              <Logo variant="dark" size="md" showTagline />
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-brand-cream/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-brand-border/80 shadow-xs">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? "text-brand-primary bg-white shadow-xs font-bold"
                        : "text-brand-dark/75 hover:text-brand-primary hover:bg-white/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {profile ? (
                <div className="flex items-center gap-2.5">
                  <Link
                    href={profile.role === "admin" ? "/admin" : "/dashboard"}
                    className="flex items-center gap-2 text-xs font-bold text-brand-primary bg-emerald-50 hover:bg-emerald-100/90 px-4 py-2 rounded-full border border-emerald-200/90 transition-all duration-200 shadow-xs active:scale-95"
                  >
                    {profile.role === "admin" ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Admin Hub</span>
                      </>
                    ) : (
                      <>
                        <LayoutDashboard className="w-3.5 h-3.5 text-brand-primary" />
                        <span>Student Dashboard</span>
                      </>
                    )}
                  </Link>

                  <button
                    onClick={() => signOutUser()}
                    title="Sign out"
                    className="p-2 text-brand-muted hover:text-brand-dark hover:bg-black/5 rounded-full transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-xs font-bold text-brand-dark hover:text-brand-primary px-3.5 py-2 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login?mode=signup"
                    className="btn-primary inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-full"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              {profile && (
                <Link
                  href={profile.role === "admin" ? "/admin" : "/dashboard"}
                  className="p-2 text-brand-primary bg-emerald-50 rounded-full border border-emerald-200"
                >
                  <UserIcon className="w-4 h-4" />
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-brand-dark hover:bg-brand-cream border border-brand-border transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-brand-border px-4 pt-3 pb-6 shadow-2xl animate-in fade-in slide-in-from-top-2">
            {/* Campus selector pill */}
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-primary bg-emerald-50/80 px-3 py-2.5 rounded-xl mb-3 border border-emerald-200/60">
              <MapPin className="w-4 h-4 shrink-0 text-brand-accent" />
              <span>Serving DBS Campus & nearby PG clusters, Dehradun</span>
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                    pathname === link.href
                      ? "text-brand-primary bg-emerald-50 font-bold"
                      : "text-brand-dark hover:bg-brand-cream"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-brand-border space-y-2">
              {profile ? (
                <>
                  <Link
                    href={profile.role === "admin" ? "/admin" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold text-center"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Go to {profile.role === "admin" ? "Admin Hub" : "Student Dashboard"}</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOutUser();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-brand-muted hover:text-red-600 font-semibold text-xs"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-secondary py-2.5 text-center text-xs font-bold rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login?mode=signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary py-2.5 text-center text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
