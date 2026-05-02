import React, { useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldCheck, Zap, Activity, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import PageTransition from '../components/PageTransition';
import FloatingCard from '../components/FloatingCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const safetyScore = 85;
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo('.dashboard-header',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    tl.fromTo('.dashboard-card',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.3'
    );

    tl.fromTo('.incident-item',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
      '-=0.2'
    );

    return () => tl.kill();
  }, []); 

  const pieData = [
    { name: 'Safe', value: safetyScore, color: '#10b981' },
    { name: 'Risk', value: 100 - safetyScore, color: '#3f3f46' }
  ];

  const recentIncidents = [
    { id: 1, type: "Medical Emergency", time: "10 mins ago", distance: "0.8 km away", severity: "high" },
    { id: 2, type: "Suspicious Activity", time: "1 hour ago", distance: "2.1 km away", severity: "medium" },
    { id: 3, type: "Road Hazard", time: "3 hours ago", distance: "5.0 km away", severity: "low" },
  ];

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto w-full p-6 space-y-8">
        
        {/* Header section */}
        <header className="dashboard-header flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold mb-2">Overview</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary pulse-soft" /> Active Monitoring Online
            </p>
          </div>
          <button 
            onClick={() => navigate('/sos')} 
            className="glass-panel text-destructive border-destructive/30 px-6 py-2 rounded-full font-bold hover:bg-destructive shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:text-white transition-all duration-300 hover:scale-105"
          >
            QUICK SOS
          </button>
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Safety Score Card */}
          <FloatingCard className="dashboard-card p-6 flex flex-col items-center justify-center relative overflow-hidden rounded-[2rem]" delay={0}>
            <h3 className="w-full text-left text-lg font-semibold mb-4 text-foreground/80">Area Safety Score</h3>
            <div className="h-40 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={75}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">{safetyScore}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Score</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-sm">
              <ShieldCheck className="w-4 h-4" /> Condition is Safe
            </div>
          </FloatingCard>

          {/* Quick Stats */}
          <div className="md:col-span-2 grid grid-cols-2 gap-6">
            <FloatingCard className="dashboard-card p-6 flex flex-col justify-between rounded-[2rem]" delay={0.1}>
              <div className="flex justify-between mb-4">
                <div className="bg-primary/20 p-3 rounded-2xl"><Zap className="text-primary w-6 h-6" /></div>
              </div>
              <div>
                <p className="text-5xl font-black mb-1">12</p>
                <p className="text-muted-foreground">Active Volunteers Nearby</p>
              </div>
            </FloatingCard>
            <FloatingCard className="dashboard-card p-6 flex flex-col justify-between rounded-[2rem]" delay={0.2}>
              <div className="flex justify-between mb-4">
                <div className="bg-orange-500/20 p-3 rounded-2xl"><AlertTriangle className="text-orange-500 w-6 h-6" /></div>
              </div>
              <div>
                <p className="text-5xl font-black mb-1">3</p>
                <p className="text-muted-foreground">Alerts in 5km radius</p>
              </div>
            </FloatingCard>
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Nearby Incidents</h2>
            <button className="text-primary hover:text-primary-foreground text-sm font-medium transition-colors flex items-center duration-300">
              View Map <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {recentIncidents.map((incident, index) => (
              <div 
                key={incident.id} 
                className="incident-item glass-panel p-5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl 
                    ${incident.severity === 'high' ? 'bg-destructive/20 text-destructive' : ''}
                    ${incident.severity === 'medium' ? 'bg-orange-500/20 text-orange-500' : ''}
                    ${incident.severity === 'low' ? 'bg-yellow-500/20 text-yellow-500' : ''}
                  `}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">{incident.type}</h4>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                      <span>{incident.time}</span>
                      <span className="w-1 h-1 rounded-full bg-border"></span>
                      <span>{incident.distance}</span>
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground group-hover:text-white transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
