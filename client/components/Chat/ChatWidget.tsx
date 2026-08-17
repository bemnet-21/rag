'use client'
import { sendChat } from '@/services/chat.service'
import React, { useState, useEffect, useRef } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{role: string, content: string, sources?: string[]}>>([
    { 
      role: 'assistant', 
      content: "Welcome to the Aethelgard Archive. You may inquire about calibre specifications, serial provenance, servicing records, or any matter within our horological registry.",
      sources: ["REF: ARCHIVE-DIR-1892"]
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages, isLoading])

  const handleSend = async () => {
    const userMessage = input.trim()
    if (!userMessage || isLoading) return

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setIsLoading(true)

    try {
      const response = await sendChat(userMessage)
      
      // Simulate mock citations for demonstration of the vintage source aesthetic
      const mockSources = Math.random() > 0.5 
        ? [`REF: CAL-${Math.floor(Math.random() * 900 + 100)}-REV.${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`]
        : undefined;
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer || response, sources: mockSources }])
    } catch (err) {
      console.error("Chat Error:", err)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "The archive retrieval mechanism has encountered a fault. Please attempt your query again momentarily." 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Inline gear SVG for the loading animation
  const GearSVG = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )

  // Horological Loupe SVG (magnifying glass with crosshair)
  const LoupeSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-amber-100">
      <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="10" y1="7" x2="10" y2="13" stroke="currentColor" strokeWidth="0.75" opacity="0.5"/>
      <line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="0.75" opacity="0.5"/>
    </svg>
  )

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" style={{ fontFamily: "'Lora', serif" }}>
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] sm:w-[26rem] h-[32rem] max-h-[75vh] bg-parchment rounded-sm shadow-2xl flex flex-col overflow-hidden border border-brass/40 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* ─── Header Bar: Brass Ledger Title ─── */}
          <div className="bg-walnut p-4 flex justify-between items-center border-b border-brass/30">
            <div className="flex items-center gap-3">
              {/* Wax Seal Avatar */}
              <div className="wax-seal">
                <span>AH</span>
              </div>
              <div>
                <p className="font-bold text-sm leading-tight text-brass" style={{ fontFamily: "'Playfair Display', serif" }}>The Archive Ledger</p>
                <p className="text-[9px] text-brass/50 uppercase tracking-[0.2em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Aethelgard Registry · Active</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-brass/10 rounded-sm transition-colors text-brass/60 hover:text-brass"
            >
              <FaChevronDown />
            </button>
          </div>

          {/* ─── Message Area: Ledger Pages ─── */}
          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto p-4 space-y-5 bg-parchment"
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.map((msg, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-2">
                {msg.role === 'user' ? (
                  /* ─── User Message: Monogram + Clean Text ─── */
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-brass/15 border border-brass/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-walnut" style={{ fontFamily: "'Playfair Display', serif" }}>U</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] uppercase tracking-[0.15em] text-warmGray mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Query Submitted</p>
                      <p className="text-sm text-charcoal leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  /* ─── Archive Response: Document Layout ─── */
                  <div className="flex items-start gap-3">
                    {/* Loupe Icon */}
                    <div className="wax-seal flex-shrink-0 mt-0.5">
                      <LoupeSVG />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-brass/60 to-transparent"></div>
                        <span className="text-[9px] uppercase tracking-[0.15em] text-brass/70" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Archive Response</span>
                        <div className="h-px w-4 bg-brass/30"></div>
                      </div>
                      <div className="archive-prose text-sm leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
                        <ReactMarkdown>
                           {msg.content}
                        </ReactMarkdown>
                      </div>
                      
                      {/* ─── Citation / References Area ─── */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-brass/20">
                          <p className="text-[9px] uppercase tracking-[0.15em] text-warmGray mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Archive References / Folios</p>
                          <div className="flex flex-col gap-2">
                            {msg.sources.map((source, idx) => (
                              <div key={idx} className="archive-ref-card">
                                {source}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* ─── Loading: Mechanical Gear Animation ─── */}
            {isLoading && (
              <div className="flex items-start gap-3 animate-in fade-in">
                <div className="wax-seal flex-shrink-0">
                  <LoupeSVG />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-brass/60 to-transparent"></div>
                  </div>
                  <div className="flex items-center gap-3 py-2">
                    <GearSVG className="w-5 h-5 text-brass gear-spin" />
                    <GearSVG className="w-3.5 h-3.5 text-brass/60 gear-spin-reverse" />
                    <span className="text-xs text-warmGray archive-pulse italic" style={{ fontFamily: "'Lora', serif" }}>
                      Searching physical archives...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── Input Area: Flat Matte with Brass Focus ─── */}
          <div className="p-3 bg-ivory border-t border-brass/20">
            <div className="flex items-center gap-2 bg-parchment rounded-sm px-3 py-2 border border-parchmentDark focus-within:border-brass transition-all duration-300">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Enter serial number, calibre, or query archive..."
                className="flex-1 bg-transparent border-none outline-none text-charcoal text-sm py-1 placeholder:text-warmGray/50 placeholder:italic"
                style={{ fontFamily: "'Lora', serif" }}
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-forest text-parchment hover:bg-forestLight active:scale-[0.97]"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem' }}
              >
                Search Archive
              </button>
            </div>
            <p className="text-[8px] text-center text-warmGray/40 mt-2 uppercase tracking-[0.2em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Aethelgard Horological Archive · Retrieval Engine
            </p>
          </div>
        </div>
      )}

      {/* ─── Toggle Button: Gear Motif ─── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-2 ${
          isOpen 
          ? 'bg-parchment border-walnut text-walnut' 
          : 'bg-walnut border-brass/50 text-brass hover:scale-105 hover:border-brass active:scale-95'
        }`}
      >
        {isOpen ? (
          <FaChevronDown size={18} />
        ) : (
          <div className="relative">
            <GearSVG className="w-7 h-7" />
          </div>
        )}
      </button>
    </div>
  )
}

export default ChatWidget