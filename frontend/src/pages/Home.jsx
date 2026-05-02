import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, FileWarning, MapPin, Activity } from 'lucide-react';
import gsap from 'gsap';
import AnimatedBackground from '../components/AnimatedBackground';
import PageTransition from '../components/PageTransition';

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();

    // Staggered entrance animations
    tl.fromTo('.hero-badge', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    tl.fromTo('.hero-title', 
      { opacity: 0, y: 25 }, 
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.3'
    );

    tl.fromTo('.hero-subtitle', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo('.action-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
      '-=0.3'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const actionCards = [
    {
      title: "SOS Alert",
      description: "Trigger immediate emergency response",
      icon: <ShieldAlert className="w-10 h-10 text-white" />,
      color: "bg-destructive",
      hover: "hover:shadow-destructive/40",
      path: "/sos",
      highlight: true
    },
    {
      title: "Report Incident",
      description: "Log a safety concern or crime in your area",
      icon: <FileWarning className="w-8 h-8 text-white" />,
      color: "bg-primary",
      hover: "hover:shadow-primary/40",
      path: "/report"
    },
    {
      title: "Safe Routes",
      description: "Find the safest path to your destination",
      icon: <MapPin className="w-8 h-8 text-white" />,
      color: "bg-[hsl(142,70%,45%)]", // Emerald Safe Green
      hover: "hover:shadow-green-500/40",
      path: "/safe-routes"
    }
  ];

  return (
    <PageTransition>
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Animated Background */}
        <AnimatedBackground opacity={0.15} />

        {/* Hero Section */}
        <div className="z-10 text-center max-w-2xl mb-12">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
            <Activity className="w-4 h-4 text-primary pulse-soft" />
            <span className="text-sm font-medium tracking-wide">Live Real-time Safety Network</span>
          </div>
          <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Stay <span className="text-gradient">Safe.</span><br />
            Stay <span className="text-gradient">Connected.</span>
          </h1>
          <p className="hero-subtitle text-lg text-muted-foreground">
            SurakshaSetu is your next-generation public safety platform. 
            Get real-time alerts, report incidents, and find safe routes instantly.
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {actionCards.map((card, index) => (
            <button
              key={index}
              ref={el => cardsRef.current[index] = el}
              onClick={() => navigate(card.path)}
              className={`action-card relative group flex flex-col items-center text-center p-8 rounded-[2rem] glass-card transition-all duration-500 w-full hover:-translate-y-2 hover:scale-[1.02] shadow-lg ${card.hover}`}
            >
              {/* Soft 3D Icon Container */}
              <div className={`
                w-20 h-20 rounded-2xl flex items-center justify-center mb-6
                ${card.color} shadow-xl soft-3d group-hover:scale-105 transition-transform duration-500
                ${card.highlight ? 'glow-pulse' : ''}
              `}>
                {card.icon}
              </div>
              
              <h3 className="text-2xl font-semibold mb-3">{card.title}</h3>
              <p className="text-muted-foreground">{card.description}</p>
              
              {/* Subtle highlight effect on card hover */}
              <div className="absolute inset-0 rounded-[2rem] bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"></div>
            </button>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
