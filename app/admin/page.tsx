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
} from "@/services/dataService";
import {
  Meal,
  Kitchen,
  PartnerApplication,
  Subscription,
  OrderEnquiry,
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
  }, []);

  // Handlers for Partner Applications
  const handlePartnerAction = async (id: string, status: "approved" | "rejected") => {
    await updatePartnerApplicationStatus(id, status);
    loadAllAdminData();
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
          {/* TAB 5: ORDERS                                            */}
          {/* ======================================================== */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-white">
                WhatsApp Orders & Enquiries ({orders.length})
              </h2>

              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="font-bold text-sm text-white block">
                        {ord.mealName} (x{ord.quantity})
                      </span>
                      <p className="text-xs text-slate-400">
                        Student: <strong>{ord.userName}</strong> • Phone: {ord.userPhone || "Provided on WhatsApp"}
                      </p>
                      <p className="text-xs text-slate-400">
                        Slot: {ord.mealType.toUpperCase()} on {formatDate(ord.preferredDate)} • Room: {ord.deliveryAddress}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-serif font-bold text-base text-brand-accent block">
                        {formatCurrency(ord.amount)}
                      </span>
                      <span className="text-[11px] text-emerald-400">WhatsApp Opened</span>
                    </div>
                  </div>
                ))}
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
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white font-semibold text-xs"
                >
                  Save Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

