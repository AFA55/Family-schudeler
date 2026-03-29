"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-coral-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-display font-bold text-xl text-neutral-900">
              Family<span className="text-primary-500">Sync</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
              How It Works
            </a>
            <a href="#impact" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
              Our Impact
            </a>
            <a href="#pricing" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
              Pricing
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button variant="primary" size="sm">
              Start Free Trial
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-neutral-100 mt-2 pt-4 space-y-3">
            <a href="#features" className="block text-neutral-600 hover:text-neutral-900 text-sm font-medium py-1">
              Features
            </a>
            <a href="#how-it-works" className="block text-neutral-600 hover:text-neutral-900 text-sm font-medium py-1">
              How It Works
            </a>
            <a href="#impact" className="block text-neutral-600 hover:text-neutral-900 text-sm font-medium py-1">
              Our Impact
            </a>
            <a href="#pricing" className="block text-neutral-600 hover:text-neutral-900 text-sm font-medium py-1">
              Pricing
            </a>
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button variant="primary" size="sm">Start Free Trial</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
