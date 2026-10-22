import React, { useState } from 'react';
import { X, Lock, Mail, Eye, EyeOff, ChevronRight, AlertCircle } from 'lucide-react';
import { SiteSettings } from '../types';

import pandaNormal from '../assets/images/panda_normal_avatar_1786284749822.jpg';
import pandaCoverEyes from '../assets/images/panda_cover_eyes_avatar_1786284762253.jpg';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteSettings: SiteSettings;
  onLogin: (email: string, pass: string) => boolean;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  siteSettings,
  onLogin,
  onSuccess,
}) => {
  const [loginEmail, setLoginEmail] = useState(siteSettings.adminEmail || 'mdshakib224631@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  // Eyes should be covered if password input is focused or being typed, UNLESS showPassword (peek mode) is enabled
  const isEyesClosed = (isPasswordFocused || loginPassword.length > 0) && !showPassword;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = onLogin(loginEmail.trim(), loginPassword);
    if (!success) {
      setLoginError('Invalid Email Address or Password. Please check your credentials and try again.');
    } else {
      setLoginPassword('');
      onSuccess();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#faf8f5] w-full max-w-md rounded-3xl border border-[#e8ded5] shadow-2xl overflow-hidden relative p-6 sm:p-8 space-y-5 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8c7e75] hover:text-[#2c2724] hover:bg-[#f0e8e1] rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Premium Realistic Panda Avatar Container */}
        <div className="relative w-32 h-32 mx-auto mt-2 flex items-center justify-center">
          {/* Subtle Glow Ring */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#c97a7e]/40 via-[#e8beac]/40 to-[#2c2724]/40 rounded-full blur-md opacity-75 animate-pulse"></div>

          {/* Avatar Image Frame */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#faf8f5] shadow-xl relative bg-[#2c2724]">
            {/* Normal Looking Panda */}
            <img
              src={pandaNormal}
              alt="Security Panda Avatar"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-300 transform ${
                isEyesClosed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            />

            {/* Panda Covering Eyes with Both Hands */}
            <img
              src={pandaCoverEyes}
              alt="Panda Covering Eyes"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover absolute inset-0 transition-all duration-300 transform ${
                isEyesClosed ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            />
          </div>
        </div>

        {/* Header Text */}
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#c97a7e]">
            Restricted Admin Portal
          </span>
          <h2 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#2c2724] mt-1">
            Store Admin Sign In
          </h2>
          <p className="text-xs text-[#70645c] mt-1.5">
            Enter your administrator credentials to manage store settings & catalog.
          </p>
        </div>

        {/* Error Alert */}
        {loginError && (
          <div className="bg-[#f8e2e2] text-[#a84343] p-3 rounded-2xl text-xs flex items-center gap-2 border border-[#a84343]/20 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-[#2c2724] mb-1">
              User ID / Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8c7e75] absolute left-3.5 top-3" />
              <input
                type="email"
                value={loginEmail}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-white border border-[#d8c8bd] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#2c2724] outline-none focus:border-[#c97a7e] focus:ring-1 focus:ring-[#c97a7e]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2c2724] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8c7e75] absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white border border-[#d8c8bd] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#2c2724] outline-none focus:border-[#c97a7e] focus:ring-1 focus:ring-[#c97a7e]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#8c7e75] hover:text-[#2c2724] transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2c2724] hover:bg-[#c97a7e] text-white font-semibold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <span>Log In & Go To Admin Web Page</span>
            <ChevronRight className="w-4 h-4 text-[#e8beac]" />
          </button>
        </form>

      </div>
    </div>
  );
};

