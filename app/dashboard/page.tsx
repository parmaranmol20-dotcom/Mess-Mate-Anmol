"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/brand/Logo";
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";
import { SkipMealManager } from "@/components/subscription/SkipMealManager";
import {
  getUserSubscription,
  getUserOrders,
  getUserSkipRequests,
  getMeals,
  updateSubscriptionStatus,
} from "@/services/dataService";
import { Subscription, OrderEnquiry, SkipRequest, Meal } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  LayoutDashboard,
  Utensils,
  CalendarCheck,
  Clock,
  User as UserIcon,
  HelpCircle,
  LogOut,
  Sparkles,
  ArrowRight,
  Pause,
  Play,
  XCircle,
  MapPin,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
  Menu,
  X,
  RefreshCw,
  Calendar,
  Sun,
  Moon,
  Zap,
} from "lucide-react";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { profile, loading, signOutUser, loginAsDemo, updateLocalProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "overview" | "plan" | "weekly_menu" | "skip" | "orders" | "profile"
  >("overview");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orders, setOrders] = useState<OrderEnquiry[]>([]);
  const [skipRequests, setSkipRequests] = useState<SkipRequest[]>([]);
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Address edit state
  const [editingAddress, setEditingAddress] = useState(false);
  const [selectedHub, setSelectedHub] = useState("Manduwala PG Corridor");
  const [roomNumber, setRoomNumber] = useState("Room 204");

  // Load user data
  const loadDashboardData = async () => {
    if (!profile) return;
    setIsRefreshing(true);
    const sub = await getUserSubscription(profile.uid);
    const userOrders = await getUserOrders(profile.uid);
    const skips = await getUserSkipRequests(profile.uid);
    const allMeals = await getMeals();

    setSubscription(sub);
    setOrders(userOrders);
    setSkipRequests(skips);
    setTodayMeals(allMeals.slice(0, 3));
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (!loading && !profile) {
      loginAsDemo("student");
    } else if (profile) {
      loadDashboardData();
    }
  }, [profile, loading]);

  const handlePauseToggle = async () => {
    if (!subscription) return;
    const newStatus = subscription.status === "paused" ? "active" : "paused";
    await updateSubscriptionStatus(subscription.id, newStatus);
    loadDashboardData();
  };

  const handleCancelSub = async () => {
    if (!subscription) return;
    if (confirm("Are you sure you want to cancel your subscription? Unused meal credits can be refunded by the campus desk.")) {
      await updateSubscriptionStatus(subscription.id, "cancelled");
      loadDashboardData();
    }
  };

  const handleSaveAddress = () => {
    const fullAddress = `${roomNumber}, ${selectedHub}, Dehradun`;
    updateLocalProfile({ pgAddress: fullAddress });
    setEditingAddress(false);
    alert(`Delivery address updated to: ${fullAddress}`);
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  };

  const weeklySchedule = [
    { day: "Monday", lunch: "Yellow Dal Tadka, Aloo Gobhi, 4 Phulkas & Steamed Rice", dinner: "Kashmiri Rajma, Jeera Rice, Salad & Phulkas" },
    { day: "Tuesday", lunch: "Amritsari Chole, Jeera Rice, 3 Rotis & Boondi Raita", dinner: "Matar Paneer, Toor Dal, 4 Phulkas & Salad" },
    { day: "Wednesday", lunch: "Kadhi Pakora, Steamed Basmati Rice & Roasted Papad", dinner: "Mix Veg Sabzi, Moong Dal, 4 Rotis & Salad" },
    { day: "Thursday", lunch: "Pahaadi Kala Chana, Jeera Rice & 3 Phulkas", dinner: "Kadhai Paneer, Dal Tadka, Rice & 4 Phulkas" },
    { day: "Friday", lunch: "Doon Special Rajma Chawal & 2 Phulkas", dinner: "Dal Makhani, Aloo Matar, 4 Rotis & Sweet Cup" },
    { day: "Saturday", lunch: "Chole Rice with Boondi Raita & Salad", dinner: "Moong Dal Tadka, Seasonal Sabzi & 4 Phulkas" },
    { day: "Sunday", lunch: "Grand Executive Thali with Shahi Paneer & Pulao", dinner: "Homestyle Paneer Masala / Egg Curry, Rice & Rotis" },
  ];

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "plan", label: "My Meal Plan", icon: Utensils },
    { id: "weekly_menu", label: "7-Day Campus Menu", icon: Calendar },
    { id: "skip", label: "Skip a Meal", icon: CalendarCheck, badge: skipRequests.length > 0 ? skipRequests.length : undefined },
    { id: "orders", label: "WhatsApp Orders", icon: Clock, badge: orders.length > 0 ? orders.length : undefined },
    { id: "profile", label: "Profile & PG Address", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-brand-cream/40 flex flex-col md:flex-row">
      {/* ======================================================== */}
      {/* SIDEBAR NAVIGATION                                       */}
      {/* ======================================================== */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-brand-border z-40 flex flex-col justify-between p-5 transition-transform duration-300 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Logo variant="dark" size="sm" showTagline />
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-brand-muted hover:text-brand-dark"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-brand-primary text-white shadow-xs font-bold"
                      : "text-brand-dark/80 hover:bg-brand-cream hover:text-brand-primary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <Link
              href="/meals"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-brand-dark/80 hover:bg-brand-cream hover:text-brand-primary transition-all"
            >
              <div className="flex items-center gap-3">
                <Utensils className="w-4 h-4 text-brand-accent" />
                <span>Explore Meals</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-brand-muted" />
            </Link>
          </nav>
        </div>

        {/* Bottom Sidebar */}
        <div className="space-y-3 pt-4 border-t border-brand-border">
          <div className="flex items-center gap-3 px-1">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-brand-cream border border-brand-border">
              {profile?.photoURL ? (
                <Image src={profile.photoURL} alt={profile.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-xs text-brand-primary">
                  {profile?.name?.charAt(0) || "S"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-xs text-brand-dark truncate block">
                {profile?.name || "Student"}
              </span>
              <span className="text-[10px] text-brand-muted truncate block">
                {profile?.college || "DBS Global University"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/#faq"
              className="text-[11px] text-brand-muted hover:text-brand-dark flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Campus Desk</span>
            </Link>

            <button
              onClick={() => {
                signOutUser();
                router.push("/");
              }}
              title="Sign Out"
              className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                        */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-brand-border p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 text-brand-dark rounded-lg hover:bg-brand-cream border border-brand-border"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo variant="dark" size="sm" />
          <div className="w-6" />
        </header>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* Top Greeting & Location Notice */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-brand-border shadow-card">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">
                  {getGreeting()}, {profile?.name?.split(" ")[0] || "Student"}!
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  DBS Scholar Active
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
                Your Student Food Headquarters
              </h1>
              <p className="text-xs text-brand-muted flex items-center gap-1.5 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                <span>
                  Delivery Hub: <strong>{profile?.pgAddress || "Room 204, Devbhoomi Boys PG, Manduwala, Dehradun"}</strong>
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadDashboardData}
                disabled={isRefreshing}
                title="Refresh dashboard data"
                className="p-2.5 rounded-2xl border border-brand-border hover:bg-brand-cream text-brand-muted hover:text-brand-dark transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>

              <button
                onClick={() => setSubModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-brand-accent" />
                <span>{subscription ? "Manage Plan" : "Choose Meal Plan"}</span>
              </button>
            </div>
          </div>

          {/* Quick Express Skip Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-brand-primary text-white p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-2xl text-brand-accent shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-sm block">
                  Going out or heading home for the weekend?
                </span>
                <span className="text-xs text-emerald-100/90">
                  Skip lunch before 9 AM or dinner before 4 PM. Your meal credit automatically rolls forward!
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("skip")}
              className="px-4 py-2 bg-white hover:bg-brand-cream text-brand-dark font-bold text-xs rounded-xl shadow-xs shrink-0 self-start sm:self-auto transition-transform active:scale-95"
            >
              Skip a Meal Now
            </button>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW                                          */}
          {/* ======================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Actions Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link
                  href="/meals"
                  className="p-4 rounded-2xl bg-white border border-brand-border hover:border-brand-primary/40 shadow-xs hover:shadow-card transition-all text-left space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-brand-primary flex items-center justify-center">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <span className="font-serif text-sm font-bold text-brand-dark block">
                    Explore Menu
                  </span>
                  <span className="text-[11px] text-brand-muted block">
                    See today's homestyle thalis
                  </span>
                </Link>

                <button
                  onClick={() => setActiveTab("weekly_menu")}
                  className="p-4 rounded-2xl bg-white border border-brand-border hover:border-brand-primary/40 shadow-xs hover:shadow-card transition-all text-left space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="font-serif text-sm font-bold text-brand-dark block">
                    Weekly Rotation
                  </span>
                  <span className="text-[11px] text-brand-muted block">
                    7-day campus meal calendar
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("skip")}
                  className="p-4 rounded-2xl bg-white border border-brand-border hover:border-brand-primary/40 shadow-xs hover:shadow-card transition-all text-left space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-brand-primary flex items-center justify-center">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <span className="font-serif text-sm font-bold text-brand-dark block">
                    Skip a Meal
                  </span>
                  <span className="text-[11px] text-brand-muted block">
                    Roll forward your credit
                  </span>
                </button>

                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918859012345"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white border border-brand-border hover:border-brand-primary/40 shadow-xs hover:shadow-card transition-all text-left space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="font-serif text-sm font-bold text-brand-dark block">
                    WhatsApp Desk
                  </span>
                  <span className="text-[11px] text-brand-muted block">
                    DBS student coordination
                  </span>
                </a>
              </div>

              {/* Subscription Card & Today's Scheduled Meal */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Subscription Card */}
                <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-brand-border shadow-card flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                        Active Tiffin Subscription
                      </span>
                      {subscription && (
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                            subscription.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : subscription.status === "paused"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          ● {subscription.status}
                        </span>
                      )}
                    </div>

                    {subscription ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-serif text-2xl font-bold text-brand-primary">
                            {subscription.planType === "monthly" ? "Monthly" : "Weekly"} Student Plan
                          </h3>
                          <p className="text-xs text-brand-muted">
                            Preference: <span className="font-bold text-brand-dark uppercase">{subscription.mealPreferences}</span> slot
                          </p>
                        </div>

                        {/* Progress Bar of Meals */}
                        <div className="p-4 bg-brand-cream/50 rounded-2xl border border-brand-border/60 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-brand-muted">Scheduled Meals Progress:</span>
                            <span className="font-bold text-brand-dark">
                              {subscription.remainingMeals} of {subscription.totalMeals} remaining
                            </span>
                          </div>
                          <div className="w-full h-3 bg-brand-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-primary rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.round(
                                  (subscription.remainingMeals / subscription.totalMeals) * 100
                                )}%`,
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-brand-muted pt-1">
                            <span>Started: {formatDate(subscription.startDate)}</span>
                            <span>Valid till: {formatDate(subscription.endDate)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 space-y-3">
                        <p className="text-xs text-brand-muted">
                          You do not have an active meal subscription yet. Choose a weekly or monthly plan to guarantee healthy daily food.
                        </p>
                        <button
                          onClick={() => setSubModalOpen(true)}
                          className="btn-primary px-5 py-2.5 rounded-xl font-bold text-xs"
                        >
                          Start a Plan
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Plan Action Buttons */}
                  {subscription && (
                    <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between gap-3">
                      <button
                        onClick={handlePauseToggle}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-brand-border hover:bg-brand-cream text-brand-dark transition-colors"
                      >
                        {subscription.status === "paused" ? (
                          <>
                            <Play className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Resume Plan</span>
                          </>
                        ) : (
                          <>
                            <Pause className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pause Plan</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleCancelSub}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Request Cancellation</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Today's Menu Preview */}
                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-brand-border shadow-card flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                        Today's Campus Menu
                      </span>
                      <Link href="/meals" className="text-xs font-bold text-brand-primary hover:underline">
                        View Full Menu
                      </Link>
                    </div>

                    <div className="space-y-2.5 mt-2">
                      {todayMeals.map((m) => (
                        <div
                          key={m.id}
                          className="p-2.5 rounded-2xl border border-brand-border/70 hover:bg-brand-cream/40 flex items-center gap-3 transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-cream shrink-0">
                            <Image
                              src={m.imageURL}
                              alt={m.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-brand-dark truncate">
                              {m.name}
                            </h4>
                            <span className="text-[11px] text-brand-muted block truncate">
                              {m.kitchenName}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-serif font-bold text-xs text-brand-primary block">
                              {formatCurrency(m.price)}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold uppercase">
                              {m.foodType}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-border/60 text-[11px] text-brand-muted flex items-center justify-between">
                    <span>Lunch drop: 12:30 PM</span>
                    <span>Dinner drop: 8:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders Log */}
              <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-brand-dark">
                    Recent WhatsApp Orders & Requests
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-brand-primary hover:underline"
                  >
                    View All Orders ({orders.length})
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-brand-muted">
                    No individual orders yet. Browse our menu to place an instant meal order on WhatsApp!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orders.slice(0, 3).map((o) => (
                      <div
                        key={o.id}
                        className="p-3.5 rounded-2xl bg-brand-cream/30 border border-brand-border/70 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs text-brand-dark block">
                            {o.mealName} (x{o.quantity})
                          </span>
                          <span className="text-[11px] text-brand-muted">
                            {formatDate(o.preferredDate)} • Slot: {o.mealType.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-serif font-bold text-xs text-brand-primary block">
                            {formatCurrency(o.amount)}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                            WhatsApp Dispatched
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: MY MEAL PLAN                                      */}
          {/* ======================================================== */}
          {activeTab === "plan" && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-card space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                    Subscription Management
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-brand-dark mt-1">
                    My Active Meal Plan
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Review your scheduled days, meal preferences, and rolling validity credits.
                  </p>
                </div>

                {subscription ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-brand-cream/60 rounded-2xl border border-brand-border/60">
                        <span className="text-[11px] text-brand-muted uppercase font-bold block">
                          Plan Tier
                        </span>
                        <span className="font-serif text-xl font-bold text-brand-primary capitalize">
                          {subscription.planType} Plan
                        </span>
                        <span className="text-[11px] text-brand-muted block mt-0.5">
                          {subscription.mealPreferences.toUpperCase()} Slot
                        </span>
                      </div>

                      <div className="p-4 bg-brand-cream/60 rounded-2xl border border-brand-border/60">
                        <span className="text-[11px] text-brand-muted uppercase font-bold block">
                          Validity Window
                        </span>
                        <span className="font-semibold text-sm text-brand-dark block mt-1">
                          {formatDate(subscription.startDate)} to {formatDate(subscription.endDate)}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                          Fair-Use Extension Active
                        </span>
                      </div>

                      <div className="p-4 bg-brand-cream/60 rounded-2xl border border-brand-border/60">
                        <span className="text-[11px] text-brand-muted uppercase font-bold block">
                          Total Value
                        </span>
                        <span className="font-serif text-xl font-bold text-brand-primary">
                          {formatCurrency(subscription.amount)}
                        </span>
                        <span className="text-[11px] text-brand-muted block mt-0.5">
                          {subscription.totalMeals} total scheduled meals
                        </span>
                      </div>
                    </div>

                    <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                      <span className="font-bold block flex items-center gap-1.5 text-sm">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        MessMate Fair-Use Guarantee
                      </span>
                      <p className="leading-relaxed">
                        Whenever you submit a meal skip before the cutoff (9:00 AM for lunch, 4:00 PM for dinner), your meal credit is automatically carried over to add extra days to your plan validity. You never lose money when away from campus!
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handlePauseToggle}
                        className="px-5 py-2.5 rounded-xl border border-brand-border bg-white hover:bg-brand-cream text-xs font-bold"
                      >
                        {subscription.status === "paused" ? "Resume Subscription" : "Pause Subscription"}
                      </button>
                      <button
                        onClick={() => setSubModalOpen(true)}
                        className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold"
                      >
                        Upgrade or Switch Plan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-sm text-brand-muted">
                      No subscription active at this time.
                    </p>
                    <button
                      onClick={() => setSubModalOpen(true)}
                      className="btn-primary px-6 py-3 rounded-2xl text-xs font-bold"
                    >
                      Browse Subscription Plans
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: WEEKLY MENU ROTATION                              */}
          {/* ======================================================== */}
          {activeTab === "weekly_menu" && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-card space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                  Weekly Schedule
                </span>
                <h2 className="font-serif text-2xl font-bold text-brand-dark mt-1">
                  DBS Campus 7-Day Meal Calendar
                </h2>
                <p className="text-xs text-brand-muted mt-1">
                  Rotating homestyle menus prepared with pure ingredients by our verified Dehradun kitchens.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weeklySchedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-brand-border bg-brand-cream/30 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-brand-border/60">
                      <span className="font-serif font-bold text-base text-brand-primary">
                        {item.day}
                      </span>
                      <button
                        onClick={() => setActiveTab("skip")}
                        className="text-[11px] font-bold text-brand-accent hover:underline flex items-center gap-1"
                      >
                        <span>Skip this day</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <Sun className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-brand-dark block">Lunch:</strong>
                          <span className="text-brand-muted">{item.lunch}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Moon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-brand-dark block">Dinner:</strong>
                          <span className="text-brand-muted">{item.dinner}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: SKIP A MEAL                                       */}
          {/* ======================================================== */}
          {activeTab === "skip" && <SkipMealManager />}

          {/* ======================================================== */}
          {/* TAB 5: MY ORDERS & ENQUIRIES                             */}
          {/* ======================================================== */}
          {activeTab === "orders" && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-card space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                  Order Log
                </span>
                <h2 className="font-serif text-2xl font-bold text-brand-dark mt-1">
                  My Orders & WhatsApp Enquiries
                </h2>
                <p className="text-xs text-brand-muted mt-1">
                  All meal orders generated through WhatsApp with verified partner kitchens.
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-xs text-brand-muted">
                  No orders recorded. Go to <Link href="/meals" className="text-brand-primary font-bold underline">Explore Meals</Link> to order your first homestyle thali!
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl border border-brand-border bg-brand-cream/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-brand-dark">
                            {ord.mealName}
                          </span>
                          <span className="text-xs text-brand-muted font-bold">
                            x{ord.quantity}
                          </span>
                        </div>
                        <p className="text-xs text-brand-muted">
                          {ord.kitchenName || "Partner Kitchen"} • {formatDate(ord.preferredDate)} ({ord.mealType.toUpperCase()})
                        </p>
                        <p className="text-[11px] text-brand-muted flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-primary" />
                          <span>{ord.deliveryAddress}</span>
                        </p>
                      </div>

                      <div className="text-left sm:text-right space-y-1">
                        <span className="font-serif font-bold text-base text-brand-primary block">
                          {formatCurrency(ord.amount)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-700" />
                          <span>WhatsApp Dispatched</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: PROFILE & PG ADDRESS                              */}
          {/* ======================================================== */}
          {activeTab === "profile" && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-card space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                  Student Account
                </span>
                <h2 className="font-serif text-2xl font-bold text-brand-dark mt-1">
                  Profile & Campus Residence
                </h2>
                <p className="text-xs text-brand-muted mt-1">
                  Ensure your room number and PG details are accurate for punctual tiffin drops.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-brand-cream/50 rounded-2xl border border-brand-border">
                  <span className="text-brand-muted block font-semibold">Student Name:</span>
                  <span className="text-brand-dark font-bold text-sm block mt-0.5">{profile?.name}</span>
                </div>

                <div className="p-4 bg-brand-cream/50 rounded-2xl border border-brand-border">
                  <span className="text-brand-muted block font-semibold">College Email:</span>
                  <span className="text-brand-dark font-bold text-sm block mt-0.5">{profile?.email}</span>
                </div>

                <div className="p-4 bg-brand-cream/50 rounded-2xl border border-brand-border">
                  <span className="text-brand-muted block font-semibold">University:</span>
                  <span className="text-brand-dark font-bold text-sm block mt-0.5">{profile?.college || "DBS Global University"}</span>
                </div>

                <div className="p-4 bg-brand-cream/50 rounded-2xl border border-brand-border">
                  <span className="text-brand-muted block font-semibold">Phone:</span>
                  <span className="text-brand-dark font-bold text-sm block mt-0.5">{profile?.phone || "+91 98765 43210"}</span>
                </div>
              </div>

              {/* Delivery Address Editor */}
              <div className="p-5 bg-brand-cream/50 rounded-2xl border border-brand-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand-dark block">
                      Active PG Delivery Address
                    </span>
                    <span className="text-xs text-brand-muted">
                      {profile?.pgAddress || "Room 204, Devbhoomi Boys PG, Manduwala, Dehradun"}
                    </span>
                  </div>

                  <button
                    onClick={() => setEditingAddress(!editingAddress)}
                    className="btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-bold"
                  >
                    {editingAddress ? "Cancel" : "Change Address"}
                  </button>
                </div>

                {editingAddress && (
                  <div className="pt-3 border-t border-brand-border/60 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1 text-brand-dark">
                          Select Delivery Hub
                        </label>
                        <select
                          value={selectedHub}
                          onChange={(e) => setSelectedHub(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-brand-border bg-white text-brand-dark"
                        >
                          <option value="Manduwala PG Corridor">Manduwala PG Corridor (Near DBS Gate 2)</option>
                          <option value="Girls PG Haven Kandoli">Girls PG Haven & Kandoli Hub</option>
                          <option value="Devbhoomi Boys PG Manduwala">Devbhoomi Boys PG Manduwala</option>
                          <option value="Selaqui Campus & Hostels">Selaqui Campus & Hostels</option>
                          <option value="Prem Nagar Student Belt">Prem Nagar Student Belt</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-brand-dark">
                          Room / Flat / Floor Details
                        </label>
                        <input
                          type="text"
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value)}
                          placeholder="e.g. Room 204, 2nd Floor"
                          className="w-full p-2.5 rounded-xl border border-brand-border bg-white text-brand-dark"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveAddress}
                      className="btn-primary px-5 py-2 rounded-xl font-bold text-xs"
                    >
                      Save New Delivery Address
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Modal Trigger */}
      <SubscriptionModal
        isOpen={subModalOpen}
        onClose={() => {
          setSubModalOpen(false);
          loadDashboardData();
        }}
      />
    </div>
  );
}
