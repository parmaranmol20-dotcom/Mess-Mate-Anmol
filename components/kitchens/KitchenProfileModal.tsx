"use client";

import React from "react";
import Image from "next/image";
import { Kitchen, Meal } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  ChefHat,
  Phone,
  Utensils,
  CheckCircle,
  MessageCircle,
} from "lucide-react";

interface KitchenProfileModalProps {
  kitchen: Kitchen | null;
  meals: Meal[];
  onClose: () => void;
  onSelectMeal?: (meal: Meal) => void;
}

export function KitchenProfileModal({
  kitchen,
  meals,
  onClose,
  onSelectMeal,
}: KitchenProfileModalProps) {
  if (!kitchen) return null;

  const kitchenMeals = meals.filter((m) => m.kitchenId === kitchen.id || m.kitchenName === kitchen.name);

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

        {/* Header Banner */}
        <div className="relative h-48 w-full bg-brand-primary p-6 text-white flex flex-col justify-end">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary opacity-90" />
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md text-brand-accent flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Campus Kitchen</span>
              </span>
              {kitchen.rating && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-white flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  <span>{kitchen.rating} / 5.0</span>
                </span>
              )}
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold">{kitchen.name}</h3>

            <p className="text-xs text-emerald-100 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              <span>{kitchen.address}</span>
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* About The Cook */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              About the Cook & Kitchen
            </h4>
            <p className="text-sm text-brand-dark leading-relaxed">{kitchen.description}</p>
          </div>

          {/* Operational Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-4 bg-brand-cream/60 rounded-2xl border border-brand-border/80">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-brand-dark block">Dispatch Slots:</span>
                <span className="text-brand-muted">{kitchen.operatingHours}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-brand-dark block">Hygiene & Compliance:</span>
                <span className="text-brand-muted">{kitchen.fssaiNumber || "Campus Audit Verified"}</span>
              </div>
            </div>
          </div>

          {/* Meals Cooked by this Kitchen */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                Fresh Homestyle Meals by this Kitchen ({kitchenMeals.length})
              </h4>
              <span className="text-[11px] text-emerald-800 font-semibold">100% Home Cooked</span>
            </div>

            <div className="space-y-2.5">
              {kitchenMeals.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl border border-brand-border bg-white hover:bg-brand-cream/30 flex items-center justify-between gap-3 transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-cream shrink-0">
                      <Image src={m.imageURL} alt={m.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs text-brand-dark truncate">{m.name}</h5>
                      <span className="text-[11px] text-brand-muted block truncate">
                        {m.portionInfo}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-serif font-bold text-sm text-brand-primary">
                      {formatCurrency(m.price)}
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectMeal) onSelectMeal(m);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Order</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

