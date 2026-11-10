import React from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { BRAND } from "@/lib/constants";
import { MapPin, Phone, Mail, MessageCircle, Heart, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-12 border-t border-brand-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="inverted" size="lg" showTagline />
            <p className="text-white/70 text-sm leading-relaxed max-w-sm mt-3">
              {BRAND.mission}
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-accent bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl w-fit">
              <MapPin className="w-4 h-4 shrink-0 text-brand-accent" />
              <span>Pilot Location: {BRAND.servingLocation}</span>
            </div>
            <div className="pt-2 flex items-center gap-3 text-xs text-white/50">
              <span className="inline-flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> Made for students
              </span>
              <span>•</span>
              <span>DGU Venture Quest</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-accent">Explore</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/meals" className="hover:text-white transition-colors">
                  Explore Weekly Menu
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Student Meal Plans
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/kitchen-partner" className="hover:text-white transition-colors">
                  Become a Kitchen Partner
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About the DGU Venture
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-accent">Student Hub</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/skip" className="hover:text-white transition-colors">
                  Skip a Meal Policy
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1 text-emerald-300">
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-accent">Campus Support</h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <span className="text-xs text-white/70 leading-snug">
                  DBS Global University Campus & PG Corridor, Manduwala, Dehradun 248007
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-accent shrink-0" />
                <span className="text-xs text-white/80">{BRAND.supportPhone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-accent shrink-0" />
                <span className="text-xs text-white/80">{BRAND.supportEmail}</span>
              </li>
              <li className="flex items-center gap-2.5 pt-1">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918859012345"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium hover:bg-emerald-600/50 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Student Desk</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Pilot Notice */}
        <div className="mt-8 pt-4 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brand-accent shrink-0" />
            <span>
              <strong>DGU Venture Quest Pilot:</strong> Designed for Entrepreneurship & Innovation at DBS Global University. Sample partner kitchens & demonstration metrics are marked for educational prototype evaluation.
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>

        <div className="text-center text-xs text-white/40 pt-4 border-t border-white/5">
          © {new Date().getFullYear()} MessMate Inc. All rights reserved. Dehradun, Uttarakhand, India.
        </div>
      </div>
    </footer>
  );
}

