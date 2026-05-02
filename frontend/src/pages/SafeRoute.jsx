import { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Shield, ShieldCheck, ShieldAlert, Navigation } from 'lucide-react';
import gsap from 'gsap';
import PageTransition from '../components/PageTransition';
import FloatingCard from '../components/FloatingCard';

export default function SafeRoute() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const routesRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo('.route-header',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    tl.fromTo('.route-card',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' },
      '-=0.3'
    );

    return () => tl.kill();
  }, []);

  const routes = [
    {
      id: 1,
      name: 'Main Street Route',
      distance: '2.4 km',
      duration: '18 mins',
      safetyScore: 92,
      safetyLevel: 'high',
      description: 'Well-lit main road with high foot traffic',
      features: ['CCTV Covered', 'Well Lit', 'Busy Area']
    },
    {
      id: 2,
      name: 'Park Avenue Route',
      distance: '1.8 km',
      duration: '14 mins',
      safetyScore: 78,
      safetyLevel: 'medium',
      description: 'Shorter route through residential area',
      features: ['Residential', 'Moderate Traffic']
    },
    {
      id: 3,
      name: 'Canal Path Route',
      distance: '3.1 km',
      duration: '24 mins',
      safetyScore: 54,
      safetyLevel: 'low',
      description: 'Scenic but less populated route',
      features: ['Less Crowded', 'Limited Lighting']
    }
  ];

  const getSafetyColor = (level) => {
    switch (level) {
      case 'high':
        return {
          bg: 'bg-emerald-500/20',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          icon: <ShieldCheck className="w-6 h-6" />
        };
      case 'medium':
        return {
          bg: 'bg-yellow-500/20',
          text: 'text-yellow-400',
          border: 'border-yellow-500/30',
          icon: <Shield className="w-6 h-6" />
        };
      case 'low':
        return {
          bg: 'bg-orange-500/20',
          text: 'text-orange-400',
          border: 'border-orange-500/30',
          icon: <ShieldAlert className="w-6 h-6" />
        };
      default:
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          icon: <Shield className="w-6 h-6" />
        };
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] p-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="route-header mb-8">
            <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
              <Navigation className="w-10 h-10 text-primary" />
              Safe Routes
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose the safest path to your destination
            </p>
          </div>

          {/* Route Options */}
          <div className="space-y-4">
            {routes.map((route, index) => {
              const safetyColor = getSafetyColor(route.safetyLevel);
              const isSelected = selectedRoute === route.id;

              return (
                <FloatingCard
                  key={route.id}
                  className={`route-card p-6 cursor-pointer transition-all duration-500 ${
                    isSelected
                      ? `${safetyColor.border} border-2`
                      : 'border border-white/5'
                  }`}
                  delay={index * 0.1}
                >
                  <div
                    onClick={() => setSelectedRoute(route.id)}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Route Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-3">
                        <div className={`p-3 rounded-xl ${safetyColor.bg} ${safetyColor.text}`}>
                          {safetyColor.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1">{route.name}</h3>
                          <p className="text-sm text-muted-foreground">{route.description}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-4 ml-16">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{route.distance}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{route.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                          <span className={safetyColor.text}>Safety: {route.safetyScore}%</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mt-3 ml-16">
                        {route.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs rounded-full glass-panel"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Safety Score Badge */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`text-3xl font-bold ${safetyColor.text}`}>
                        {route.safetyScore}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">
                        Safety Score
                      </div>
                    </div>
                  </div>
                </FloatingCard>
              );
            })}
          </div>

          {/* Selected Route Info */}
          {selectedRoute && (
            <div className="mt-8 fade-in">
              <FloatingCard className="p-6 bg-primary/10 border-primary/30">
                <div className="flex items-center gap-4">
                  <Navigation className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      Route Selected: {routes.find(r => r.id === selectedRoute)?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Follow this route for maximum safety. Stay alert and keep your phone charged.
                    </p>
                    <button className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                      Start Navigation
                    </button>
                  </div>
                </div>
              </FloatingCard>
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
