"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { SkipRequest, Subscription } from "@/types";
import {
  getUserSubscription,
  getUserSkipRequests,
  createSkipRequest,
} from "@/services/dataService";
import { SKIP_POLICY } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Plus,
  RefreshCw,
  Sun,
  Moon,
} from "lucide-react";

export function SkipMealManager() {
  const { profile } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [skipHistory, setSkipHistory] = useState<SkipRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return tomorrow.toISOString().split("T")[0];
  });
  const [mealSlot, setMealSlot] = useState<"lunch" | "dinner">("lunch");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadData = async () => {
    if (!profile) return;
    setLoading(true);
    const sub = await getUserSubscription(profile.uid);
    const skips = await getUserSkipRequests(profile.uid);
    setSubscription(sub);
    setSkipHistory(skips);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [profile]);

  const handleSkipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSubmitting(true);
    setFeedback(null);

    // Check cutoff time if user selects today
    const todayStr = new Date().toISOString().split("T")[0];
    if (selectedDate === todayStr) {
      const currentHour = new Date().getHours();
      if (mealSlot === "lunch" && currentHour >= SKIP_POLICY.lunchCutoffHour) {
        setIsSubmitting(false);
        setFeedback({
          type: "error",
          message: `Cutoff passed! Lunch skip requests for today must be submitted before ${SKIP_POLICY.lunchCutoffText}.`,
        });
        return;
      }
      if (mealSlot === "dinner" && currentHour >= SKIP_POLICY.dinnerCutoffHour) {
        setIsSubmitting(false);
        setFeedback({
          type: "error",
          message: `Cutoff passed! Dinner skip requests for today must be submitted before ${SKIP_POLICY.dinnerCutoffText}.`,
        });
        return;
      }
    }

    const res = await createSkipRequest({
      userId: profile.uid,
      userName: profile.name,
      userEmail: profile.email,
      subscriptionId: subscription?.id,
      date: selectedDate,
      mealType: mealSlot,
      reason: reason || "Student schedule adjustment",
    });

    setIsSubmitting(false);

    if (res.success && res.request) {
      setFeedback({
        type: "success",
        message: `Meal skip confirmed for ${formatDate(selectedDate)} (${mealSlot.toUpperCase()}). Your meal credit has been saved and your plan validity is automatically extended!`,
      });
      setReason("");
      loadData();
    } else {
      setFeedback({
        type: "error",
        message: res.error || "Failed to submit skip request.",
      });
    }
  };

  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return (
    <div className="space-y-6">
      {/* Policy Banner */}
      <div className="p-4 sm:p-5 bg-emerald-50/80 rounded-3xl border border-emerald-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-100 rounded-2xl text-emerald-800 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-base font-bold text-emerald-950">
              Fair-Use Skip-a-Meal Policy
            </h4>
            <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
              Going home for the weekend or have college fests? Skip your meal before the cutoff:{" "}
              <strong>Lunch cutoff: 9:00 AM</strong> | <strong>Dinner cutoff: 4:00 PM</strong>.
              Your meal credit rolls forward automatically!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skip Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-brand-border shadow-card">
          <h3 className="font-serif text-xl font-bold text-brand-primary flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-brand-accent" />
            <span>Schedule a Meal Skip</span>
          </h3>
          <p className="text-xs text-brand-muted mt-1">
            Select the date and meal slot you would like to pause.
          </p>

          <form onSubmit={handleSkipSubmit} className="mt-5 space-y-4">
            {/* Date Picker */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Select Date
              </label>
              <input
                type="date"
                required
                min={minDate}
                max={maxDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
              />
            </div>

            {/* Meal Slot */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Select Meal Slot
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMealSlot("lunch")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    mealSlot === "lunch"
                      ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                      : "bg-white text-brand-dark border-brand-border hover:bg-brand-cream"
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span>Lunch (Cutoff 9 AM)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMealSlot("dinner")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    mealSlot === "dinner"
                      ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                      : "bg-white text-brand-dark border-brand-border hover:bg-brand-cream"
                  }`}
                >
                  <Moon className="w-4 h-4 text-blue-200" />
                  <span>Dinner (Cutoff 4 PM)</span>
                </button>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Reason (Optional)
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Traveling home, DBS Fest, eating out"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
              />
            </div>

            {/* Feedback Message */}
            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-semibold text-xs shadow-md hover:shadow transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Processing..." : "Confirm Skip Request"}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Skip History & Plan Extension Ledger */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-brand-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
              <h3 className="font-serif text-lg font-bold text-brand-dark flex items-center gap-2">
                <span>Your Skip Ledger</span>
                <span className="text-xs font-sans font-normal px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {skipHistory.length} recorded
                </span>
              </h3>
              <button
                onClick={loadData}
                title="Refresh"
                className="p-1.5 text-brand-muted hover:text-brand-dark rounded-lg hover:bg-black/5"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {skipHistory.length === 0 ? (
                <div className="text-center py-10 text-brand-muted text-xs">
                  No upcoming meal skips scheduled. All your daily meals will be delivered on time!
                </div>
              ) : (
                skipHistory.map((skip) => (
                  <div
                    key={skip.id}
                    className="p-3.5 rounded-2xl border border-brand-border/80 bg-brand-cream/30 hover:bg-brand-cream/60 transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-brand-dark">
                          {formatDate(skip.date)}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {skip.mealType}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-muted">
                        {skip.reason || "Scheduled skip"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Credit Rolled</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Plan validity footnote */}
          {subscription && (
            <div className="mt-4 pt-3 border-t border-brand-border/60 text-[11px] text-brand-muted flex items-center justify-between">
              <span>Active Plan: <strong>{subscription.planType.toUpperCase()}</strong></span>
              <span>Valid till: <strong>{formatDate(subscription.endDate)}</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

