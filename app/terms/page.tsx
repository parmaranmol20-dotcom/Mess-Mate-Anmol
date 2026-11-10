import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-20 bg-brand-cream/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-border shadow-card space-y-6 text-brand-dark">
            <h1 className="font-serif text-3xl font-bold text-brand-primary">Terms of Service</h1>
            <p className="text-xs text-brand-muted">Last Updated: Academic Pilot Session, Dehradun</p>

            <div className="space-y-4 text-xs sm:text-sm text-brand-muted leading-relaxed">
              <h3 className="font-bold text-brand-dark">1. DGU Venture Quest Pilot</h3>
              <p>
                MessMate is operated as a student-led entrepreneurial initiative for students of DBS Global University and surrounding PG clusters in Dehradun.
              </p>

              <h3 className="font-bold text-brand-dark">2. Skip-a-Meal Policy</h3>
              <p>
                Meal skip requests must be submitted through the MessMate dashboard prior to scheduled cutoff hours (9:00 AM for lunch, 4:00 PM for dinner). Timely submitted skips roll meal credits forward to extend validity dates.
              </p>

              <h3 className="font-bold text-brand-dark">3. WhatsApp Order Enquiries</h3>
              <p>
                Orders initiated on MessMate are coordinated and verified directly via WhatsApp with our student campus desk and partnered neighborhood kitchens.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

