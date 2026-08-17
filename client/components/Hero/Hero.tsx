'use client'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import HeroCard from './HeroCard'
import React from 'react'

// Inline SVG icons for horological theme
const CalibreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="3"/>
    <line x1="12" y1="3" x2="12" y2="6"/>
    <line x1="12" y1="18" x2="12" y2="21"/>
    <line x1="3" y1="12" x2="6" y2="12"/>
    <line x1="18" y1="12" x2="21" y2="12"/>
  </svg>
)

const SerialIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="16" rx="1"/>
    <line x1="7" y1="9" x2="17" y2="9"/>
    <line x1="7" y1="13" x2="14" y2="13"/>
    <line x1="7" y1="17" x2="11" y2="17"/>
  </svg>
)

const MovementIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
)

// Wrapper to make SVG icons compatible with HeroCardProps
const CalibreIconWrapper = ({ size }: { size?: number }) => <CalibreIcon />
const SerialIconWrapper = ({ size }: { size?: number }) => <SerialIcon />
const MovementIconWrapper = ({ size }: { size?: number }) => <MovementIcon />

const Hero = () => {
  const { user } = useSelector((state: RootState) => state.authReducer)

  return (
    <section className='bg-parchment min-h-[85vh] w-full flex flex-col gap-y-12 items-center justify-center px-6 py-12 md:px-10 lg:px-16'>
        
        {/* Header Text Section */}
        <div className='text-center max-w-3xl mb-12 md:mb-16 animate-fade-in'>
            <p className='text-[10px] uppercase tracking-[0.3em] text-brass mb-4' style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Mechanical Excellence Since 1892
            </p>
            <h1 className='text-forest text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight' style={{ fontFamily: "'Playfair Display', serif" }}>
                Welcome, {user?.name || 'Horologist'}
            </h1>
            
            <div className='flex flex-col sm:flex-row items-center justify-center gap-2 text-charcoal/70 text-base sm:text-lg' style={{ fontFamily: "'Lora', serif" }}>
                <span>You are logged into <span className='font-semibold text-forest'>The Aethelgard Archive</span>.</span>
                
                <span className='hidden sm:inline text-brass'>·</span>
                
                <div className='flex items-center gap-2 bg-ivory px-3 py-1 rounded-sm border border-brass/20'>
                    <span className='relative flex h-2 w-2'>
                      <span className='relative inline-flex rounded-sm h-2 w-2 bg-brass'></span>
                    </span>
                    <span className='text-xs text-forest tracking-widest uppercase' style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem' }}>Registry Online</span>
                </div>
            </div>
        </div>
        

        <div className='w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
            <HeroCard 
                label='Calibre Registry' 
                icon={CalibreIconWrapper} 
                description='Access detailed specifications for every movement manufactured in our Geneva and Birmingham ateliers since 1892.' 
            />
            <HeroCard 
                label='Serial Provenance' 
                icon={SerialIconWrapper} 
                description='Trace the complete ownership history and servicing records of any Aethelgard timepiece by its unique serial number.' 
            />
            <HeroCard 
                label='Movement Schematics' 
                icon={MovementIconWrapper} 
                description='Technical diagrams, tolerance specifications, and assembly instructions for each calibre in the Aethelgard collection.' 
            />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-brass font-bold tracking-[0.2em] text-xs uppercase mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {/* Small gear icon */}
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-brass" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
                    </svg>
                    <span>The Archive Ledger</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-forest" style={{ fontFamily: "'Playfair Display', serif" }}>
                    A century of precision, <br /> 
                    <span className="text-brass">catalogued at your fingertips.</span>
                </h2>
            </div>
            <p className="text-charcoal/50 max-w-sm text-sm leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
                The Aethelgard Archive draws upon our complete horological records—from calibre blueprints and serial registries to servicing journals and complication patents.
            </p>
        </div>
    </section>
  )
}

export default Hero