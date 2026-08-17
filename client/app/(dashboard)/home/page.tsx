import React from 'react'
import Hero from '@/components/Hero/Hero'
import ChatWidget from '@/components/Chat/ChatWidget'

const Page = () => {
  return (
    <main className="relative min-h-screen bg-parchment flex flex-col">
        

        <section className="py-20 px-6 max-w-7xl mx-auto w-full">
            <Hero />
        </section>

        {/* Visual Break / Heritage Quote */}
        <section className="bg-walnut py-16 px-6 text-center border-y border-brass/20">
            <div className="max-w-3xl mx-auto">
                <blockquote className="text-parchment/90 text-2xl italic leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                    &ldquo;A timepiece is not merely an instrument of measure, but a covenant between the artisan and the passage of ages.&rdquo;
                </blockquote>
                <div className="mt-6 flex justify-center items-center gap-4">
                    <div className="h-px w-12 bg-brass/60"></div>
                    <p className="text-brass font-bold uppercase tracking-[0.2em] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>E. Aethelgard, Founder · 1892</p>
                    <div className="h-px w-12 bg-brass/60"></div>
                </div>
            </div>
        </section>

        <ChatWidget />

        {/* Enhanced Footer */}
        <footer className="mt-auto py-12 border-t border-brass/20 bg-ivory">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start">
                    <h3 className="text-forest font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>Aethelgard Horology</h3>
                    <p className="text-warmGray text-xs mt-1" style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}>Geneva · Birmingham · Est. 1892</p>
                </div>

                <div className="flex gap-8 text-xs font-bold uppercase tracking-[0.2em] text-forest/50" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem' }}>
                    <a href="#" className="hover:text-brass transition">Terms</a>
                    <a href="#" className="hover:text-brass transition">Privacy</a>
                    <a href="#" className="hover:text-brass transition">Service</a>
                </div>

                <p className="text-warmGray/60 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem' }}>
                    © {new Date().getFullYear()} Aethelgard Horology. All rights reserved.
                </p>
            </div>
        </footer>
    </main>
  )
}

export default Page