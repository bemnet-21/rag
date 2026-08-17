'use client'

import { login } from '@/services/auth.service';
import { setUser } from '@/store/slices/auth.slice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

const LoginPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()  
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (email: string, password: string) => {
    try {
        const res = await login(email, password)
        const user = res.data.user
        const token = res.data.token
        localStorage.setItem("token", token)
        dispatch(setUser({user, token}))
        router.replace('/')
    } catch(err) {
        console.error("Login Error", err)
    }
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(formData.email, formData.password)

  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-walnut p-4 relative overflow-hidden">
      
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23B59A5F\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
      
      {/* Card Container */}
      <div className="relative bg-parchment shadow-2xl rounded-sm flex flex-col w-full max-w-md p-8 md:p-10 border border-brass/30">
        
        {/* Brass top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brass to-transparent"></div>
        
        {/* Header */}
        <div className="mb-8 text-center">
          {/* Gear Logo */}
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-brass" stroke="currentColor" strokeWidth="1.25">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-forest mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Enter the Archive</h1>
          <p className="text-warmGray text-sm" style={{ fontFamily: "'Lora', serif" }}>Present your credentials to access the Aethelgard registry.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Email Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-bold text-forest uppercase tracking-[0.15em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Registry Identifier</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="archivist@aethelgard.com"
              value={formData.email}
              onChange={handleChange}
              className="bg-ivory border border-parchmentDark rounded-sm px-4 py-3 text-charcoal focus:outline-none focus:border-brass transition duration-200 placeholder:text-warmGray/40 placeholder:italic text-sm"
              style={{ fontFamily: "'Lora', serif" }}
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1 relative">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-bold text-forest uppercase tracking-[0.15em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Access Cipher</label>
              <a href="#" className="text-xs text-brass hover:text-forest transition" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem' }}>
                Reset Cipher?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-ivory border border-parchmentDark rounded-sm px-4 py-3 text-charcoal focus:outline-none focus:border-brass transition duration-200 placeholder:text-warmGray/40 text-sm"
                style={{ fontFamily: "'Lora', serif" }}
                required
              />
              {/* Toggle Password Visibility Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warmGray hover:text-forest transition cursor-pointer"
              >
                {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 bg-forest text-parchment font-bold rounded-sm px-4 py-3 hover:bg-forestLight active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer uppercase tracking-[0.15em] text-sm"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Access Archive
          </button>
        </form>


        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center gap-3 justify-center mb-3">
            <div className="h-px flex-1 bg-brass/20"></div>
            <span className="text-[9px] text-warmGray/60 uppercase tracking-[0.2em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>New Archivist?</span>
            <div className="h-px flex-1 bg-brass/20"></div>
          </div>
          <Link href={'/signup'} className="text-brass font-semibold hover:text-forest transition cursor-pointer text-sm" style={{ fontFamily: "'Lora', serif" }}>
            Request Registry Access
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;