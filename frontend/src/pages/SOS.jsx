import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, ShieldAlert, X, MapPin } from 'lucide-react';
import gsap from 'gsap';
import PageTransition from '../components/PageTransition';

export default function SOS() {
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState("TAP TO TRIGGER SOS");
  const [countdown, setCountdown] = useState(3);
  const [internalStatus, setInternalStatus] = useState('idle');
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const pulseRef = useRef(null);

  useEffect(() => {
    // Initial fade in
    const tl = gsap.timeline();
    tl.fromTo(containerRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.6, ease: 'power2.out' }
    );
    tl.fromTo('.sos-header', 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    );
    tl.fromTo('.sos-button-container', 
      { opacity: 0, scale: 0.9 }, 
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    );
    return () => tl.kill();
  }, []);

  const triggerSOS = () => {
    if (internalStatus === 'idle') {
      setInternalStatus('countdown');
      setStatusText("CANCEL IN");
      gsap.to(buttonRef.current, { 
        scale: 1.05, 
        duration: 0.4, 
        ease: 'power2.out' 
      });
    }
  };

  useEffect(() => {
    let timer;
    if (internalStatus === 'countdown') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setInternalStatus('active');
        setStatusText("DISPATCHING HELP...");
        
        // Emulate real-time WebSocket connection phases
        setTimeout(() => setStatusText("LOCATING YOU..."), 2000);
        setTimeout(() => setStatusText("OFFICER ON THE WAY (2 MINS)"), 5000);

        // Gentle pulse animation
        gsap.to(pulseRef.current, {
          scale: 2.5, 
          opacity: 0, 
          duration: 3, 
          repeat: -1, 
          ease: 'sine.out'
        });
        gsap.to(buttonRef.current, {
          boxShadow: '0 0 60px rgba(220, 38, 38, 0.6)',
          duration: 1.5, 
          repeat: -1, 
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
    }
    return () => clearTimeout(timer);
  }, [internalStatus, countdown]);

  const cancelSOS = () => {
    setInternalStatus('idle');
    setCountdown(3);
    setStatusText("TAP TO TRIGGER SOS");
    gsap.to(buttonRef.current, { 
      scale: 1, 
      boxShadow: 'none', 
      duration: 0.4, 
      ease: 'power2.out' 
    });
    gsap.killTweensOf(pulseRef.current);
    gsap.set(pulseRef.current, { scale: 1, opacity: 0.3 });
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-6 overflow-hidden">
      
      {/* Background warning red fade if active */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${internalStatus === 'active' ? 'bg-destructive/20' : 'bg-transparent'}`} />

      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10 sos-header">
        <button 
          onClick={() => navigate('/')} 
          className="glass-panel p-3 rounded-full hover:bg-white/10 transition-all duration-300"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-destructive flex items-center gap-2 justify-end">
             SurakshaSetu <ShieldAlert className="w-6 h-6" />
          </h2>
          <p className="text-muted-foreground mt-1 flex items-center gap-1 justify-end">
            <MapPin className="w-4 h-4" /> Detecting GPS...
          </p>
        </div>
      </div>

      {/* Main SOS UI */}
      <div className="relative flex flex-col items-center justify-center z-10 flex-1 w-full sos-button-container">
        
        {/* Pulse Rings - Softer */}
        {internalStatus === 'active' && (
          <>
             <div ref={pulseRef} className="absolute w-64 h-64 bg-destructive rounded-full opacity-30 mix-blend-screen" />
             <div className="absolute w-64 h-64 border-[8px] border-destructive rounded-full opacity-15 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
             <div className="absolute w-80 h-80 border-[3px] border-destructive rounded-full opacity-10 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
          </>
        )}

        <button
          ref={buttonRef}
          onClick={internalStatus === 'idle' ? triggerSOS : undefined}
          className={`
            relative z-20 flex flex-col items-center justify-center w-64 h-64 rounded-full
            ${internalStatus === 'idle' ? 'bg-gradient-to-br from-red-600 to-red-900 shadow-2xl hover:scale-105 soft-3d' : ''}
            ${internalStatus === 'countdown' ? 'bg-red-800' : ''}
            ${internalStatus === 'active' ? 'bg-destructive' : ''}
            transition-all duration-500 pointer-events-auto
          `}
        >
          {internalStatus === 'idle' && (
            <>
              <ShieldAlert className="w-24 h-24 mb-2 drop-shadow-lg" />
              <span className="text-3xl font-black tracking-widest drop-shadow">SOS</span>
            </>
          )}

          {internalStatus === 'countdown' && (
            <span className="text-8xl font-black drop-shadow-2xl">{countdown}</span>
          )}

          {internalStatus === 'active' && (
            <div className="flex flex-col items-center">
              <PhoneCall className="w-20 h-20 mb-4" style={{ animation: 'bounce 2s infinite' }} />
              <span className="text-2xl font-bold tracking-wider">LIVE</span>
            </div>
          )}
        </button>

        <h1 className={`mt-12 text-3xl font-bold tracking-widest text-center transition-all duration-500 ${internalStatus === 'active' ? 'text-destructive pulse-soft' : 'text-foreground'}`}>
          {statusText}
        </h1>

      </div>
      
      {/* Bottom Footer Actions */}
      <div className="absolute bottom-10 z-10 flex items-center justify-center w-full gap-4 px-6">
        {internalStatus !== 'idle' && (
          <button 
            onClick={cancelSOS}
            className="w-full max-w-sm py-5 uppercase font-bold tracking-widest bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-lg transition-all duration-300"
          >
            Cancel Alert
          </button>
        )}
      </div>

    </div>
  );
}
