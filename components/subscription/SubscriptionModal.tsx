"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { SubscriptionPlan, MealTiming } from "@/types";
import { getPricingConfig, createSubscription } from "@/services/dataService";
import { formatCurrency } from "@/lib/utils";
import { X, CheckCircle, Calendar, Sparkles, MessageCircle, AlertCircle } from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: SubscriptionPlan;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  initialPlan = "monthly",
}: SubscriptionModalProps) {
  const { profile, loginAsDemo } = useAuth();
  const pricing = getPricingConfig();

  const [planType, setPlanType] = useState<SubscriptionPlan>(initialPlan);
  const [mealSlot, setMealSlot] = useState<MealTiming>("both");
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(
    profile?.pgAddress || "Manduwala PG Corridor, Dehradun"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    id: string;
    amount: number;
    whatsappUrl?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate pricing
  const calculateAmount = () => {
    if (planType === "weekly") {
      return mealSlot === "both"
        ? pricing.weeklyPlan.doubleMealDaily
        : pricing.weeklyPlan.singleMealDaily;
    } else {
      return mealSlot === "both"
        ? pricing.monthlyPlan.doubleMealDaily
        : pricing.monthlyPlan.singleMealDaily;
    }
  };

  const totalMeals =
    planType === "weekly" ? (mealSlot === "both" ? 14 : 7) : mealSlot === "both" ? 60 : 30;

  const amount = calculateAmount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const userId = profile?.uid || "guest-" + Date.now();
    const userName = profile?.name || "Student Guest";
    const userEmail = profile?.email || "student@dbs.edu.in";

    // Calculate end date based on plan type
    const start = new Date(startDate);
    const durationDays = planType === "weekly" ? 7 : 30;
    const end = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const endDateStr = end.toISOString().split("T")[0];

    try {
      const sub = await createSubscription({
        userId,
        userName,
        userEmail,
        userPhone: phone,
        planType,
        mealPreferences: mealSlot,
        startDate,
        endDate: endDateStr,
        amount,
        status: "active",
        totalMeals,
        remainingMeals: totalMeals,
        notes: address,
      });

      // Prepare WhatsApp pre-filled notification for the MessMate student coordinator
      const whatsappText = encodeURIComponent(
        `🎉 *NEW MESSMATE SUBSCRIPTION ENQUIRY*\n` +
        `_DBS Campus Pilot_\n` +
        `--------------------------------\n` +
        `👤 *Student:* ${userName}\n` +
        `📞 *Contact:* ${phone || "On chat"}\n` +
        `📦 *Plan:* ${planType.toUpperCase()} (${mealSlot.toUpperCase()})\n` +
        `🗓 *Start Date:* ${startDate} to ${endDateStr}\n` +
        `🍛 *Total Meals:* ${totalMeals} meals\n` +
        `💰 *Subscription Value:* ₹${amount}\n` +
        `📍 *Delivery PG/Room:* ${address}\n` +
        `--------------------------------\n` +
        `_Please activate my plan and provide daily tiffin dispatch time!_`
      );

      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918859012345";
      const cleaned = whatsappNumber.replace(/[^0-9]/g, "");
      const whatsappUrl = `https://wa.me/${cleaned}?text=${whatsappText}`;

      setSuccessData({
        id: sub.id,
        amount,
        whatsappUrl,
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to record subscription request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 overflow-hidden shadow-2xl relative border border-brand-border">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-brand-muted hover:text-brand-dark bg-brand-cream/80 hover:bg-brand-cream rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {successData ? (
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-brand-primary">
                Subscription Request Confirmed!
              </h3>
              <p className="text-sm text-brand-muted max-w-md mx-auto">
                Your <strong>{planType.toUpperCase()}</strong> plan ({totalMeals} meals) has been created.
                To coordinate your preferred daily delivery slot and payment, confirm with the campus team on WhatsApp.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-sm font-semibold text-emerald-900">
              Subscription Total: {formatCurrency(successData.amount)}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {successData.whatsappUrl && (
                <a
                  href={successData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-md transition-transform active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirm on WhatsApp</span>
                </a>
              )}
              <button
                onClick={onClose}
                className="px-6 py-3 bg-brand-cream hover:bg-brand-border text-brand-dark font-semibold rounded-2xl transition-colors"
              >
                Close & Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                DBS Pilot Subscription
              </span>
              <h3 className="font-serif text-2xl font-bold text-brand-primary mt-1">
                Choose Your Meal Plan
              </h3>
              <p className="text-xs text-brand-muted mt-1">
                Flexible plans designed around student life. Includes our flexible Skip-a-Meal guarantee.
              </p>
            </div>

            {/* Plan selection buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPlanType("weekly")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  planType === "weekly"
                    ? "border-brand-primary bg-emerald-50/70 shadow-sm"
                    : "border-brand-border bg-white hover:border-brand-primary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-brand-dark">Weekly Plan</span>
                  {planType === "weekly" && (
                    <span className="w-2 h-2 rounded-full bg-brand-primary" />
                  )}
                </div>
                <div className="font-serif text-lg font-bold text-brand-primary mt-1">
                  from {formatCurrency(pricing.weeklyPlan.singleMealDaily)}
                </div>
                <p className="text-[11px] text-brand-muted mt-0.5">7 or 14 flexible meals</p>
              </button>

              <button
                type="button"
                onClick={() => setPlanType("monthly")}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  planType === "monthly"
                    ? "border-brand-primary bg-emerald-50/70 shadow-sm"
                    : "border-brand-border bg-white hover:border-brand-primary/40"
                }`}
              >
                <div className="absolute top-0 right-0 bg-brand-accent text-brand-dark text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                  POPULAR
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-brand-dark">Monthly Plan</span>
                  {planType === "monthly" && (
                    <span className="w-2 h-2 rounded-full bg-brand-primary" />
                  )}
                </div>
                <div className="font-serif text-lg font-bold text-brand-primary mt-1">
                  from {formatCurrency(pricing.monthlyPlan.singleMealDaily)}
                </div>
                <p className="text-[11px] text-brand-muted mt-0.5">Target: ₹2,500 – ₹3,500 budget</p>
              </button>
            </div>

            {/* Slot selection */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                Meal Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "lunch", label: "Lunch Only" },
                    { id: "dinner", label: "Dinner Only" },
                    { id: "both", label: "Both (Lunch + Dinner)" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMealSlot(item.id)}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                      mealSlot === item.id
                        ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                        : "bg-white text-brand-dark border-brand-border hover:bg-brand-cream"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Preferred Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  WhatsApp Contact Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                PG Room / Hostel Delivery Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Room 204, Devbhoomi Boys PG, Manduwala, Dehradun"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
              />
            </div>

            {/* Price Summary Card */}
            <div className="p-4 bg-brand-cream/80 rounded-2xl border border-brand-border/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-brand-muted uppercase font-bold tracking-wider">
                  Calculated Amount ({totalMeals} meals)
                </span>
                <div className="font-serif text-2xl font-bold text-brand-primary mt-0.5">
                  {formatCurrency(amount)}
                </div>
                <span className="text-[10px] text-brand-muted">
                  ~{formatCurrency(Math.round(amount / totalMeals))} per meal
                </span>
              </div>
              <div className="text-right text-[11px] text-emerald-800 font-semibold bg-emerald-100/70 px-3 py-1.5 rounded-xl">
                Skip Guarantee Included
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-secondary text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? "Creating Plan..." : "Submit Subscription Request"}</span>
              <Sparkles className="w-4 h-4 text-brand-accent" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

