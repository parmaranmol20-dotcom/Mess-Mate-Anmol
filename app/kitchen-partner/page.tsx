"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { submitPartnerApplication } from "@/services/dataService";
import {
  ChefHat,
  CheckCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Heart,
  Sparkles,
  AlertCircle,
  MapPin,
  Utensils,
  ArrowRight,
} from "lucide-react";

export default function KitchenPartnerPage() {
  const [ownerName, setOwnerName] = useState("");
  const [kitchenName, setKitchenName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [kitchenAddress, setKitchenAddress] = useState("");
  const [foodCategory, setFoodCategory] = useState("North Indian Homestyle");
  const [operatingHours, setOperatingHours] = useState("11:00 AM – 3:30 PM & 6:30 PM – 10:00 PM");
  const [description, setDescription] = useState("");
  const [fssaiNumber, setFssaiNumber] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      await submitPartnerApplication({
        ownerName,
        kitchenName,
        phone,
        email,
        kitchenAddress,
        foodCategory,
        operatingHours,
        description,
        fssaiNumber: fssaiNumber || undefined,
        kitchenPhotos: photoUrl ? [photoUrl] : undefined,
      });

      setSubmitting(false);
      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitting(false);
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit application");
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 pt-28 pb-20 bg-brand-cream/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-border text-xs font-semibold text-brand-primary">
                <ChefHat className="w-3.5 h-3.5 text-brand-accent" />
                <span>Empowering Dehradun Home Cooks & Mess Owners</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark leading-tight">
                Cook with passion.<br />
                <span className="text-brand-primary">Grow with MessMate.</span>
              </h1>

              <p className="text-sm sm:text-base text-brand-muted leading-relaxed max-w-xl">
                Turn your home cooking skills or local mess into a predictable, high-volume business.
                We connect you directly to college students at DBS Global University and nearby PGs who crave clean, authentic ghar-ka-khana.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded-2xl border border-brand-border">
                  <TrendingUp className="w-4 h-4 text-brand-primary mb-1" />
                  <span className="font-bold text-brand-dark block">Steady Subscriptions</span>
                  <span className="text-brand-muted">Guaranteed daily meal counts</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-brand-border">
                  <ShieldCheck className="w-4 h-4 text-brand-primary mb-1" />
                  <span className="font-bold text-brand-dark block">Zero Tech Friction</span>
                  <span className="text-brand-muted">Simple WhatsApp dispatch</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-brand-border">
                  <Heart className="w-4 h-4 text-brand-primary mb-1" />
                  <span className="font-bold text-brand-dark block">Keep Fair Share</span>
                  <span className="text-brand-muted">No 30% delivery commission cuts</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80"
                  alt="Kitchen Partner Cooking Fresh Food"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-bold text-sm block">Annapurna Rasoi, Manduwala</span>
                  <span className="text-xs text-white/80">Serving 45+ DBS students daily</span>
                </div>
              </div>
            </div>
          </div>

          {/* Partnership Model Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[
              {
                step: "1. Apply Online",
                desc: "Fill the partnership form below with your kitchen details and specialty dishes.",
              },
              {
                step: "2. Tasting & Verification",
                desc: "Our student committee conducts an in-person taste trial and basic hygiene audit.",
              },
              {
                step: "3. Campus Onboarding",
                desc: "Your kitchen is listed on the MessMate marketplace for students across Manduwala & Kandoli.",
              },
              {
                step: "4. Receive Regular Orders",
                desc: "Daily pre-scheduled meal batches dispatched smoothly via WhatsApp alerts.",
              },
            ].map((p, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-brand-border shadow-xs space-y-2">
                <span className="text-xs font-bold text-brand-accent uppercase tracking-wider block">
                  Step 0{idx + 1}
                </span>
                <h3 className="font-serif text-base font-bold text-brand-dark">{p.step}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Partner Registration Form */}
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-card">
            {submitted ? (
              <div className="text-center py-10 space-y-5 animate-in zoom-in-95">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-brand-primary">
                    Application Submitted Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
                    Thank you for applying to become a MessMate kitchen partner. Your application has been logged with status <strong>Pending Verification</strong>.
                    Our campus coordinator will call your phone (<strong>{phone}</strong>) within 24 hours to schedule the initial sample tasting.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 max-w-md mx-auto">
                  <strong>Notice:</strong> Per our student safety policy, no kitchen is listed publicly until kitchen hygiene and sample food tasting are formally approved by campus administrators.
                </div>

                <div className="pt-3">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-primary text-white font-semibold text-xs shadow-md"
                  >
                    <span>Return to Homepage</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                    Register Your Kitchen
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
                    Partner Application Form
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    All partner kitchens must be located in Dehradun within delivery reach of DBS Global University campuses.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1">
                      Owner / Cook Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Sunita Rawat"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1">
                      Kitchen / Mess Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={kitchenName}
                      onChange={(e) => setKitchenName(e.target.value)}
                      placeholder="e.g. Annapurna Homestyle Kitchen"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1">
                      Contact Phone (WhatsApp Enabled) *
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

                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="cook@gmail.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Kitchen Address & Landmarks in Dehradun *
                  </label>
                  <input
                    type="text"
                    required
                    value={kitchenAddress}
                    onChange={(e) => setKitchenAddress(e.target.value)}
                    placeholder="e.g. Lane 3, Manduwala, Near DBS Gate 2, Dehradun 248007"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1">
                      Primary Food Category
                    </label>
                    <select
                      value={foodCategory}
                      onChange={(e) => setFoodCategory(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                    >
                      <option value="North Indian Homestyle">North Indian Homestyle</option>
                      <option value="Thalis & Dal Rice Special">Thalis & Dal Rice Special</option>
                      <option value="Regional Pahaadi Ghar ka Khana">Regional Pahaadi Ghar ka Khana</option>
                      <option value="Pure Vegetarian Sattvik">Pure Vegetarian Sattvik</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1">
                      Operating Delivery Slots
                    </label>
                    <input
                      type="text"
                      value={operatingHours}
                      onChange={(e) => setOperatingHours(e.target.value)}
                      placeholder="e.g. 11 AM - 3 PM & 7 PM - 10 PM"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Kitchen Specialty & Hygiene Background *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about the ingredients you use, oil types, how many meals you can comfortably prepare daily, etc."
                    className="w-full text-xs p-3.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1">
                      FSSAI Registration No. (If available)
                    </label>
                    <input
                      type="text"
                      value={fssaiNumber}
                      onChange={(e) => setFssaiNumber(e.target.value)}
                      placeholder="e.g. FSSAI-2024-XXXX"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1">
                      Kitchen Photo URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark focus:outline-brand-primary"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-secondary text-white font-semibold text-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {submitting ? "Submitting Application..." : "Submit Partner Application"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

