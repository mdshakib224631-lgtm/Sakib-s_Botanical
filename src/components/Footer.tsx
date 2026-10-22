import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Heart, ArrowRight, Check, Leaf } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  onSelectCategory: (categorySlug: string) => void;
  onOpenAdmin: () => void;
  siteSettings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenAdmin, siteSettings }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#1f1b18] text-[#faf8f5] pt-12 pb-10 border-t border-[#36302c]">
      {/* Minimalist Botanical Trust Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-[#36302c]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#c97a7e]/15 text-[#e8beac] flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-serif-title font-bold text-xs text-[#faf8f5]">100% Botanical</h5>
              <p className="text-[11px] text-[#a89d95]">Pure organic plant actives</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#c97a7e]/15 text-[#e8beac] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-serif-title font-bold text-xs text-[#faf8f5]">Cruelty-Free</h5>
              <p className="text-[11px] text-[#a89d95]">Ethical & vegan formulas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#c97a7e]/15 text-[#e8beac] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-serif-title font-bold text-xs text-[#faf8f5]">Eco Packaging</h5>
              <p className="text-[11px] text-[#a89d95]">Sustainable amber glass</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#c97a7e]/15 text-[#e8beac] flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-serif-title font-bold text-xs text-[#faf8f5]">Artisanal Quality</h5>
              <p className="text-[11px] text-[#a89d95]">Crafted with love & care</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand Info & Newsletter */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c97a7e] inline-block" />
            <span className="font-serif-title text-xl font-bold tracking-tight text-[#faf8f5]">
              {siteSettings.websiteLogoText || "Sakib's"}
            </span>
            {siteSettings.websiteLogoSubtext && (
              <span className="font-serif-title text-xl italic text-[#c97a7e]">
                {siteSettings.websiteLogoSubtext}
              </span>
            )}
          </div>
          <p className="text-xs text-[#a89d95] leading-relaxed max-w-sm">
            {siteSettings.aboutText || 'High-performance organic botanical beauty & skincare formulated with pure natural plant extracts and cold-pressed botanical essences.'}
          </p>

          {/* Clean Newsletter */}
          <div className="pt-2">
            {subscribed ? (
              <div className="p-2.5 bg-[#5c8a68]/20 border border-[#5c8a68]/40 text-[#a3d9b1] text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-[#5c8a68]" />
                <span>ধন্যবাদ! সাবস্ক্রিপশন সম্পন্ন হয়েছে।</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="ইমেইল অ্যাড্রেস লিখুন..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#2c2724] border border-[#4a423d] rounded-full px-4 py-2 text-xs text-[#faf8f5] placeholder-[#8c7e75] outline-none focus:border-[#c97a7e] flex-1"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#c97a7e] hover:bg-[#b0666a] text-white px-4 py-2 rounded-full transition-colors flex items-center justify-center text-xs font-semibold cursor-pointer"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Collections */}
        <div className="md:col-span-3 space-y-3 text-xs">
          <h4 className="font-serif-title font-bold text-xs uppercase tracking-wider text-[#e8beac]">
            Collections
          </h4>
          <ul className="space-y-2 text-[#a89d95]">
            <li>
              <button onClick={() => onSelectCategory('skincare')} className="hover:text-white transition-colors cursor-pointer">
                Nourishing Skincare
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('serums')} className="hover:text-white transition-colors cursor-pointer">
                Botanical Serums & Oils
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('makeup')} className="hover:text-white transition-colors cursor-pointer">
                Clean Mineral Makeup
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('lipcare')} className="hover:text-white transition-colors cursor-pointer">
                Velvet Lip Care & Balms
              </button>
            </li>
          </ul>
        </div>

        {/* Contact & Admin Portal Logo */}
        <div className="md:col-span-4 space-y-3 text-xs">
          <h4 className="font-serif-title font-bold text-xs uppercase tracking-wider text-[#e8beac]">
            Contact & Support
          </h4>
          <ul className="space-y-2 text-[#a89d95]">
            {siteSettings.contactEmail && (
              <li>Email: <a href={`mailto:${siteSettings.contactEmail}`} className="hover:text-white transition-colors">{siteSettings.contactEmail}</a></li>
            )}
            {siteSettings.contactPhone && (
              <li>Phone: <a href={`tel:${siteSettings.contactPhone}`} className="hover:text-white transition-colors">{siteSettings.contactPhone}</a></li>
            )}
            {siteSettings.whatsappNumber && (
              <li>
                WhatsApp: <a href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline font-semibold">
                  {siteSettings.whatsappNumber}
                </a>
              </li>
            )}
          </ul>

          {/* Admin Logo Button - replaces old text "Access Store Admin Portal" */}
          <div className="pt-2">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2a2420] border border-[#3d342e] hover:border-[#c97a7e] text-[#a89d95] hover:text-[#e8beac] transition-all text-xs cursor-pointer group shadow-2xs"
              title="Store Admin Console"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#c97a7e] group-hover:scale-110 transition-transform" />
              <span className="font-serif-title text-[11px] font-bold tracking-wider uppercase">Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-[#36302c] text-center md:flex md:justify-between items-center text-[11px] text-[#8c7e75]">
        <p>{siteSettings.copyrightText || `© 2026 ${siteSettings.websiteName || "Sakib's Botanical"} · All Rights Reserved.`}</p>
        <div className="flex items-center justify-center gap-4 mt-2 md:mt-0">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
          <span className="hover:text-white transition-colors cursor-pointer">Shipping & Returns</span>
        </div>
      </div>
    </footer>
  );
};

