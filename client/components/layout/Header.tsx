'use client'
import { RootState } from '@/store';
import { logout } from '@/store/slices/auth.slice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
  const { user } = useSelector((state: RootState) => state.authReducer)
  const router = useRouter()
  const dispatch = useDispatch()
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    router.replace('/login');
  };
  return (
    <header className="w-full h-16 md:h-20 bg-walnut flex items-center justify-between px-4 md:px-8 shadow-md sticky top-0 z-50 border-b border-brass/30">
      
      <div className="flex items-center gap-3 cursor-pointer group">
        {/* Gear Logo SVG */}
        <div className="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-brass group-hover:text-brassLight transition-colors duration-500">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-brass font-serif font-bold text-lg md:text-xl tracking-wide leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
            Aethelgard
          </h1>
          <span className="hidden sm:block text-[9px] md:text-[10px] text-brass/60 tracking-[0.25em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Horology · Est. 1892
          </span>
        </div>
      </div>

      
    
      <div className="flex items-center gap-4 md:gap-6">
        {
        (user?.role.toLowerCase() === 'admin') &&
        <Link href={'/upload'} className="hidden md:flex items-center gap-2 text-parchment/70 hover:text-brass transition-colors p-2 rounded-sm hover:bg-brass/5 group" aria-label="Upload">
          {/* Archive upload icon */}
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-brass">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <polyline points="9,15 12,12 15,15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="text-parchment/70 hover:text-brass transition-colors text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em' }}>INDEX FOLIO</div>
        </Link>
        }
        {
            (user) ? 
                <button className="flex items-center gap-3 group focus:outline-none">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-brass/10 border border-brass/40 flex items-center justify-center text-brass group-hover:bg-brass group-hover:text-walnut transition-colors duration-300">
                        <FiUser className="text-sm md:text-base" />
                    </div>
                    
                    <div className="hidden md:flex flex-col items-start text-right">
                        <span className="text-parchment text-sm group-hover:text-brass transition-colors" style={{ fontFamily: "'Lora', serif" }}>
                        {user?.name || "Archivist"}
                        </span>
                        <span className="text-[9px] text-brass/50 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{user?.role}</span>
                    </div>
                </button>
                :
                <button 
                    className="flex items-center gap-2 text-parchment/70 hover:text-brass transition-colors p-2 rounded-sm hover:bg-brass/5 group"
                    aria-label="Login" onClick={() => router.push('/login')}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.1em' }}>ENTER ARCHIVE</span>
                </button>
        }
        

        <div className="hidden md:block h-6 w-px bg-brass/20"></div>

        <button 
          className="flex items-center gap-2 text-parchment/60 hover:text-brass transition-colors p-2 rounded-sm hover:bg-brass/5 group"
          aria-label="Logout" onClick={handleLogout}
        >
          <FiLogOut className="text-base md:text-lg group-hover:text-brass transition-colors" />
          <span className="hidden sm:block text-xs uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem' }}>Exit</span>
        </button>
      </div>
    </header>
  )
}

export default Header