import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { AuthProvider } from "@/lib/supabase/auth-context";
import { ListingsProvider } from "@/lib/listings-context";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { UserSync } from "@/components/shared/user-sync";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Fetchistore — New & Pre-loved, Delivered to Your Door",
  description:
    "Shop new and second-hand goods from sellers near you. Proximity-first discovery, seller-to-door delivery, live tracking, and flexible payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${manrope.variable} h-full antialiased`}>
        <head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          />
        </head>
        <body className="min-h-full bg-[#FBF9F8] text-[#1B1C1C] font-sans antialiased flex flex-col overflow-x-hidden max-w-full">
          <AuthProvider>
            <UserSync />
            <ListingsProvider>
              <WishlistProvider>
                <CartProvider>
                  <div className="w-full max-w-7xl mx-auto min-h-screen bg-[#FBF9F8] relative flex flex-col shadow-xs overflow-x-hidden min-w-0">
                    {/* Persistent Cart Landing Anchor (Fallback positioned at top header cart location) */}
                    <div id="cart-fly-target-header" className="fixed top-3 right-12 w-8 h-8 pointer-events-none z-0 opacity-0" aria-hidden="true" />

                    <Navbar />
                    <main className="flex-1 w-full flex flex-col pb-24 md:pb-8 min-w-0 overflow-x-hidden">{children}</main>
                    <BottomNav />
                  </div>
                </CartProvider>
              </WishlistProvider>
            </ListingsProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
