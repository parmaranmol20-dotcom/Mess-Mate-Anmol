"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BRAND } from "@/lib/constants";
import {
  Sparkles,
  Heart,
  Target,
  ShieldCheck,
  MapPin,
  Utensils,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

export default function AboutUsPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 pt-32 pb-24 bg-brand-cream/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-border text-xs font-semibold text-brand-primary">
              <GraduationCap className="w-4 h-4 text-brand-accent" />
              <span>DGU Venture Quest • Entrepreneurship & Innovation</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-dark leading-tight">
              Good food. Better days.
            </h1>

            <p className="text-base text-brand-muted leading-relaxed">
              MessMate was conceived at DBS Global University by students who intimately experienced the struggle of living in PGs without wholesome, reliable food.
            </p>
          </div>

          {/* Story Card */}
          <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-brand-border shadow-card space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                  The Genesis
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
                  Born from student reality, not corporate spreadsheets.
                </h2>
                <p className="text-sm text-brand-muted leading-relaxed">
                  Every year, thousands of first-year and postgraduate students move to Dehradun for higher education. Most end up in private PGs around Manduwala, Kandoli, and Selaqui where hostel messes don't exist or serve tasteless food on rigid schedules.
                </p>
                <p className="text-sm text-brand-muted leading-relaxed">
                  Food delivery aggregators charge exorbitant surge fees and packaging markups that bleed student pockets. Meanwhile, talented home cooks and aunts living just a street away have empty capacity in their kitchens.
                </p>
              </div>

              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border-4 border-brand-cream shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
                  alt="Traditional Dal Chawal"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-brand-border/60">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-brand-primary flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-brand-dark">Our Mission</h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Make affordable, hygienic, home-style food easily accessible to students living in PGs and rented rooms.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-brand-dark">Fair Pricing</h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Targeted monthly budgets of ₹2,500 – ₹3,500 so no student has to compromise their nutrition for affordability.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-brand-primary flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-brand-dark">Student Autonomy</h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Skip meals anytime before cutoff and roll your credits forward without losing hard-earned student allowances.
                </p>
              </div>
            </div>
          </div>

          {/* Pilot Territory Banner */}
          <div className="bg-brand-primary text-white p-8 sm:p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                Dehradun Campus Pilot
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Currently Serving DBS Global University
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-lg leading-relaxed">
                Covering Manduwala PG corridor, Kandoli hub, Selaqui, and Prem Nagar residences.
              </p>
            </div>

            <Link
              href="/meals"
              className="px-6 py-3.5 rounded-full bg-brand-accent hover:bg-brand-accentDark text-brand-dark font-bold text-xs shadow-md transition-transform active:scale-95 shrink-0"
            >
              Explore Weekly Meals
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

