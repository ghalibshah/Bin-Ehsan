"use client"

import { useEffect, useState } from "react"
import { Building2 } from "lucide-react"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [stage, setStage] = useState<'logo' | 'text' | 'fade'>('logo')

  useEffect(() => {
    // Stage 1: Logo appears (0-1s)
    // Stage 2: Text appears (1-2.5s)
    // Stage 3: Fade out (2.5-3.5s)
    
    const textTimer = setTimeout(() => setStage('text'), 800)
    const fadeTimer = setTimeout(() => setStage('fade'), 2500)
    const completeTimer = setTimeout(() => onComplete(), 3500)

    return () => {
      clearTimeout(textTimer)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[hsl(30,8%,10%)] transition-opacity duration-1000 ${
        stage === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Logo */}
        <div 
          className={`mb-8 transition-all duration-700 ease-out ${
            stage === 'logo' ? 'scale-100 opacity-100' : 'scale-100 opacity-100'
          }`}
          style={{
            animation: 'logoEnter 0.8s ease-out forwards',
          }}
        >
          <div className="relative flex h-20 w-20 items-center justify-center rounded-md bg-[hsl(40,18%,96%)]">
            <Building2 className="h-10 w-10 text-[hsl(30,8%,12%)]" />
          </div>
        </div>

        {/* Welcome text */}
        <div 
          className={`transition-all duration-700 ${
            stage === 'logo' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <p className="text-stone-400 text-sm font-medium tracking-[0.3em] uppercase mb-3">
            Welcome To
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-stone-50 tracking-tight mb-4">
            Bin Ehsan
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-stone-400">
            Management Software
          </h2>
        </div>

        {/* Loading indicator */}
        <div 
          className={`mt-12 transition-all duration-500 ${
            stage === 'logo' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes logoEnter {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

