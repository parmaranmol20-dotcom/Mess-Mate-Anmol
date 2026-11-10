"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MealCard } from "@/components/meals/MealCard";
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";
import { getMeals } from "@/services/dataService";
import { Meal, SubscriptionPlan } from "@/types";
import { BRAND, PRICING_CONFIG, DEMO_KITCHENS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  Wallet,
  CalendarCheck,
  Info,
  Clock,
  Heart,
  ChevronDown,
  Check,
  MessageCircle,
  ChefHat,
  AlertCircle,
  Sun,
  Moon,
  Flame,
  Star,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<SubscriptionPlan>("monthly");
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number>(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  useEffect(() => {
    getMeals().then(setMeals);
  }, []);

  const openSubscribe = (plan: SubscriptionPlan) => {
    setSelectedPlanForModal(plan);
    setSubscriptionModalOpen(true);
  };

  // Campus Delivery Corridors
  const campusZones = [
    {
      name: "Manduwala PG Corridor",
      landmark: "Near DBS Gate 2, Devbhoomi & Green PG",
      kitchens: 3,
      lunchDrop: "12:30 – 1:15 PM",
      dinnerDrop: "7:45 – 8:30 PM",
      activeStatus: "🟢 Dispatch Active",
    },
    {
      name: "Kandoli Student Hub",
      landmark: "Girls PG Haven & Central Market Belt",
      kitchens: 2,
      lunchDrop: "12:45 – 1:30 PM",
      dinnerDrop: "8:00 – 8:45 PM",
      activeStatus: "🟢 Dispatch Active",
    },
    {
      name: "Selaqui Campuses",
      landmark: "DBS North Annex & Industrial PG Hub",
      kitchens: 2,
      lunchDrop: "1:00 – 1:45 PM",
      dinnerDrop: "8:15 – 9:00 PM",
      activeStatus: "🟢 Dispatch Active",
    },
    {
      name: "Prem Nagar Student Belt",
      landmark: "Wing 4 Road & Hostels",
      kitchens: 2,
      lunchDrop: "1:15 – 2:00 PM",
      dinnerDrop: "8:30 – 9:15 PM",
      activeStatus: "🟢 Dispatch Active",
    },
  ];

  // Weekly Menu Schedule
  const weeklySchedule = [
    {
      day: "Monday",
      tag: "Homestyle Kickoff",
      lunch: "Ghar Jaisa Yellow Dal Tadka, Seasonal Aloo Gobhi, 4 Phulkas & Steamed Rice",
      dinner: "Doon Special Kashmiri Rajma, Jeera Rice, Fresh Salad & Phulkas",
    },
    {
      day: "Tuesday",
      tag: "Pure Comfort",
      lunch: "Amritsari Chole, Fragrant Basmati Rice, 3 Butter Rotis & Chilled Boondi Raita",
      dinner: "Paneer Bhurji / Matar Paneer, Toor Dal, 4 Phulkas & Green Salad",
    },
    {
      day: "Wednesday",
      tag: "Midweek Energy",
      lunch: "Traditional Kadhi Pakora, Steamed Basmati Rice & Roasted Papad",
      dinner: "Mix Veg Sabzi, Moong Dal Fry, 4 Soft Whole Wheat Rotis & Pickle",
    },
    {
      day: "Thursday",
      tag: "Regional Special",
      lunch: "Pahaadi Kala Chana Gravy, Jeera Rice, 3 Phulkas & Fresh Cucumber Slices",
      dinner: "Kadhai Paneer, Yellow Dal Tadka, Steamed Rice & 4 Hot Phulkas",
    },
    {
      day: "Friday",
      tag: "Weekend Starter",
      lunch: "Doon Special Rajma Chawal, 2 Whole Wheat Phulkas & Onion Rings",
      dinner: "Aloo Matar Gravy, Dal Makhani, 4 Butter Rotis & Sweet Kheer Cup",
    },
    {
      day: "Saturday",
      tag: "Chef's Delight",
      lunch: "Chole Bhature / Chole Rice with Boondi Raita & Mint Chutney",
      dinner: "Light & Digestible Moong Dal Khichdi or Dal Tadka with 4 Phulkas",
    },
    {
      day: "Sunday",
      tag: "Feast Day",
      lunch: "Grand Executive Thali: Shahi Paneer, Dal Makhani, Pulao, 4 Rotis & Gulab Jamun",
      dinner: "Homestyle Egg Curry (or Paneer Butter Masala), Steamed Rice & 4 Phulkas",
    },
  ];

  const problemCards = [
    {
      title: "Expensive food delivery",
      description:
        "Commercial delivery apps add surge pricing, packaging fees, and restaurant markups that exhaust a student's monthly budget in 10 days.",
      icon: Wallet,
      tag: "Budget Drain",
      stat: "₹180–₹240/meal avg.",
    },
    {
      title: "Unhealthy alternatives",
      description:
        "Students frequently depend on roadside deep-fried snacks or instant noodles that lead to digestive issues, lethargy, and poor academic focus.",
      icon: Heart,
      tag: "Health Fatigue",
      stat: "High grease & soda",
    },
    {
      title: "Fixed mess schedules",
      description:
        "Traditional hostel mess contracts enforce rigid dining windows. Miss a lunch due to a DBS lab class and your money is gone with zero refunds.",
      icon: Clock,
      tag: "Zero Flexibility",
      stat: "Rigid 1-hour slots",
    },
  ];

  const solutionFeatures = [
    {
      title: "Home-style meals",
      description: "Balanced, comforting ghar-ka-khana prepared daily with low oil and pure spices by verified local home cooks.",
      icon: UtensilsCrossed,
      highlight: "Pure Ghee & Low Oil",
    },
    {
      title: "Student-friendly pricing",
      description: "Engineered around typical student monthly allowances: starting at ₹80 per meal with zero hidden platform commissions.",
      icon: Wallet,
      highlight: "Target ₹2,500 – ₹3,500/mo",
    },
    {
      title: "Flexible skip-a-meal",
      description: "Traveling home for the weekend or campus fest? Skip lunch by 9:00 AM or dinner by 4:00 PM to roll your credit forward.",
      icon: CalendarCheck,
      highlight: "Rolling Credit Guarantee",
    },
    {
      title: "Transparent kitchen info",
      description: "Complete visibility into who cooks your food, their hygiene standards, ingredients, and operating kitchen locations.",
      icon: Info,
      highlight: "100% Verified Partners",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Create your account",
      desc: "Sign up in 30 seconds using Google OAuth or your student email.",
    },
    {
      step: "02",
      title: "Explore the weekly menu",
      desc: "Browse authentic homestyle thalis and combos from approved Dehradun kitchens.",
    },
    {
      step: "03",
      title: "Choose your meal plan",
      desc: "Pick a weekly trial or budget-friendly monthly subscription with fair skip flexibility.",
    },
    {
      step: "04",
      title: "Order through WhatsApp",
      desc: "Fast, frictionless ordering directly with your campus kitchen coordinator.",
    },
    {
      step: "05",
      title: "Enjoy your meal",
      desc: "Piping hot, wholesome lunch or dinner dropped right at your PG or room gate.",
    },
  ];

  const faqs = [
    {
      q: "How does MessMate work?",
      a: "MessMate connects college students living in PGs and private accommodations with trusted local home cooks and small mess owners. Students can browse daily authentic home-cooked meals, subscribe to affordable weekly or monthly plans, easily skip meals when away, and place orders directly via WhatsApp.",
    },
    {
      q: "Where is MessMate currently available?",
      a: "MessMate is currently in its focused campus pilot serving students of DBS Global University and nearby student PG corridors in Manduwala, Kandoli, Selaqui, and Prem Nagar in Dehradun. We do not claim nationwide delivery to ensure maximum freshness and punctuality.",
    },
    {
      q: "How much does a meal cost?",
      a: "Individual meals are priced between ₹80 and ₹120 with an illustrative base selling price of ₹100. Monthly subscriptions are carefully structured to fit within student budgets of ₹2,500 to ₹3,500 for a single daily meal plan.",
    },
    {
      q: "Can I skip a meal if I am going out?",
      a: "Yes! Our fair-use Skip-a-Meal feature lets you pause lunch (before 9:00 AM) or dinner (before 4:00 PM) on our calendar interface. Your meal credit rolls forward to extend your plan validity.",
    },
    {
      q: "How do I subscribe?",
      a: "Simply click 'Get Started' or 'Choose Plan', select weekly or monthly frequency and your preferred slot (lunch, dinner, or both), and submit your request. Our campus coordinator will confirm your delivery address and schedule over WhatsApp.",
    },
    {
      q: "Can I become a kitchen partner?",
      a: "Absolutely! We invite passionate home cooks, aunts, and small mess owners around Dehradun to apply on our Kitchen Partner page. All kitchens undergo campus tasting and kitchen verification before onboarding.",
    },
    {
      q: "How can I contact support?",
      a: "You can reach out to our DBS campus student support desk via WhatsApp at +91 88590 12345 or email care@messmate.in. We respond within minutes during meal hours.",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* ======================================================== */}
        {/* HERO SECTION: EDITORIAL VENTURE-GRADE COMPOSITION        */}
        {/* ======================================================== */}
        <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-cream-radial bg-dot-pattern">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Copy & Actions */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Live Campus Corridor Selector Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-border shadow-xs text-xs font-semibold text-brand-primary">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                  <span>Currently serving: DBS Campus & nearby PG belts, Dehradun</span>
                </div>

                {/* Primary Editorial Headline */}
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-brand-dark tracking-tight leading-[1.08]">
                  Your everyday{" "}
                  <span className="italic font-normal text-brand-primary relative inline-block">
                    meals
                    <span className="absolute -bottom-1 left-0 w-full h-2 bg-brand-accent/40 rounded-full -z-10" />
                  </span>
                  .<br />
                  Sorted.
                </h1>

                {/* Subheading */}
                <p className="text-base sm:text-lg text-brand-muted max-w-xl leading-relaxed">
                  Fresh, hygienic, home-style food made affordable for students living away from home.
                  Authentic comfort thalis prepared by verified neighborhood kitchens.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link
                    href="/meals"
                    className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold text-sm text-center"
                  >
                    <span>Explore Today's Menu</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => openSubscribe("monthly")}
                    className="btn-secondary inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold text-sm text-center"
                  >
                    <span>Start Student Plan</span>
                    <Sparkles className="w-4 h-4 text-brand-accent" />
                  </button>
                </div>

                {/* Value Micro-Pillars */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-1 text-xs text-brand-muted font-medium">
                  <span className="flex items-center gap-1.5 text-brand-dark font-semibold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Student-first budget (~₹93/meal)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-brand-dark font-semibold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Skip meals anytime with credit roll
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-brand-dark font-semibold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    WhatsApp ordering MVP
                  </span>
                </div>

                {/* Campus Trust Stats Bar */}
                <div className="pt-4 border-t border-brand-border/60 flex items-center gap-4">
                  <div className="flex -space-x-2 overflow-hidden">
                    {[
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
                    ].map((src, i) => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden relative">
                        <Image src={src} alt="Student" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-brand-dark block">
                      Enrolling students across Manduwala & Kandoli PGs
                    </span>
                    <span className="text-[11px] text-brand-muted">
                      100% Home Cooked • Zero Aggregator Markups
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Layered Food Showcase Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Main Hero Card */}
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-brand-creamSoft group">
                    <Image
                      src="https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=85"
                      alt="Homestyle Indian Thali for MessMate Students"
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Top Scrim Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-brand-primary shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Annapurna Rasoi, Manduwala
                      </span>
                    </div>

                    {/* Bottom Details Panel */}
                    <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-accent">
                            Campus Pilot Signature Thali
                          </span>
                          <h4 className="font-serif font-bold text-base text-brand-dark">
                            Rajma, Dal Tadka & Desi Ghee Phulkas
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-brand-muted block">Base Price</span>
                          <span className="font-serif text-xl font-bold text-brand-primary">₹100</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-[11px] text-brand-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-primary" />
                          Next drop: 12:30 PM
                        </span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Fair Skip Guarantee
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Micro Badge 1 (Top Left) */}
                  <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-card border border-brand-border flex items-center gap-2 text-xs font-bold text-brand-dark">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>⚡ Avg. 18m Doorstep Drop</span>
                  </div>

                  {/* Floating Micro Badge 2 (Bottom Right) */}
                  <div className="absolute -bottom-3 -right-3 bg-brand-primary text-white px-4 py-2.5 rounded-2xl shadow-float flex items-center gap-2 text-xs font-semibold">
                    <MessageCircle className="w-4 h-4 text-brand-accent" />
                    <span>WhatsApp Order MVP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* INTERACTIVE CAMPUS CORRIDOR EXPLORER                     */}
        {/* ======================================================== */}
        <section className="py-12 bg-white border-y border-brand-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                  Hyper-Local Logistics
                </span>
                <h3 className="font-serif text-2xl font-bold text-brand-dark">
                  Select Your Dehradun Student Zone
                </h3>
              </div>
              <p className="text-xs text-brand-muted max-w-sm">
                We deliver punctual hot tiffins to designated student hubs across Manduwala, Kandoli, and Selaqui.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {campusZones.map((zone, idx) => {
                const isSelected = selectedZoneIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedZoneIndex(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? "bg-brand-primary text-white border-brand-primary shadow-md scale-[1.01]"
                        : "bg-brand-cream/30 border-brand-border/80 hover:bg-brand-cream text-brand-dark"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{zone.name}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-brand-accent" />}
                    </div>
                    <p className={`text-[11px] mb-2 truncate ${isSelected ? "text-emerald-100" : "text-brand-muted"}`}>
                      {zone.landmark}
                    </p>
                    <div className="pt-2 border-t border-white/20 text-[10px] space-y-0.5">
                      <div className={isSelected ? "text-brand-accent font-semibold" : "text-brand-primary font-semibold"}>
                        Lunch: {zone.lunchDrop}
                      </div>
                      <div className={isSelected ? "text-white/70" : "text-brand-muted"}>
                        Dinner: {zone.dinnerDrop}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* PROBLEM SECTION                                          */}
        {/* ======================================================== */}
        <section className="py-20 bg-brand-cream/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                The Reality of Student Life
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
                Living away from home shouldn't mean eating badly.
              </h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                Most out-of-city students at DBS and nearby colleges face the same daily dining dilemma:
                compromise on health or blow through your monthly allowance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-14">
              {problemCards.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-7 rounded-3xl bg-white border border-brand-border shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-emerald-50 rounded-2xl shadow-xs text-brand-primary border border-emerald-100">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider bg-brand-cream/80 px-2.5 py-1 rounded-full border border-brand-border">
                          {item.tag}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-brand-dark">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-brand-border/60 text-xs font-semibold text-rose-700 flex items-center justify-between">
                      <span>Impact:</span>
                      <span>{item.stat}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SOLUTION SECTION                                         */}
        {/* ======================================================== */}
        <section className="py-20 bg-white border-t border-brand-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                The MessMate Difference
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
                Meet your new everyday food partner.
              </h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                We designed MessMate to bridge the gap between expensive food deliveries and rigid hostel messes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
              {solutionFeatures.map((feat, idx) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-brand-cream/30 border border-brand-border shadow-xs hover:shadow-cardHover transition-all duration-300 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-brand-border text-brand-primary flex items-center justify-center shadow-xs">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif text-lg font-bold text-brand-dark">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-brand-muted leading-relaxed">
                        {feat.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-brand-border/60 text-[11px] font-bold text-emerald-800">
                      {feat.highlight}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* HOW IT WORKS                                             */}
        {/* ======================================================== */}
        <section id="how-it-works" className="py-20 bg-brand-cream/40 border-t border-brand-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                Simple Student Flow
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
                How It Works
              </h2>
              <p className="text-sm text-brand-muted">
                From cravings to fresh delivery in five easy steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 mt-14">
              {steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-brand-border/80 space-y-3 relative flex flex-col justify-between shadow-xs hover:shadow-card transition-all"
                >
                  <span className="font-serif text-3xl font-extrabold text-brand-primary/25">
                    {st.step}
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-brand-dark mb-1">
                      {st.title}
                    </h3>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* INTERACTIVE WEEKLY ROTATION MATRIX                       */}
        {/* ======================================================== */}
        <section id="weekly-menu" className="py-20 bg-white border-t border-brand-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                  Never Eat The Same Thing Daily
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
                  7-Day Homestyle Menu Schedule
                </h2>
                <p className="text-sm text-brand-muted max-w-xl">
                  Prepared by our registered Manduwala & Kandoli kitchens. Low oil, pure spices, with automatic skip flexibility.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/meals"
                  className="btn-primary text-xs font-bold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5"
                >
                  <span>Browse Full Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Day Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {weeklySchedule.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedDayIndex === idx
                      ? "bg-brand-primary text-white shadow-sm"
                      : "bg-brand-cream/80 hover:bg-brand-cream text-brand-dark"
                  }`}
                >
                  {item.day}
                </button>
              ))}
            </div>

            {/* Active Day Card */}
            <div className="mt-6 bg-brand-cream/40 p-6 sm:p-8 rounded-3xl border border-brand-border grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lunch Slot */}
              <div className="p-6 rounded-2xl bg-white border border-brand-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <span className="font-serif font-bold text-base text-brand-dark">
                      Lunch Slot (12:00 – 2:30 PM)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Pure Veg
                  </span>
                </div>
                <p className="text-sm text-brand-dark font-medium leading-relaxed">
                  {weeklySchedule[selectedDayIndex].lunch}
                </p>
                <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
                  <span>Cutoff to skip: 9:00 AM</span>
                  <span className="text-brand-primary font-bold">~₹100 value</span>
                </div>
              </div>

              {/* Dinner Slot */}
              <div className="p-6 rounded-2xl bg-white border border-brand-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-blue-500" />
                    <span className="font-serif font-bold text-base text-brand-dark">
                      Dinner Slot (7:30 – 9:45 PM)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-brand-accent bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Homestyle Warm Drop
                  </span>
                </div>
                <p className="text-sm text-brand-dark font-medium leading-relaxed">
                  {weeklySchedule[selectedDayIndex].dinner}
                </p>
                <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
                  <span>Cutoff to skip: 4:00 PM</span>
                  <span className="text-brand-primary font-bold">~₹100 value</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* POPULAR MEALS                                            */}
        {/* ======================================================== */}
        <section className="py-20 bg-brand-cream/50 border-t border-brand-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Fresh Campus Menu
                  </span>
                  <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Demonstration Data
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
                  Popular Homestyle Meals
                </h2>
                <p className="text-sm text-brand-muted max-w-xl">
                  Cooked fresh daily with low oil and motherly care. Illustrative base selling price: ₹100.
                </p>
              </div>

              <Link
                href="/meals"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
              >
                <span>View Full Menu & Kitchens</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Meal Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {meals.slice(0, 6).map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* PRICING SECTION                                          */}
        {/* ======================================================== */}
        <section id="pricing" className="py-20 bg-white border-t border-brand-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                Affordable Student Plans
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
                Good food. Honest prices.
              </h2>
              <p className="text-sm text-brand-muted">
                Flexible plans designed around student life. No surge pricing, no hidden delivery commissions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
              {/* Card 1: Individual Meal */}
              <div className="p-8 rounded-3xl bg-brand-cream/30 border border-brand-border flex flex-col justify-between space-y-6 hover:shadow-card transition-all">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                      A La Carte
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-brand-dark">
                      Individual Meal
                    </h3>
                    <p className="text-xs text-brand-muted">
                      Ideal for when you want a single homely meal without any recurring commitment.
                    </p>
                  </div>

                  <div className="py-2">
                    <div className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary">
                      ₹80 – ₹120
                    </div>
                    <span className="text-xs text-brand-muted">
                      Base price: ₹100 per thali
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-brand-dark pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Choose any meal from today's menu</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Doorstep drop at your PG gate</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Direct WhatsApp ordering</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/meals"
                  className="w-full py-3 text-center rounded-xl bg-white hover:bg-brand-cream border border-brand-border text-brand-dark font-semibold text-xs transition-colors"
                >
                  Explore Today's Meals
                </Link>
              </div>

              {/* Card 2: Weekly Plan */}
              <div className="p-8 rounded-3xl bg-brand-cream/30 border border-brand-border flex flex-col justify-between space-y-6 hover:shadow-card transition-all">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                      Exam & Short Stays
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-brand-dark">
                      Weekly Plan
                    </h3>
                    <p className="text-xs text-brand-muted">
                      Tailored for flexible study stints, exam prep weeks, and trial periods.
                    </p>
                  </div>

                  <div className="py-2">
                    <div className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary">
                      {formatCurrency(PRICING_CONFIG.weeklyPlan.singleMealDaily)}
                    </div>
                    <span className="text-xs text-brand-muted">
                      7 daily meals (or ₹1,349 for 14 meals)
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-brand-dark pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Pick Lunch or Dinner slot</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Fair-use skip-a-meal credit roll</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Menu rotation every single day</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => openSubscribe("weekly")}
                  className="w-full py-3 text-center rounded-xl bg-white hover:bg-brand-cream border border-brand-border text-brand-dark font-semibold text-xs transition-colors"
                >
                  Select Weekly Plan
                </button>
              </div>

              {/* Card 3: Monthly Plan (Featured) */}
              <div className="p-8 rounded-3xl bg-brand-primary text-white border-2 border-brand-accent/50 shadow-float relative flex flex-col justify-between space-y-6">
                <div className="absolute -top-3.5 right-6 bg-brand-accent text-brand-dark text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                  MOST POPULAR
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                      Targeted Student Budget
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      Monthly Plan
                    </h3>
                    <p className="text-xs text-emerald-100/80">
                      Fits perfectly within typical student PG food allowances with zero stress.
                    </p>
                  </div>

                  <div className="py-2">
                    <div className="font-serif text-3xl sm:text-4xl font-bold text-brand-accent">
                      {formatCurrency(PRICING_CONFIG.monthlyPlan.singleMealDaily)}
                    </div>
                    <span className="text-xs text-emerald-100/70">
                      Target budget: {PRICING_CONFIG.monthlyPlan.targetBudgetRange} (30 meals)
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-emerald-50 pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-accent shrink-0" />
                      <span>Single (30 meals) or Double (60 meals)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-accent shrink-0" />
                      <span>Unlimited scheduled skip credits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-accent shrink-0" />
                      <span>Priority WhatsApp delivery coordination</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-accent shrink-0" />
                      <span>Sunday special dessert inclusion</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => openSubscribe("monthly")}
                  className="w-full py-3.5 text-center rounded-xl bg-brand-accent hover:bg-brand-accentDark text-brand-dark font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  Start Monthly Subscription
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-brand-muted mt-8">
              *Pricing is configurable by administrator. Guaranteed financial savings are not advertised without validated longitudinal data.
            </p>
          </div>
        </section>

        {/* ======================================================== */}
        {/* KITCHEN PARTNER SECTION                                  */}
        {/* ======================================================== */}
        <section className="py-20 bg-brand-dark text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-accent bg-white/10 px-3.5 py-1.5 rounded-full">
                  <ChefHat className="w-4 h-4" />
                  <span>Kitchen Community Partnership</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  Your kitchen could feed a campus.
                </h2>

                <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                  We partner with local home cooks and small mess owners to bring fresh home-style meals to students while creating consistent business opportunities.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/kitchen-partner"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand-accent hover:bg-brand-accentDark text-brand-dark font-bold text-sm shadow-md transition-all duration-200"
                  >
                    <span>Become a Kitchen Partner</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border-2 border-white/20 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
                    alt="Authentic Home Cook Kitchen Partner"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                    <span className="font-bold block text-sm">Empowering Local Homemakers</span>
                    <span className="text-white/70">Consistent daily subscriptions with zero tech barriers.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* TESTIMONIALS (CLEARLY IDENTIFIED AS DEMO)                */}
        {/* ======================================================== */}
        <section className="py-20 bg-brand-cream/40 border-t border-brand-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                Demonstration Feedback (Prototype)
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark pt-2">
                Student Personas & Campus Feedback
              </h2>
              <p className="text-xs text-brand-muted">
                Sample user personas designed during the DGU Venture Quest field survey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  quote:
                    "Living in Manduwala PG without mess facilities was tough. Having hot rajma chawal and phulkas delivered right at 1 PM without app surge prices is a lifesaver.",
                  name: "Pooja Bisht",
                  dept: "BBA 1st Year, DBS Global University",
                  location: "Manduwala PG",
                },
                {
                  quote:
                    "The Skip-a-Meal feature is what sold me. Every Friday I take the bus back to Rishikesh, so I don't pay for weekends. Finally a plan that doesn't waste my money.",
                  name: "Rohan Verma",
                  dept: "MBA 2nd Year, DBS Global University",
                  location: "Kandoli Hub",
                },
                {
                  quote:
                    "Ordering via WhatsApp is super easy. No payment failures on shady gateways, the aunties cook pure homely low-oil food, and it feels like home.",
                  name: "Sneha Nair",
                  dept: "B.Sc Agriculture, Dehradun",
                  location: "Prem Nagar PG",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-brand-border shadow-xs flex flex-col justify-between space-y-4"
                >
                  <p className="text-xs sm:text-sm text-brand-dark/90 leading-relaxed italic">
                    "{item.quote}"
                  </p>
                  <div className="pt-3 border-t border-brand-border/60">
                    <span className="font-serif font-bold text-sm text-brand-primary block">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-brand-muted block">
                      {item.dept}
                    </span>
                    <span className="text-[10px] text-brand-accent font-semibold">
                      {item.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* FAQ SECTION                                              */}
        {/* ======================================================== */}
        <section id="faq" className="py-20 bg-white border-t border-brand-border/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2 mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                Got Questions?
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted">
                Everything you need to know about MessMate student subscriptions and campus pilots.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = faqOpenIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-brand-border overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-white hover:bg-brand-cream/30 transition-colors"
                    >
                      <span className="font-serif text-base font-bold text-brand-dark">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-brand-muted shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-brand-primary" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-brand-muted leading-relaxed bg-brand-cream/10 border-t border-brand-border/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Subscription Modal Trigger */}
      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        initialPlan={selectedPlanForModal}
      />
    </>
  );
}
