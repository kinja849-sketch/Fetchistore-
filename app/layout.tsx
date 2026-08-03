import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fetchistore — New & Pre-loved, Delivered to Your Door",
  description:
    "Shop new and second-hand goods from sellers near you. Proximity-first discovery, seller-to-door delivery, live tracking, and flexible payments.",
};

import { CartProvider } from "@/lib/cart-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        <ClerkProvider>
          <CartProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
            <BottomNav />
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
