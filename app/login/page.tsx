"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/brand/Logo";
import {
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  MapPin,
  Check,
} from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const {
    profile,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    loginAsDemo,
    isFirebaseConfigured,
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);

  // If already logged in, redirect to dashboard or admin
  useEffect(() => {
    if (profile) {
      if (profile.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [profile, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    const res = await signInWithGoogle();
    setLoading(false);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (mode === "signin") {
      const res = await signInWithEmail(email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || "Failed to sign in. Please check your credentials.");
      }
    } else {
      if (!name.trim()) {
        setErrorMsg("Please enter your full name.");
        setLoading(false);
        return;
      }
      const res = await signUpWithEmail(name, email, password, "student");
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || "Failed to register account.");
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* ======================================================== */}
      {/* LEFT SIDE: EDITORIAL LIFESTYLE FOOD COVERAGE             */}
      {/* ======================================================== */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col justify-between p-12 xl:p-16 overflow-hidden bg-brand-primary text-white">
        <Image
          src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1800&q=85"
          alt="Homestyle Indian Thali"
          fill
          priority
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/65 to-transparent" />

        {/* Top: Logo & Pilot Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <Logo variant="inverted" size="md" showTagline />
          <span className="text-[11px] font-bold text-brand-accent bg-white/10 px-3 py-1 rounded-full border border-white/20">
            DBS Campus Pilot
          </span>
        </div>

        {/* Center / Bottom: Editorial Quote */}
        <div className="relative z-10 max-w-lg space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-brand-accent">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>Entrepreneurship & Innovation • DBS Global University</span>
          </div>

          <h2 className="font-serif text-4xl xl:text-5xl font-bold leading-tight text-white">
            "A little taste of home."
          </h2>

          <p className="text-sm xl:text-base text-white/80 leading-relaxed">
            Nutritious, authentic home-cooked meals prepared with maternal care by local Dehradun kitchens.
            Zero surge prices, flexible skip-a-meal, and direct student convenience.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-3 text-xs text-emerald-100">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-accent shrink-0" />
              <span>Target ~₹93/meal budget</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-accent shrink-0" />
              <span>WhatsApp order dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-accent shrink-0" />
              <span>Manduwala & Kandoli PG hub</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-accent shrink-0" />
              <span>Skip anytime with credit roll</span>
            </div>
          </div>
        </div>

        {/* Bottom tag */}
        <div className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} MessMate Inc. DGU Venture Quest.
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT SIDE: AUTHENTICATION FORM                          */}
      {/* ======================================================== */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
        {/* Top: Mobile Logo & Firebase Help Guide */}
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <Logo variant="dark" size="sm" />
          </div>
          <button
            onClick={() => setShowFirebaseModal(true)}
            className="text-xs text-brand-primary font-semibold hover:underline flex items-center gap-1.5 ml-auto"
          >
            <HelpCircle className="w-3.5 h-3.5 text-brand-accent" />
            <span>Firebase Config Guide</span>
          </button>
        </div>

        {/* Center: Auth Card */}
        <div className="max-w-md w-full mx-auto my-auto py-8 space-y-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-accent">
              Student Access
            </span>
            <h1 className="font-serif text-3xl font-bold text-brand-dark">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted">
              {mode === "signin"
                ? "Sign in to manage your meal plan, skips, and orders."
                : "Join fellow DBS students enjoying fresh homestyle food daily."}
            </p>
          </div>

          {/* Official Google OAuth Sign In Button */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-brand-border bg-white hover:bg-brand-cream/60 text-brand-dark text-sm font-bold shadow-xs hover:shadow transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {!isFirebaseConfigured && (
              <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-1.5 mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Notice: Firebase env keys not set; Google button launches instant preview mode.</span>
              </p>
            )}
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-brand-border w-full" />
            <span className="bg-white px-3 text-xs text-brand-muted uppercase font-bold tracking-wider">
              Or with email
            </span>
            <div className="border-t border-brand-border w-full" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 rounded-2xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                College Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@dbs.edu.in"
                  className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 rounded-2xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-brand-dark">
                  Password
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => alert("Password reset instructions will be sent to your registered email.")}
                    className="text-[11px] font-semibold text-brand-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 rounded-2xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>
                {loading
                  ? "Processing..."
                  : mode === "signin"
                  ? "Sign In"
                  : "Create Student Account"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="text-center text-xs text-brand-muted pt-2">
            {mode === "signin" ? (
              <span>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMsg(null);
                  }}
                  className="font-bold text-brand-primary hover:underline"
                >
                  Create account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMsg(null);
                  }}
                  className="font-bold text-brand-primary hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>

          {/* Instant Evaluation Demo Login Pills */}
          <div className="pt-4 border-t border-brand-border/60 space-y-2">
            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block text-center">
              Faculty & Evaluation Fast-Track
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemo("student")}
                className="py-2.5 px-3 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>Demo Student</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo("admin")}
                className="py-2.5 px-3 text-xs font-bold rounded-xl bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom link */}
        <div className="text-center text-xs text-brand-muted">
          <Link href="/" className="hover:text-brand-dark transition-colors">
            ← Return to MessMate Homepage
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FIREBASE SETUP INSTRUCTIONS MODAL                        */}
      {/* ======================================================== */}
      {showFirebaseModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative border border-brand-border">
            <button
              onClick={() => setShowFirebaseModal(false)}
              className="absolute top-5 right-5 text-brand-muted hover:text-brand-dark p-2"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                Firebase Integration Guide
              </span>
              <h3 className="font-serif text-2xl font-bold text-brand-primary">
                How to Connect Real Firebase
              </h3>
            </div>

            <div className="text-xs text-brand-dark space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-3 bg-brand-cream rounded-xl space-y-1">
                <strong>Step 1: Create a Firebase Project</strong>
                <p className="text-brand-muted">
                  Go to <a href="https://console.firebase.google.com" target="_blank" className="text-brand-primary underline">console.firebase.google.com</a> and click "Add Project" named <code>messmate-dgu</code>.
                </p>
              </div>

              <div className="p-3 bg-brand-cream rounded-xl space-y-1">
                <strong>Step 2: Register a Web App</strong>
                <p className="text-brand-muted">
                  Click the Web (&lt;/&gt;) icon, name it "MessMate Web", and copy the web credentials into your <code>.env.local</code> file.
                </p>
              </div>

              <div className="p-3 bg-brand-cream rounded-xl space-y-1">
                <strong>Step 3: Enable Google Sign-In & Email/Password</strong>
                <p className="text-brand-muted">
                  Under Authentication &gt; Sign-in method, enable Google and Email/Password. Add your support email.
                </p>
              </div>

              <div className="p-3 bg-brand-cream rounded-xl space-y-1">
                <strong>Step 4: Configure Authorized Domains</strong>
                <p className="text-brand-muted">
                  Under Authentication &gt; Settings &gt; Authorized domains, verify <code>localhost</code> is present.
                </p>
              </div>

              <div className="p-3 bg-brand-cream rounded-xl space-y-1">
                <strong>Step 5: Cloud Firestore Rules</strong>
                <p className="text-brand-muted">
                  Deploy the generated <code>firestore.rules</code> file from this workspace to protect student profiles and role authorizations.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFirebaseModal(false)}
              className="w-full py-3 bg-brand-primary text-white font-semibold rounded-xl text-xs"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-cream">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-brand-dark">Loading MessMate Authentication...</p>
          </div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
