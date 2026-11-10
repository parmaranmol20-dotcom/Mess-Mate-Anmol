"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Meal } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { triggerWhatsAppOrder } from "@/services/whatsappService";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  MapPin,
  Clock,
  Utensils,
  CheckCircle,
  MessageCircle,
  AlertCircle,
  Calendar,
  Sparkles,
} from "lucide-react";

interface MealDetailModalProps {
  meal: Meal | null;
  onClose: () => void;
}

export function MealDetailModal({ meal, onClose }: MealDetailModalProps) {
  const { profile, loginAsDemo } = useAuth();
  const [quantity, setQuantity] = useState<number>(1);
  const [mealSlot, setMealSlot] = useState<"lunch" | "dinner">(
    meal?.mealTiming === "dinner" ? "dinner" : "lunch"
  );
  const [preferredDate, setPreferredDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [address, setAddress] = useState<string>(
    profile?.pgAddress || "Manduwala PG Corridor, Room No. (specify)"
  );
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  if (!meal) return null;

  const totalAmount = meal.price * quantity;

  const handleWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    // If user is not logged in, prompt or create temporary guest student session
    const currentUserName = profile?.name || "Student Guest";
    const currentUserId = profile?.uid || "guest-" + Date.now();
    const currentUserPhone = profile?.phone || "";

    const res = await triggerWhatsAppOrder({
      userId: currentUserId,
      userName: currentUserName,
      userPhone: currentUserPhone,
      mealId: meal.id,
      mealName: meal.name,
      kitchenId: meal.kitchenId,
      kitchenName: meal.kitchenName,
      quantity,
      pricePerMeal: meal.price,
      preferredDate,
      mealType: mealSlot,
      deliveryAddress: address,
      notes,
    });

    setIsSubmitting(false);

    if (res.success && res.url) {
      setStatusMessage({
        type: "success",
        text: "Enquiry stored in database! Redirecting to WhatsApp...",
      });
      // Small pause to allow visual feedback, then open WhatsApp in a new tab
      setTimeout(() => {
        window.open(res.url, "_blank");
      }, 700);
    } else {
      setStatusMessage({
        type: "error",
        text: res.error || "Failed to generate WhatsApp order.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-brand-border">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white text-brand-dark rounded-full shadow-md transition-transform hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-brand-creamSoft">
          <Image
            src={meal.imageURL}
            alt={meal.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badges over image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {meal.foodType === "veg" ? "100% Pure Vegetarian" : "Non-Vegetarian"}
            </span>
            {meal.isDemo && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/90 text-white shadow-sm">
                Demonstration Menu
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              {meal.name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-white/90 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                {meal.kitchenName} ({meal.kitchenLocation})
              </span>
              <span>•</span>
              <span className="text-brand-accent font-bold text-lg">
                {formatCurrency(meal.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
              About This Homestyle Meal
            </h4>
            <p className="text-brand-dark text-sm leading-relaxed">{meal.description}</p>
          </div>

          {/* Portion Info & Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-brand-cream/60 rounded-2xl border border-brand-border/60 text-xs">
            <div className="flex items-start gap-2.5">
              <Utensils className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-brand-dark block">Portion Standard:</span>
                <span className="text-brand-muted">{meal.portionInfo}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-brand-dark block">Available Slot:</span>
                <span className="text-brand-muted capitalize">
                  {meal.mealTiming === "both" ? "Lunch (12–2:30 PM) & Dinner (7:30–9:45 PM)" : meal.mealTiming}
                </span>
              </div>
            </div>
          </div>

          {/* Fresh Ingredients */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
              Kitchen Ingredients
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {meal.ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white border border-brand-border text-xs rounded-lg text-brand-dark font-medium"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* WhatsApp Direct Order Form */}
          <form onSubmit={handleWhatsAppOrder} className="pt-4 border-t border-brand-border space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-lg font-bold text-brand-primary flex items-center gap-2">
                <span>Instant Order via WhatsApp</span>
                <Sparkles className="w-4 h-4 text-brand-accent" />
              </h4>
              <span className="text-xs text-brand-muted">Direct to kitchen partner</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Quantity
                </label>
                <div className="flex items-center border border-brand-border rounded-xl overflow-hidden bg-brand-cream/40">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-brand-dark hover:bg-black/5 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-sm text-brand-dark">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="px-3 py-2 text-brand-dark hover:bg-black/5 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Slot */}
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Meal Slot
                </label>
                <select
                  value={mealSlot}
                  onChange={(e) => setMealSlot(e.target.value as "lunch" | "dinner")}
                  className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                >
                  <option value="lunch">Lunch (12:00 – 2:30 PM)</option>
                  <option value="dinner">Dinner (7:30 – 9:45 PM)</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Delivery Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Room & PG / Hostel Address (Dehradun Pilot)
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Room 204, Devbhoomi PG, Manduwala / DBS Campus Gate"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
              />
            </div>

            {/* Special notes */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Low spice, extra salad, deliver before 1:15 PM"
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
              />
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  statusMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-[11px] text-brand-muted block">Total Payable</span>
                <span className="font-serif text-2xl font-bold text-brand-primary">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                <span>{isSubmitting ? "Generating..." : "Order through WhatsApp"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

