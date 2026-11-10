"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MealCard } from "@/components/meals/MealCard";
import { getMeals, getKitchens } from "@/services/dataService";
import { Meal, MealCategory, FoodType, Kitchen } from "@/types";
import { Search, Filter, Sparkles, MapPin, ChefHat, RotateCcw, Clock, Utensils } from "lucide-react";

export default function MealsMarketplacePage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedKitchen, setSelectedKitchen] = useState<string>("all");
  const [foodTypeFilter, setFoodTypeFilter] = useState<"all" | FoodType>("all");
  const [timingFilter, setTimingFilter] = useState<"all" | "lunch" | "dinner">("all");
  const [priceRange, setPriceRange] = useState<"all" | "under100" | "100plus">("all");

  useEffect(() => {
    Promise.all([getMeals(), getKitchens()]).then(([m, k]) => {
      setMeals(m);
      setKitchens(k);
      setLoading(false);
    });
  }, []);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "thali", label: "Homestyle Thalis" },
    { id: "dal_rice", label: "Dal & Rice" },
    { id: "combo", label: "Combos" },
    { id: "healthy", label: "Light & Healthy" },
  ];

  // Filtering Logic
  const filteredMeals = meals.filter((meal) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = meal.name.toLowerCase().includes(q);
      const matchDesc = meal.description.toLowerCase().includes(q);
      const matchKitchen = meal.kitchenName.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchKitchen) return false;
    }

    // Category
    if (selectedCategory !== "all" && meal.category !== selectedCategory) {
      return false;
    }

    // Kitchen Partner
    if (selectedKitchen !== "all" && meal.kitchenId !== selectedKitchen) {
      return false;
    }

    // Food Type
    if (foodTypeFilter !== "all" && meal.foodType !== foodTypeFilter) {
      return false;
    }

    // Timing
    if (timingFilter !== "all") {
      if (meal.mealTiming !== "both" && meal.mealTiming !== timingFilter) {
        return false;
      }
    }

    // Price
    if (priceRange === "under100" && meal.price >= 100) return false;
    if (priceRange === "100plus" && meal.price < 100) return false;

    return true;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedKitchen("all");
    setFoodTypeFilter("all");
    setTimingFilter("all");
    setPriceRange("all");
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 pt-24 pb-20 bg-brand-cream/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Marketplace Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-border text-xs font-semibold text-brand-primary shadow-xs">
              <ChefHat className="w-3.5 h-3.5 text-brand-accent" />
              <span>Campus Kitchen Marketplace • DBS Dehradun Pilot</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark">
              Explore Everyday Meals
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              Wholesome home-cooked food prepared fresh daily by registered neighborhood kitchens near DBS Global University.
            </p>
          </div>

          {/* Campus Timing & Live Kitchens Banner */}
          <div className="mb-6 p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="text-emerald-950">
                <strong>Campus Delivery Windows:</strong> Lunch drops at <strong>12:30 PM</strong> | Dinner drops at <strong>8:00 PM</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>3 Verified Kitchens Cooking Today</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-brand-border shadow-card mb-8 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search meals, ingredients, or partner kitchens (e.g., Rajma, Thali, Manduwala)..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-brand-cream/40 border border-brand-border text-xs sm:text-sm text-brand-dark placeholder:text-brand-muted focus:outline-brand-primary focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-muted hover:text-brand-dark"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-brand-border/60">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === cat.id
                        ? "bg-brand-primary text-white shadow-xs"
                        : "bg-brand-cream/80 text-brand-dark hover:bg-brand-cream"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Advanced Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Kitchen Filter */}
                <select
                  value={selectedKitchen}
                  onChange={(e) => setSelectedKitchen(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-brand-border bg-white text-brand-dark font-medium focus:outline-brand-primary"
                >
                  <option value="all">Kitchen: All Partners</option>
                  {kitchens.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name}
                    </option>
                  ))}
                </select>

                {/* Veg Filter */}
                <select
                  value={foodTypeFilter}
                  onChange={(e) => setFoodTypeFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-brand-border bg-white text-brand-dark font-medium focus:outline-brand-primary"
                >
                  <option value="all">Diet: All</option>
                  <option value="veg">Pure Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>

                {/* Timing Slot */}
                <select
                  value={timingFilter}
                  onChange={(e) => setTimingFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-brand-border bg-white text-brand-dark font-medium focus:outline-brand-primary"
                >
                  <option value="all">Slot: All Timings</option>
                  <option value="lunch">Lunch Only</option>
                  <option value="dinner">Dinner Only</option>
                </select>

                {/* Price Filter */}
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-brand-border bg-white text-brand-dark font-medium focus:outline-brand-primary"
                >
                  <option value="all">Price: All</option>
                  <option value="under100">Under ₹100</option>
                  <option value="100plus">₹100 & Above</option>
                </select>

                <button
                  onClick={resetFilters}
                  title="Reset filters"
                  className="p-1.5 rounded-xl border border-brand-border hover:bg-brand-cream text-brand-muted hover:text-brand-dark transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Counter & Demo Notice */}
          <div className="flex items-center justify-between text-xs text-brand-muted mb-6 px-1">
            <span>
              Showing <strong>{filteredMeals.length}</strong> homestyle meals
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Pilot Menu Data
            </span>
          </div>

          {/* Meals Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl h-80 border border-brand-border" />
              ))}
            </div>
          ) : filteredMeals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-brand-border p-8 space-y-4">
              <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mx-auto text-brand-muted">
                <ChefHat className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-dark">No meals matched your filters</h3>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Try loosening your filters or searching for another dish like Rajma, Chole, or Thali.
              </p>
              <button
                onClick={resetFilters}
                className="btn-primary px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
