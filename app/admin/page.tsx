"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/brand/Logo";
import {
  getMeals,
  addMeal,
  updateMeal,
  deleteMeal,
  getKitchens,
  getPartnerApplications,
  updatePartnerApplicationStatus,
  getAllSubscriptions,
  getAllOrders,
  getAllSkipRequests,
  getPricingConfig,
  updatePricingConfig,
  updateSkipRequestStatus,
  resetToDemoDefaults,
  subscribeToOrders,
  updateOrderStatus,
  checkFirestoreStatus,
  createOrderEnquiry,
} from "@/services/dataService";
import {
  Meal,
  Kitchen,
  PartnerApplication,
  Subscription,
  OrderEnquiry,
  OrderStatus,
  SkipRequest,
} from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ShieldCheck,
  Users,
  ChefHat,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Settings,
  Utensils,
  LogOut,
  MapPin,
  Calendar,
  MessageCircle,
  ArrowRight,
  Filter,
  Phone,
  ExternalLink,
  Bell,
  Truck,
  CookingPot,
  Radio,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { profile, loading, signOutUser, loginAsDemo } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "overview" | "meals" | "partners" | "subscriptions" | "orders" | "skips" | "pricing"
  >("overview");

  // Data states
  const [meals, setMeals] = useState<Meal[]>([]);
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [partnerApps, setPartnerApps] = useState<PartnerApplication[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [orders, setOrders] = useState<OrderEnquiry[]>([]);
  const [skips, setSkips] = useState<SkipRequest[]>([]);
  const [pricing, setPricing] = useState(getPricingConfig());

  // Real-time backend states
  const [firestoreStatus, setFirestoreStatus] = useState<{ connected: boolean; error?: string } | null>(null);
  const [showFirestoreHelp, setShowFirestoreHelp] = useState(false);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Meal Form modal
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [mealForm, setMealForm] = useState({
    name: "",
    description: "",
    price: 100,
    category: "thali",
    foodType: "veg" as "veg" | "non-veg",
    imageURL: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    kitchenId: "kitch-1",
    kitchenName: "Annapurna Rasoi (Aunty's Kitchen)",
    kitchenLocation: "Manduwala, Dehradun",
    availability: true,
    mealTiming: "both" as "lunch" | "dinner" | "both",
    portionInfo: "Serves 1 generous student portion",
    ingredients: "Seasonal greens, whole wheat, aromatic spices",
  });

  const loadAllAdminData = async () => {
    const [m, k, apps, subs, ords, sk] = await Promise.all([
      getMeals(),
      getKitchens(),
      getPartnerApplications(),
      getAllSubscriptions(),
      getAllOrders(),
      getAllSkipRequests(),
    ]);

    setMeals(m);
    setKitchens(k);
    setPartnerApps(apps);
    setSubscriptions(subs);
    setOrders(ords);
    setSkips(sk);
    setPricing(getPricingConfig());
  };

  useEffect(() => {
    if (!loading) {
      if (!profile || profile.role !== "admin") {
        // If not logged in as admin, provide quick login as demo admin for faculty review
        loginAsDemo("admin");
      }
    }
  }, [profile, loading]);

  useEffect(() => {
    loadAllAdminData();
    checkFirestoreStatus().then((res) => setFirestoreStatus(res));

    const unsubscribe = subscribeToOrders((liveOrders) => {
      setOrders((prev) => {
        if (prev.length > 0 && liveOrders.length > prev.length) {
          const newest = liveOrders[0];
          setNewOrderAlert(`🍱 New Live Order from ${newest.userName}: ${newest.mealName} (₹${newest.amount})`);
          setTimeout(() => setNewOrderAlert(null), 7000);
        }
        return liveOrders;
      });
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // 1. Instant optimistic state update so UI updates with zero delay
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    // 2. Persist to Cloud Firestore and local storage
    await updateOrderStatus(orderId, status);
  };

  const handleSimulateOrder = async () => {
    setIsSimulating(true);
    const demoStudentNames = [
      "Rohan Verma",
      "Sneha Rawat",
      "Karan Bisht",
      "Priya Negi",
      "Ananya Joshi",
      "Aarav Sharma",
      "Devansh Pant",
    ];
    const randomName = demoStudentNames[Math.floor(Math.random() * demoStudentNames.length)];
    const randomMeal = meals.length > 0 ? meals[Math.floor(Math.random() * meals.length)] : null;

    await createOrderEnquiry({
      userId: "test-user-" + Date.now(),
      userName: randomName,
      userPhone: "+91 98971 " + Math.floor(10000 + Math.random() * 90000),
      mealId: randomMeal ? randomMeal.id : "meal-1",
      mealName: randomMeal ? randomMeal.name : "Doon Special Rajma Chawal Thali",
      kitchenId: randomMeal ? randomMeal.kitchenId : "kitch-1",
      kitchenName: randomMeal ? randomMeal.kitchenName : "Annapurna Rasoi (Aunty's Kitchen)",
      quantity: 1,
      amount: randomMeal ? randomMeal.price : 100,
      preferredDate: new Date().toISOString().split("T")[0],
      mealType: Math.random() > 0.5 ? "lunch" : "dinner",
      deliveryAddress: `Room ${Math.floor(101 + Math.random() * 300)}, Devbhoomi PG, Manduwala`,
      status: "confirmed",
      notes: "Please pack extra green chutney",
    });

    setIsSimulating(false);
  };

  // Handlers for Partner Applications
  const handlePartnerAction = async (id: string, status: "approved" | "rejected") => {
    setPartnerApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    await updatePartnerApplicationStatus(id, status);
  };

  const handleSkipAction = async (id: string, status: "approved" | "rejected") => {
    setSkips((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    await updateSkipRequestStatus(id, status);
  };

  // Handlers for Meal Management
  const handleSaveMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    const ingArray = mealForm.ingredients.split(",").map((i) => i.trim());

    if (editingMeal) {
      await updateMeal(editingMeal.id, {
        name: mealForm.name,
        description: mealForm.description,
        price: Number(mealForm.price),
        category: mealForm.category as any,
        foodType: mealForm.foodType,
        imageURL: mealForm.imageURL,
        kitchenName: mealForm.kitchenName,
        mealTiming: mealForm.mealTiming,
        portionInfo: mealForm.portionInfo,
        ingredients: ingArray,
        availability: mealForm.availability,
      });
    } else {
      await addMeal({
        name: mealForm.name,
        description: mealForm.description,
        price: Number(mealForm.price),
        category: mealForm.category as any,
        foodType: mealForm.foodType,
        imageURL: mealForm.imageURL,
        kitchenId: mealForm.kitchenId,
        kitchenName: mealForm.kitchenName,
        kitchenLocation: mealForm.kitchenLocation,
        availability: mealForm.availability,
        mealTiming: mealForm.mealTiming,
        portionInfo: mealForm.portionInfo,
        ingredients: ingArray,
        isDemo: true,
      });
    }

    setMealModalOpen(false);
    setEditingMeal(null);
    loadAllAdminData();
  };

  const handleDeleteMeal = async (id: string) => {
    if (confirm("Are you sure you want to remove this meal from the student menu?")) {
      await deleteMeal(id);
      loadAllAdminData();
    }
  };

  const handleToggleMealAvailability = async (meal: Meal) => {
    await updateMeal(meal.id, { availability: !meal.availability });
    loadAllAdminData();
  };

  const openEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setMealForm({
      name: meal.name,
      description: meal.description,
      price: meal.price,
      category: meal.category,
      foodType: meal.foodType,
      imageURL: meal.imageURL,
      kitchenId: meal.kitchenId,
      kitchenName: meal.kitchenName,
      kitchenLocation: meal.kitchenLocation,
      availability: meal.availability,
      mealTiming: meal.mealTiming,
      portionInfo: meal.portionInfo,
      ingredients: meal.ingredients.join(", "),
    });
    setMealModalOpen(true);
  };

  const handlePricingSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricingConfig(pricing);
    alert("Pricing configuration saved successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* ======================================================== */}
      {/* ADMIN SIDEBAR                                            */}
      {/* ======================================================== */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Logo variant="inverted" size="sm" showTagline />
          </div>

          <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <div>
              <span className="font-bold block">Admin Authority</span>
              <span className="text-[10px] text-emerald-400/80">Campus Management</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: "overview", label: "Dashboard Metrics", icon: ShieldCheck },
              { id: "meals", label: "Manage Meals", icon: Utensils, badge: meals.length },
              {
                id: "partners",
                label: "Partner Applications",
                icon: ChefHat,
                badge: partnerApps.filter((a) => a.status === "pending").length,
              },
              {
                id: "subscriptions",
                label: "Student Subscriptions",
                icon: Sparkles,
                badge: subscriptions.length,
              },
              {
                id: "orders",
                label: "WhatsApp Enquiries",
                icon: MessageCircle,
                badge: orders.length,
              },
              {
                id: "skips",
                label: "Skip-a-Meal Requests",
                icon: Calendar,
                badge: skips.length,
              },
              { id: "pricing", label: "Configure Pricing", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all ${
                    isActive
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </Link>

          <button
            onClick={() => {
              signOutUser();
              router.push("/");
            }}
            className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN ADMIN WORKSPACE                                     */}
      {/* ======================================================== */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                MessMate Core Administration
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
                DGU Venture Quest Operations Hub
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Oversee student signups, kitchen onboarding, WhatsApp tiffin enquiries, and skip policies.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm("Reset local demonstration data (meals, orders, skips, partner applications) to original campus defaults?")) {
                    resetToDemoDefaults();
                    loadAllAdminData();
                  }
                }}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors border border-slate-700"
              >
                Reset Demo Data
              </button>

              <button
                onClick={() => {
                  setEditingMeal(null);
                  setMealForm({
                    name: "",
                    description: "",
                    price: 100,
                    category: "thali",
                    foodType: "veg",
                    imageURL: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
                    kitchenId: "kitch-1",
                    kitchenName: "Annapurna Rasoi (Aunty's Kitchen)",
                    kitchenLocation: "Manduwala, Dehradun",
                    availability: true,
                    mealTiming: "both",
                    portionInfo: "Serves 1 generous student portion",
                    ingredients: "Seasonal vegetables, whole wheat, aromatic spices",
                  });
                  setMealModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-primary hover:bg-brand-secondary text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Meal</span>
              </button>
            </div>
          </div>

          {/* Real-time Order Arrival Alert */}
          {newOrderAlert && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm flex items-center justify-between shadow-xl animate-pulse">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 animate-bounce" />
                <span>{newOrderAlert}</span>
              </div>
              <button
                onClick={() => {
                  setActiveTab("orders");
                  setNewOrderAlert(null);
                }}
                className="px-3.5 py-1.5 bg-white text-emerald-950 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors shadow-xs"
              >
                View in Dispatch Board →
              </button>
            </div>
          )}

          {/* Real-time Cloud Backend Sync Status Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Radio
                className={`w-4 h-4 shrink-0 ${
                  firestoreStatus?.connected ? "text-emerald-400 animate-pulse" : "text-amber-400"
                }`}
              />
              <div>
                <span className="font-bold text-slate-200">
                  Backend Status:{" "}
                  <span className={firestoreStatus?.connected ? "text-emerald-400" : "text-amber-400"}>
                    {firestoreStatus?.connected ? "Cloud Firestore Active (Live Multi-Device Sync)" : "Local Storage Mode"}
                  </span>
                </span>
                <p className="text-[11px] text-slate-400">
                  {firestoreStatus?.connected
                    ? "Orders placed on any student's phone will appear here in real-time without reloading."
                    : "To sync orders across all phones and laptops, enable Cloud Firestore Database in Firebase Console."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleSimulateOrder()}
                disabled={isSimulating}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSimulating ? "Adding..." : "⚡ Simulate Order"}</span>
              </button>

              {!firestoreStatus?.connected && (
                <button
                  onClick={() => setShowFirestoreHelp(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-300 font-bold text-xs hover:bg-amber-900 transition-colors"
                >
                  Firestore Setup Guide
                </button>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW METRICS                                  */}
          {/* ======================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold block">
                    Registered Students
                  </span>
                  <div className="text-3xl font-serif font-bold text-white">48</div>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    +12 this week (DBS PG Corridor)
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold block">
                    Partner Applications
                  </span>
                  <div className="text-3xl font-serif font-bold text-white">
                    {partnerApps.length}
                  </div>
                  <span className="text-[10px] text-amber-400 font-medium">
                    {partnerApps.filter((a) => a.status === "pending").length} awaiting tasting audit
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold block">
                    Active Kitchens
                  </span>
                  <div className="text-3xl font-serif font-bold text-white">
                    {kitchens.length}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    100% verified home cooks
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold block">
                    WhatsApp Orders & Subs
                  </span>
                  <div className="text-3xl font-serif font-bold text-white">
                    {orders.length + subscriptions.length}
                  </div>
                  <span className="text-[10px] text-blue-400 font-medium">
                    Live campus pilot activity
                  </span>
                </div>
              </div>

              {/* Subscriptions & Skips Quick Table */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Partner Approvals */}
                <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center justify-between">
                    <span>Pending Kitchen Audits</span>
                    <button
                      onClick={() => setActiveTab("partners")}
                      className="text-xs text-emerald-400 hover:underline font-sans font-semibold"
                    >
                      View All
                    </button>
                  </h3>

                  <div className="space-y-3">
                    {partnerApps.slice(0, 3).map((app) => (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs text-white block">
                            {app.kitchenName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {app.ownerName} • {app.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handlePartnerAction(app.id, "approved")}
                            className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 text-xs font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handlePartnerAction(app.id, "rejected")}
                            className="p-1.5 rounded-lg bg-red-950 text-red-400 border border-red-800 hover:bg-red-900 text-xs font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Skip Requests */}
                <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center justify-between">
                    <span>Recent Student Meal Skips</span>
                    <button
                      onClick={() => setActiveTab("skips")}
                      className="text-xs text-emerald-400 hover:underline font-sans font-semibold"
                    >
                      Manage
                    </button>
                  </h3>

                  <div className="space-y-3">
                    {skips.slice(0, 3).map((s) => (
                      <div
                        key={s.id}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-xs text-white block">
                            {s.userName || "Student"} • {formatDate(s.date)}
                          </span>
                          <span className="text-[11px] text-slate-400 uppercase font-semibold">
                            Slot: {s.mealType}
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
                          Credit Rolled
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: MANAGE MEALS                                      */}
          {/* ======================================================== */}
          {activeTab === "meals" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white">Menu Catalog</h2>
                  <p className="text-xs text-slate-400">
                    Control active food items, availability, and portion descriptions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-4 rounded-3xl bg-slate-800/90 border border-slate-700 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-900">
                        <Image
                          src={meal.imageURL}
                          alt={meal.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => handleToggleMealAvailability(meal)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              meal.availability
                                ? "bg-emerald-600 text-white"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {meal.availability ? "Available" : "Hidden"}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white truncate">{meal.name}</span>
                        <span className="font-serif text-sm font-bold text-brand-accent">
                          {formatCurrency(meal.price)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {meal.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                        {meal.kitchenName}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditMeal(meal)}
                          className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-slate-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: PARTNER APPLICATIONS                              */}
          {/* ======================================================== */}
          {activeTab === "partners" && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-white">
                Kitchen Partner Applications ({partnerApps.length})
              </h2>

              <div className="space-y-3">
                {partnerApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-white">
                          {app.kitchenName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            app.status === "approved"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : app.status === "rejected"
                              ? "bg-red-950 text-red-400 border border-red-800"
                              : "bg-amber-950 text-amber-400 border border-amber-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Owner: <strong>{app.ownerName}</strong> • Phone: {app.phone} • Email: {app.email}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{app.kitchenAddress}</span>
                      </p>
                      <p className="text-xs text-slate-400 italic pt-1">
                        "{app.description}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {app.status !== "approved" && (
                        <button
                          onClick={() => handlePartnerAction(app.id, "approved")}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                        >
                          Approve Partner
                        </button>
                      )}
                      {app.status !== "rejected" && (
                        <button
                          onClick={() => handlePartnerAction(app.id, "rejected")}
                          className="px-4 py-2 rounded-xl bg-red-950 text-red-400 border border-red-800 hover:bg-red-900 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: STUDENT SUBSCRIPTIONS                             */}
          {/* ======================================================== */}
          {activeTab === "subscriptions" && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-white">
                Student Subscriptions ({subscriptions.length})
              </h2>

              <div className="space-y-3">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="font-serif font-bold text-base text-white block">
                        {sub.userName || "Student"} ({sub.planType.toUpperCase()} PLAN)
                      </span>
                      <p className="text-xs text-slate-400">
                        Validity: {formatDate(sub.startDate)} to {formatDate(sub.endDate)} • Remaining:{" "}
                        <strong className="text-emerald-400">{sub.remainingMeals}</strong> of {sub.totalMeals} meals
                      </p>
                      <p className="text-xs text-slate-400">
                        Preference: {sub.mealPreferences.toUpperCase()} slot • Value: {formatCurrency(sub.amount)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                          sub.status === "active"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: ORDERS & LIVE KITCHEN DISPATCH                    */}
          {/* ======================================================== */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {/* Order Hub Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <span>Live Order Dispatch</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                      {orders.length} total
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage incoming student tiffins, update cooking status, and coordinate WhatsApp deliveries.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateOrder}
                    disabled={isSimulating}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isSimulating ? "Adding Order..." : "⚡ Simulate Incoming Order"}</span>
                  </button>
                </div>
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                {[
                  { id: "all", label: `All Orders (${orders.length})` },
                  { id: "confirmed", label: `Confirmed (${orders.filter((o) => o.status === "confirmed").length})` },
                  { id: "preparing", label: `Cooking (${orders.filter((o) => o.status === "preparing").length})` },
                  { id: "out_for_delivery", label: `Out for Delivery (${orders.filter((o) => o.status === "out_for_delivery").length})` },
                  { id: "delivered", label: `Delivered (${orders.filter((o) => o.status === "delivered").length})` },
                  { id: "whatsapp_opened", label: `WhatsApp Inquiries (${orders.filter((o) => o.status === "whatsapp_opened").length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setOrderFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      orderFilter === tab.id
                        ? "bg-brand-primary text-white font-bold shadow-xs"
                        : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {orders
                  .filter((ord) => orderFilter === "all" || ord.status === orderFilter)
                  .map((ord) => {
                    const statusColors: { [key: string]: { bg: string; text: string; border: string } } = {
                      whatsapp_opened: { bg: "bg-amber-950/80", text: "text-amber-400", border: "border-amber-800" },
                      pending: { bg: "bg-amber-950/80", text: "text-amber-400", border: "border-amber-800" },
                      confirmed: { bg: "bg-blue-950/80", text: "text-blue-400", border: "border-blue-800" },
                      preparing: { bg: "bg-purple-950/80", text: "text-purple-400", border: "border-purple-800" },
                      out_for_delivery: { bg: "bg-orange-950/80", text: "text-orange-400", border: "border-orange-800" },
                      delivered: { bg: "bg-emerald-950/80", text: "text-emerald-400", border: "border-emerald-800" },
                      cancelled: { bg: "bg-red-950/80", text: "text-red-400", border: "border-red-800" },
                    };
                    const color = statusColors[ord.status] || statusColors.confirmed;

                    const cleanedPhone = ord.userPhone ? ord.userPhone.replace(/[^0-9]/g, "") : "";
                    const whatsappDirectUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(
                      `Hi ${ord.userName}, this is MessMate DBS Campus Support! We received your order for *${ord.mealName}* (x${ord.quantity}) scheduled for ${ord.mealType.toUpperCase()} at ${ord.deliveryAddress}. Total: ₹${ord.amount}. Status: ${ord.status.toUpperCase()}.`
                    )}`;

                    return (
                      <div
                        key={ord.id}
                        className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-4 shadow-lg hover:border-slate-600 transition-all"
                      >
                        {/* Top: Header with ID, Status, Amount */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-slate-400">
                              #{ord.id.slice(-8)}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{formatDate(ord.preferredDate)}</span>
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                              {ord.mealType}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase ${color.bg} ${color.text} ${color.border}`}>
                              {ord.status.replace("_", " ")}
                            </span>
                            <span className="font-serif font-bold text-lg text-brand-accent">
                              {formatCurrency(ord.amount)}
                            </span>
                          </div>
                        </div>

                        {/* Middle: Meal & Student Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* Meal Info */}
                          <div className="space-y-1">
                            <span className="font-serif font-bold text-base text-white block">
                              {ord.mealName}
                            </span>
                            <p className="text-slate-300">
                              Quantity: <strong className="text-white">{ord.quantity} meal(s)</strong>
                            </p>
                            <p className="text-slate-400 flex items-center gap-1">
                              <ChefHat className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Kitchen: {ord.kitchenName || "Partner Rasoi"}</span>
                            </p>
                            {ord.notes && (
                              <p className="text-amber-300 italic pt-1">
                                Special note: "{ord.notes}"
                              </p>
                            )}
                          </div>

                          {/* Student Details */}
                          <div className="space-y-1 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-sm">
                                {ord.userName}
                              </span>
                              {ord.userPhone && (
                                <a
                                  href={`tel:${ord.userPhone}`}
                                  className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{ord.userPhone}</span>
                                </a>
                              )}
                            </div>

                            <p className="text-slate-300 flex items-start gap-1 pt-1">
                              <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0 mt-0.5" />
                              <span>{ord.deliveryAddress || "DBS Campus / PG Corridor"}</span>
                            </p>
                          </div>
                        </div>

                        {/* Bottom: Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-700/60">
                          {/* WhatsApp Direct Chat Button */}
                          {cleanedPhone ? (
                            <a
                              href={whatsappDirectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Chat on WhatsApp</span>
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">
                              Phone captured on initial WhatsApp ping
                            </span>
                          )}

                          {/* Status Progression Controls */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] text-slate-400 font-medium mr-1">Update Status:</span>

                            {ord.status !== "confirmed" && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, "confirmed")}
                                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve Order</span>
                              </button>
                            )}

                            {ord.status !== "preparing" && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, "preparing")}
                                className="px-2.5 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <CookingPot className="w-3 h-3" />
                                <span>Cooking</span>
                              </button>
                            )}

                            {ord.status !== "out_for_delivery" && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, "out_for_delivery")}
                                className="px-2.5 py-1 rounded-lg bg-orange-900/60 hover:bg-orange-800 text-orange-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Truck className="w-3 h-3" />
                                <span>Out for Delivery</span>
                              </button>
                            )}

                            {ord.status !== "delivered" && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, "delivered")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Delivered</span>
                              </button>
                            )}

                            {ord.status !== "cancelled" && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, "cancelled")}
                                className="px-2 py-1 rounded-lg bg-red-950 hover:bg-red-900 text-red-400 text-xs transition-colors cursor-pointer"
                                title="Cancel Order"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {orders.length === 0 && (
                  <div className="p-8 text-center bg-slate-800/40 rounded-3xl border border-slate-700 text-slate-400 space-y-2">
                    <Clock className="w-8 h-8 mx-auto text-slate-500" />
                    <p className="text-sm font-semibold">No orders in this filter</p>
                    <p className="text-xs">Click "⚡ Simulate Incoming Order" above to test real-time orders!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: SKIP REQUESTS                                     */}
          {/* ======================================================== */}
          {activeTab === "skips" && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-white">
                Skip-a-Meal Requests ({skips.length})
              </h2>

              <div className="space-y-3">
                {skips.map((sk) => (
                  <div
                    key={sk.id}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <span className="font-bold text-xs text-white block">
                        {sk.userName || "Student"} • Date: {formatDate(sk.date)}
                      </span>
                      <p className="text-xs text-slate-400">
                        Slot: {sk.mealType.toUpperCase()} • Reason: {sk.reason || "Student request"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 font-semibold bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800">
                        {sk.status.toUpperCase()} (Credit Extended)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: PRICING CONFIGURATION                             */}
          {/* ======================================================== */}
          {activeTab === "pricing" && (
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 max-w-xl space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">
                  Configure Campus Pricing Rules
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Update meal selling prices and subscription bundle targets without modifying code.
                </p>
              </div>

              <form onSubmit={handlePricingSave} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Base Illustrative Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    value={pricing.baseSellingPrice}
                    onChange={(e) =>
                      setPricing({ ...pricing, baseSellingPrice: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Weekly Single Slot (₹)
                    </label>
                    <input
                      type="number"
                      value={pricing.weeklyPlan.singleMealDaily}
                      onChange={(e) =>
                        setPricing({
                          ...pricing,
                          weeklyPlan: {
                            ...pricing.weeklyPlan,
                            singleMealDaily: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Weekly Double Slot (₹)
                    </label>
                    <input
                      type="number"
                      value={pricing.weeklyPlan.doubleMealDaily}
                      onChange={(e) =>
                        setPricing({
                          ...pricing,
                          weeklyPlan: {
                            ...pricing.weeklyPlan,
                            doubleMealDaily: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Monthly Single Slot (₹)
                    </label>
                    <input
                      type="number"
                      value={pricing.monthlyPlan.singleMealDaily}
                      onChange={(e) =>
                        setPricing({
                          ...pricing,
                          monthlyPlan: {
                            ...pricing.monthlyPlan,
                            singleMealDaily: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Monthly Double Slot (₹)
                    </label>
                    <input
                      type="number"
                      value={pricing.monthlyPlan.doubleMealDaily}
                      onChange={(e) =>
                        setPricing({
                          ...pricing,
                          monthlyPlan: {
                            ...pricing.monthlyPlan,
                            doubleMealDaily: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs mt-2"
                >
                  Save Pricing Configuration
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* ======================================================== */}
      {/* MEAL ADD / EDIT MODAL                                    */}
      {/* ======================================================== */}
      {mealModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-slate-100 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-bold text-white">
              {editingMeal ? "Edit Meal" : "Add Meal to Campus Menu"}
            </h3>

            <form onSubmit={handleSaveMeal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Meal Title</label>
                <input
                  type="text"
                  required
                  value={mealForm.name}
                  onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={mealForm.description}
                  onChange={(e) => setMealForm({ ...mealForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={mealForm.price}
                    onChange={(e) => setMealForm({ ...mealForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={mealForm.category}
                    onChange={(e) => setMealForm({ ...mealForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="thali">Thali</option>
                    <option value="dal_rice">Dal & Rice</option>
                    <option value="combo">Combo</option>
                    <option value="healthy">Healthy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Food Type</label>
                  <select
                    value={mealForm.foodType}
                    onChange={(e) => setMealForm({ ...mealForm, foodType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="veg">Pure Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Slot Timing</label>
                  <select
                    value={mealForm.mealTiming}
                    onChange={(e) => setMealForm({ ...mealForm, mealTiming: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="both">Both Lunch & Dinner</option>
                    <option value="lunch">Lunch Only</option>
                    <option value="dinner">Dinner Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kitchen Partner Name</label>
                <input
                  type="text"
                  required
                  value={mealForm.kitchenName}
                  onChange={(e) => setMealForm({ ...mealForm, kitchenName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Food Image URL</label>
                <input
                  type="url"
                  required
                  value={mealForm.imageURL}
                  onChange={(e) => setMealForm({ ...mealForm, imageURL: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ingredients (comma separated)</label>
                <input
                  type="text"
                  value={mealForm.ingredients}
                  onChange={(e) => setMealForm({ ...mealForm, ingredients: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setMealModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white font-semibold text-xs cursor-pointer"
                >
                  Save Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cloud Firestore Multi-Device Sync Guide Modal */}
      {showFirestoreHelp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowFirestoreHelp(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Cloud Backend Setup
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                Sync Orders Across All Devices
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                To have orders placed by students on their phones instantly appear here on your laptop in real-time, turn on Cloud Firestore in your Firebase project (takes 30 seconds):
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-white">Step 1: Open Firebase Console</strong>
                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold underline inline-flex items-center gap-1"
                  >
                    <span>console.firebase.google.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-slate-400">
                  Select your project: <code className="text-emerald-300 font-bold">mess-mate-anmolvercel</code>
                </p>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                <strong className="text-white">Step 2: Create Firestore Database</strong>
                <p className="text-slate-400 leading-relaxed">
                  In the left sidebar, click <strong>Build &gt; Firestore Database</strong>, then click the blue <strong>"Create database"</strong> button.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-950/40 rounded-2xl border border-emerald-800/80 space-y-1">
                <strong className="text-emerald-300">Step 3: Select Test Mode & Location</strong>
                <p className="text-slate-300 leading-relaxed">
                  Choose <strong>"Start in test mode"</strong> (allows instant read/write) → Location: <strong>asia-south1 (Mumbai)</strong> → click <strong>Create</strong>!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowFirestoreHelp(false);
                checkFirestoreStatus().then((res) => setFirestoreStatus(res));
              }}
              className="w-full py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              I've Created It / Check Status Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

