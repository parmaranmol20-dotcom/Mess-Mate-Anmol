"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Meal } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { MealDetailModal } from "@/components/meals/MealDetailModal";
import { MapPin, Clock, MessageCircle, ArrowUpRight, Sparkles, Utensils, Check } from "lucide-react";

interface MealCardProps {
  meal: Meal;
  compact?: boolean;
}

export function MealCard({ meal, compact = false }: MealCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="group bg-white rounded-3xl overflow-hidden border border-brand-border/80 hover:border-brand-primary/50 shadow-card hover:shadow-cardHover hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative">
        {/* Top Image Banner */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-creamSoft">
          <Image
            src={meal.imageURL}
            alt={meal.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

          {/* Floating Veg / Non-Veg Indicator Badge */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
            <span className="w-3.5 h-3.5 rounded-sm border border-emerald-600 flex items-center justify-center p-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </span>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              {meal.foodType}
            </span>
          </div>

          {/* Demo Data Tag */}
          {meal.isDemo && (
            <div className="absolute top-3.5 right-3.5 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              Demo Menu
            </div>
          )}

          {/* Price Tag Pill */}
          <div className="absolute bottom-3 left-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md text-brand-primary font-bold text-base font-serif flex items-baseline gap-1">
            <span>{formatCurrency(meal.price)}</span>
            <span className="text-[10px] font-sans font-normal text-brand-muted">/meal</span>
          </div>

          {/* Popular Tag */}
          {meal.isPopular && (
            <div className="absolute bottom-3 right-3.5 bg-brand-accent text-brand-dark text-xs font-bold px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Campus Top Pick</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            {/* Kitchen & Location */}
            <div className="flex items-center gap-1.5 text-xs text-brand-muted">
              <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              <span className="truncate font-semibold text-brand-dark/90">{meal.kitchenName}</span>
              <span className="text-brand-muted">•</span>
              <span className="truncate text-brand-muted">{meal.kitchenLocation}</span>
            </div>

            {/* Meal Title */}
            <h3 className="font-serif text-lg font-bold text-brand-dark group-hover:text-brand-primary transition-colors leading-snug">
              {meal.name}
            </h3>

            {/* Description */}
            <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
              {meal.description}
            </p>

            {/* Micro ingredient pills */}
            <div className="flex flex-wrap gap-1 pt-1">
              {meal.ingredients.slice(0, 3).map((ing, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium bg-brand-cream/80 text-brand-dark px-2 py-0.5 rounded-md border border-brand-border/60"
                >
                  {ing}
                </span>
              ))}
              {meal.ingredients.length > 3 && (
                <span className="text-[10px] font-medium text-brand-muted px-1.5 py-0.5">
                  +{meal.ingredients.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Card Footer */}
          <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-[11px] text-brand-muted font-medium capitalize">
              <Clock className="w-3 h-3 text-brand-primary" />
              <span>{meal.mealTiming} slot</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-white bg-emerald-50 hover:bg-brand-primary px-3 py-1.5 rounded-xl border border-emerald-200/80 transition-all duration-200 shadow-xs"
              >
                <span>Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowModal(true)}
                title="Order on WhatsApp"
                className="inline-flex items-center gap-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow transition-all duration-200 active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail & Order Modal */}
      {showModal && (
        <MealDetailModal meal={meal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
