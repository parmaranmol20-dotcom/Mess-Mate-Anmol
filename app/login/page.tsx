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
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Settings,
  RefreshCw,
  Globe,
  KeyRound,
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
    firebaseConfigSource,
    envCredentialsStatus,
    configureCustomFirebase,
    resetFirebaseConfig,
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"instant" | "vercel" | "guide">("instant");

  // Custom config form state
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [authDomainInput, setAuthDomainInput] = useState("");
  const [projectIdInput, setProjectIdInput] = useState("");
  const [storageBucketInput, setStorageBucketInput] = useState("");
  const [messagingSenderIdInput, setMessagingSenderIdInput] = useState("");
  const [appIdInput, setAppIdInput] = useState("");
  const [rawSnippetInput, setRawSnippetInput] = useState("");
  const [configSuccessMsg, setConfigSuccessMsg] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [currentHostname, setCurrentHostname] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHostname(window.location.hostname);
    }
  }, []);

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

    if (!isFirebaseConfigured) {
      setLoading(false);
      setShowConfigModal(true);
      setErrorMsg("Firebase is not configured yet. Paste your Firebase keys below or configure Vercel to enable real Google OAuth.");
      return;
    }

    const res = await signInWithGoogle();
    setLoading(false);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
      if (res.error.includes("FIREBASE_NOT_CONFIGURED") || res.error.includes("Domain unauthorized")) {
        setShowConfigModal(true);
      }
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

  // Auto-parse raw snippet if user pastes `const firebaseConfig = { ... }`
  const handleSnippetPaste = (val: string) => {
    setRawSnippetInput(val);
    try {
      const extract = (key: string) => {
        const regex = new RegExp(`['"]?${key}['"]?\\s*:\\s*['"]([^'"]+)['"]`, "i");
        const match = val.match(regex);
        return match ? match[1].trim() : "";
      };

      const extractedApiKey = extract("apiKey");
      const extractedAuthDomain = extract("authDomain");
      const extractedProjectId = extract("projectId");
      const extractedStorageBucket = extract("storageBucket");
      const extractedSenderId = extract("messagingSenderId");
      const extractedAppId = extract("appId");

      if (extractedApiKey) setApiKeyInput(extractedApiKey);
      if (extractedAuthDomain) setAuthDomainInput(extractedAuthDomain);
      if (extractedProjectId) setProjectIdInput(extractedProjectId);
      if (extractedStorageBucket) setStorageBucketInput(extractedStorageBucket);
      if (extractedSenderId) setMessagingSenderIdInput(extractedSenderId);
      if (extractedAppId) setAppIdInput(extractedAppId);

      if (extractedApiKey && extractedProjectId) {
        setConfigSuccessMsg("Configuration snippet parsed successfully! Click 'Save & Connect' below.");
      }
    } catch {
      // ignore parse errors on partial paste
    }
  };

  const handleSaveCustomFirebase = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setConfigSuccessMsg(null);

    if (!apiKeyInput.trim() || !projectIdInput.trim()) {
      setErrorMsg("Please provide at least the Firebase API Key and Project ID.");
      return;
    }

    const creds = {
      apiKey: apiKeyInput.trim(),
      authDomain: authDomainInput.trim() || `${projectIdInput.trim()}.firebaseapp.com`,
      projectId: projectIdInput.trim(),
      storageBucket: storageBucketInput.trim() || `${projectIdInput.trim()}.appspot.com`,
      messagingSenderId: messagingSenderIdInput.trim(),
      appId: appIdInput.trim(),
    };

    const res = await configureCustomFirebase(creds);
    if (res.success) {
      setConfigSuccessMsg("Real Firebase successfully connected! You can now sign in with Google.");
      setTimeout(() => {
        setShowConfigModal(false);
      }, 1500);
    } else {
      setErrorMsg(res.error || "Failed to initialize Firebase with these credentials.");
    }
  };

  const copyToClipboard = (text: string, identifier?: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (identifier) {
        setCopiedKey(identifier);
        setTimeout(() => setCopiedKey(null), 2000);
      } else {
        setCopiedDomain(true);
        setTimeout(() => setCopiedDomain(false), 2000);
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
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-brand-accent bg-white/10 px-3 py-1 rounded-full border border-white/20">
              DBS Campus Pilot
            </span>
          </div>
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
        {/* Top: Mobile Logo & Firebase Status Indicator */}
        <div className="flex items-center justify-between gap-2">
          <div className="lg:hidden">
            <Logo variant="dark" size="sm" />
          </div>

          <button
            onClick={() => setShowConfigModal(true)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ml-auto transition-all ${
              isFirebaseConfigured
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                : "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 animate-pulse"
            }`}
            title="Click to check or configure Google OAuth settings"
          >
            {isFirebaseConfigured ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Auth: Active</span>
              </>
            ) : (
              <>
                <Settings className="w-3.5 h-3.5 text-amber-700" />
                <span>Configure Google Auth</span>
              </>
            )}
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
                ? "Sign in to manage your meal plan, skips, and daily orders."
                : "Join fellow DBS students enjoying fresh homestyle food daily."}
            </p>
          </div>

          {/* Official Google OAuth Sign In Button */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-brand-border bg-white hover:bg-brand-cream/60 text-brand-dark text-sm font-bold shadow-xs hover:shadow transition-all duration-200 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
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
              <span>{loading ? "Signing in..." : "Continue with Google"}</span>
            </button>

            {!isFirebaseConfigured && (
              <div className="mt-2.5 p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Real Google OAuth requires your Firebase project keys</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Click{" "}
                  <button
                    onClick={() => setShowConfigModal(true)}
                    className="underline font-bold hover:text-amber-950"
                  >
                    Configure Google Auth
                  </button>{" "}
                  to link your Firebase keys or copy environment variables for Vercel.
                </p>
              </div>
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
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-start gap-2 border border-red-200 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block">{errorMsg}</span>
                  {errorMsg.includes("Domain unauthorized") && (
                    <button
                      type="button"
                      onClick={() => setShowConfigModal(true)}
                      className="text-[11px] font-bold text-red-900 underline hover:text-black block"
                    >
                      Open Firebase Config Guide & Copy Domain →
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
                className="py-2.5 px-3 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>Demo Student</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo("admin")}
                className="py-2.5 px-3 text-xs font-bold rounded-xl bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
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
      {/* FIREBASE CONFIGURATION & OAUTH DIAGNOSTICS MODAL         */}
      {/* ======================================================== */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative border border-brand-border">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-5 right-5 text-brand-muted hover:text-brand-dark p-2 text-lg font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                  Google OAuth & Firebase Hub
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isFirebaseConfigured
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {isFirebaseConfigured
                    ? `Active (${firebaseConfigSource === "env" ? "Vercel/Env" : "Custom Cache"})`
                    : "Not Configured"}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-primary">
                Make Google OAuth Work on Your Site
              </h3>
            </div>

            {/* Current Hostname & Firebase Authorized Domains Reminder */}
            {currentHostname && (
              <div className="p-3.5 bg-brand-cream/80 border border-brand-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-brand-dark">
                    <Globe className="w-3.5 h-3.5 text-brand-primary" />
                    <span>Your Live Domain:</span>
                    <code className="bg-white px-2 py-0.5 rounded border border-brand-border font-mono text-brand-primary">
                      {currentHostname}
                    </code>
                  </div>
                  <p className="text-[11px] text-brand-muted">
                    Must be added to Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(currentHostname)}
                  className="px-3 py-1.5 rounded-xl bg-brand-primary text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-brand-secondary transition-colors shrink-0 cursor-pointer"
                >
                  {copiedDomain ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Domain</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-brand-border gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("instant")}
                className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                  activeTab === "instant"
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-brand-muted hover:text-brand-dark"
                }`}
              >
                1. Instant Connect (Paste Keys)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("vercel")}
                className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                  activeTab === "vercel"
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-brand-muted hover:text-brand-dark"
                }`}
              >
                2. Vercel Environment Variables
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("guide")}
                className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                  activeTab === "guide"
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-brand-muted hover:text-brand-dark"
                }`}
              >
                3. Firebase Setup Checklist
              </button>
            </div>

            {/* TAB 1: INSTANT CONNECT VIA DIRECT PASTE */}
            {activeTab === "instant" && (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 leading-relaxed">
                  <strong>🚀 Fast-Track:</strong> Paste the <code>firebaseConfig</code> object from your Firebase Console. It will configure real Google OAuth in this browser immediately without waiting for Vercel redeployment!
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Paste Firebase Config Code Snippet (Auto-detected):
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "your-app.firebaseapp.com",\n  projectId: "your-app",\n  ...\n};`}
                    value={rawSnippetInput}
                    onChange={(e) => handleSnippetPaste(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-brand-border bg-slate-50 text-brand-dark focus:outline-brand-primary"
                  />
                </div>

                <form onSubmit={handleSaveCustomFirebase} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-brand-dark mb-1">
                        API Key (Required)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="AIzaSy..."
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-brand-border bg-white font-mono text-xs focus:outline-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-brand-dark mb-1">
                        Project ID (Required)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="messmate-123"
                        value={projectIdInput}
                        onChange={(e) => setProjectIdInput(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-brand-border bg-white font-mono text-xs focus:outline-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-brand-dark mb-1">
                        Auth Domain
                      </label>
                      <input
                        type="text"
                        placeholder="messmate-123.firebaseapp.com"
                        value={authDomainInput}
                        onChange={(e) => setAuthDomainInput(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-brand-border bg-white font-mono text-xs focus:outline-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-brand-dark mb-1">
                        App ID
                      </label>
                      <input
                        type="text"
                        placeholder="1:1234567890:web:abc123"
                        value={appIdInput}
                        onChange={(e) => setAppIdInput(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-brand-border bg-white font-mono text-xs focus:outline-brand-primary"
                      />
                    </div>
                  </div>

                  {configSuccessMsg && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{configSuccessMsg}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-brand-primary text-white font-bold rounded-xl text-xs hover:bg-brand-secondary transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {loading ? "Connecting..." : "Save & Connect Real Firebase"}
                    </button>

                    {firebaseConfigSource === "custom" && (
                      <button
                        type="button"
                        onClick={resetFirebaseConfig}
                        className="px-3 py-3 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 cursor-pointer"
                        title="Remove custom stored credentials"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: VERCEL ENVIRONMENT VARIABLES */}
            {activeTab === "vercel" && (
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 text-xs">
                <p className="text-brand-muted leading-relaxed">
                  To make Google Auth work permanently for all visitors on Vercel, copy these 6 variables to{" "}
                  <strong>Vercel Dashboard &gt; Settings &gt; Environment Variables</strong>, then click{" "}
                  <strong>Deployments &gt; Redeploy</strong>.
                </p>

                <div className="space-y-2">
                  {[
                    { key: "NEXT_PUBLIC_FIREBASE_API_KEY", desc: "Your Firebase Web API Key (AIzaSy...)" },
                    { key: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", desc: "e.g. your-project.firebaseapp.com" },
                    { key: "NEXT_PUBLIC_FIREBASE_PROJECT_ID", desc: "Your Firebase Project ID" },
                    { key: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", desc: "e.g. your-project.appspot.com" },
                    { key: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", desc: "Numeric Sender ID" },
                    { key: "NEXT_PUBLIC_FIREBASE_APP_ID", desc: "e.g. 1:123456789:web:abcdef" },
                  ].map((item) => {
                    const isDetected = envCredentialsStatus && envCredentialsStatus[item.key];
                    return (
                      <div
                        key={item.key}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                          isDetected ? "bg-emerald-50/60 border-emerald-200" : "bg-slate-50 border-brand-border"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <code className="font-mono font-bold text-brand-primary block">{item.key}</code>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                isDetected
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              {isDetected ? "Detected in Build" : "Not Set"}
                            </span>
                          </div>
                          <span className="text-[11px] text-brand-muted">{item.desc}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.key, item.key)}
                          className="p-1.5 rounded-lg border border-brand-border bg-white hover:bg-slate-100 text-brand-dark transition-colors cursor-pointer"
                          title="Copy variable name"
                        >
                          {copiedKey === item.key ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-brand-muted" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  <strong>⚠️ Critical Next.js Rule:</strong> Next.js compiles <code>NEXT_PUBLIC_*</code> keys during the build. After adding keys in Vercel, you <strong>must</strong> go to Vercel Deployments &gt; click the three dots &gt; <strong>Redeploy</strong>!
                </div>
              </div>
            )}

            {/* TAB 3: FIREBASE CONSOLE CHECKLIST */}
            {activeTab === "guide" && (
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 text-xs">
                <div className="p-3 bg-brand-cream rounded-xl space-y-1 border border-brand-border">
                  <div className="flex items-center justify-between">
                    <strong className="text-brand-dark">Step 1: Open Firebase Console</strong>
                    <a
                      href="https://console.firebase.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-primary font-bold underline"
                    >
                      <span>Open Console</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-brand-muted">
                    Create a project named <code>messmate-dgu</code> or open your existing project.
                  </p>
                </div>

                <div className="p-3 bg-brand-cream rounded-xl space-y-1 border border-brand-border">
                  <strong className="text-brand-dark">Step 2: Enable Google Authentication</strong>
                  <p className="text-brand-muted">
                    Go to <strong>Build &gt; Authentication &gt; Sign-in method</strong>. Click <strong>Google</strong>, switch it <strong>Enable</strong>, pick your project support email, and click <strong>Save</strong>.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl space-y-1 border border-emerald-200">
                  <strong className="text-emerald-950">Step 3: Add Authorized Domain (MUST DO)</strong>
                  <p className="text-emerald-900 leading-relaxed">
                    Under <strong>Authentication &gt; Settings &gt; Authorized domains</strong>, click <strong>Add domain</strong> and enter:
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <code className="bg-white px-2.5 py-1 rounded border border-emerald-300 font-mono text-emerald-950 font-bold">
                      {currentHostname || "your-site.vercel.app"}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentHostname || "your-site.vercel.app")}
                      className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-bold hover:bg-emerald-800"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-brand-cream rounded-xl space-y-1 border border-brand-border">
                  <strong className="text-brand-dark">Step 4: Copy Web App Config</strong>
                  <p className="text-brand-muted">
                    Go to <strong>Project Settings (gear icon) &gt; General &gt; Your apps &gt; SDK setup and configuration</strong>. Select <strong>Config</strong> and copy the snippet into Tab 1.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowConfigModal(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-brand-dark font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Close Hub
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
