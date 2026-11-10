import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-20 bg-brand-cream/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-border shadow-card space-y-6 text-brand-dark">
            <h1 className="font-serif text-3xl font-bold text-brand-primary">Privacy Policy</h1>
            <p className="text-xs text-brand-muted">Last Updated: Academic Pilot Session, Dehradun</p>

            <div className="space-y-4 text-xs sm:text-sm text-brand-muted leading-relaxed">
              <h3 className="font-bold text-brand-dark">1. Information Collection</h3>
              <p>
                We only collect basic student identification details (Name, College Email, Delivery PG Room, Phone) necessary to fulfill daily meal dispatches.
              </p>

              <h3 className="font-bold text-brand-dark">2. Firebase & OAuth Data</h3>
              <p>
                Google Authentication is secured through Firebase Auth. We never store or transmit sensitive passwords in plain text.
              </p>

              <h3 className="font-bold text-brand-dark">3. Data Sharing</h3>
              <p>
                Student details are shared only with the assigned partner kitchen for order delivery preparation. We do not sell or monetize student data.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

