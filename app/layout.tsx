import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { AuthProvider } from "@/lib/supabase/auth-context";
import { ListingsProvider } from "@/lib/listings-context";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

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
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full bg-[#EFECE8] text-[#1B1C1C] font-sans antialiased flex flex-col justify-center items-center">
        <ClerkProvider>
          <AuthProvider>
            <ListingsProvider>
              <WishlistProvider>
                <CartProvider>
                  <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto min-h-screen bg-[#FBF9F8] shadow-2xl relative flex flex-col overflow-[#E4E2E1]/50">
                    <Navbar />
                    <main className="flex-1 w-full flex flex-col pb-20">{children}</main>
                    <BottomNav />
                  </div>
                </CartProvider>
              </WishlistProvider>
            </ListingsProvider>
          </AuthProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
