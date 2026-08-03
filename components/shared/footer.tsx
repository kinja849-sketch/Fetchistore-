import React from "react";
import Link from "next/link";
import { Globe, MessageCircle, AtSign } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1 */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-widest text-white">FETCHISTORE</h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your premier destination for high-quality, curated products. We believe in exceptional design and unparalleled quality.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <Globe size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <AtSign size={20} />
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="text-sm text-gray-400 hover:text-white transition-colors">Shop</Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-400 hover:text-white transition-colors">Careers</Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-sm text-gray-400 hover:text-white transition-colors">Help Center</Link>
              </li>
              <li>
                <Link href="/delivery" className="text-sm text-gray-400 hover:text-white transition-colors">Delivery Info</Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-gray-400 hover:text-white transition-colors">Returns</Link>
              </li>
              <li>
                <Link href="/faqs" className="text-sm text-gray-400 hover:text-white transition-colors">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Get on the List</h3>
            <p className="text-sm text-gray-400 mb-4">
              Sign up for updates on new arrivals, special offers, and events.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-surface-dark border border-gray-600 text-white px-4 py-2 text-sm focus:outline-none focus:border-white transition-colors"
                required
              />
              <button
                type="submit"
                className="w-full bg-brand hover:bg-brand-dark text-white font-medium px-4 py-2 text-sm transition-colors"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-xs text-gray-500">
            <p>© 2026 Fetchistore</p>
            <div className="flex space-x-4">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            </div>
            <p>Powered by Next.js</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
