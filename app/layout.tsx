import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: "MessMate | Good food. Better days. (DGU Venture Quest)",
  description:
    "Fresh, hygienic, home-style food made affordable for college students in PGs and rented rooms near DBS Global University, Dehradun.",
  keywords: [
    "MessMate",
    "DBS Global University",
    "student tiffin service Dehradun",
    "PG food delivery Dehradun",
    "home style meals for students",
    "affordable student thali",
    "DGU Venture Quest",
  ],
  authors: [{ name: "MessMate Student Venture Team" }],
  openGraph: {
    title: "MessMate — Good food. Better days.",
    description: "Affordable, hygienic, home-style food for students living in PGs in Dehradun.",
    siteName: "MessMate",
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#174F38",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-brand-cream text-brand-dark flex flex-col font-sans antialiased selection:bg-brand-primary selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
