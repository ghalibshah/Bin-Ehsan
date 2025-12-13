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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-opacity duration-1000 ${
        stage === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse" />
          <div className="absolute inset-12 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
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
          <div className="relative">
            {/* Glow effect behind icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-cyan-500/30 blur-xl animate-pulse" />
            </div>
            
            {/* Icon container */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-2xl shadow-cyan-500/25">
              <Building2 className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        {/* Welcome text */}
        <div 
          className={`transition-all duration-700 ${
            stage === 'logo' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <p className="text-cyan-400 text-sm font-medium tracking-[0.3em] uppercase mb-3">
            Welcome To
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              Bin Ehsan
            </span>
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-slate-300">
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
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
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

