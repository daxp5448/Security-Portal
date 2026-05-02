import { useState, useEffect } from "react";
import { Shield, AlertTriangle, Activity, Lock } from "lucide-react";
import gsap from 'gsap';
import PageTransition from '../../components/PageTransition';
import { adminService } from "../../services/adminService";

export default function SecurityOps() {
  const [systemStatus, setSystemStatus] = useState({
    api: 'calculating...',
    database: 'calculating...',
    websocket: 'calculating...',
    redis: 'calculating...'
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.security-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    tl.fromTo('.security-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.3');
    
    adminService.getSystemHealth().then(setSystemStatus).catch(console.error);
    adminService.getAuditLogs(10).then(setEvents).catch(console.error);
    
    return () => tl.kill();
  }, []);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="security-header">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            Security Operations
          </h1>
          <p className="text-gray-400">Monitor and manage system security</p>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(systemStatus).map(([service, status]) => (
            <div key={service} className="security-card bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold capitalize">{service}</h3>
                <span className={`w-3 h-3 rounded-full ${status === 'operational' ? 'bg-green-400' : 'bg-yellow-400'}`} />
              </div>
              <p className={`text-sm font-medium ${status === 'operational' ? 'text-green-400' : 'text-yellow-400'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Security Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all duration-200">
              <Lock className="w-6 h-6 text-red-400 mb-2" />
              <p className="font-medium text-red-400">Emergency Lockdown</p>
              <p className="text-xs text-gray-400 mt-1">Restrict all access</p>
            </button>
            <button className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-all duration-200">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mb-2" />
              <p className="font-medium text-yellow-400">Broadcast Alert</p>
              <p className="text-xs text-gray-400 mt-1">Notify all users</p>
            </button>
            <button className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all duration-200">
              <Shield className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="font-medium text-cyan-400">Security Scan</p>
              <p className="text-xs text-gray-400 mt-1">Run diagnostics</p>
            </button>
          </div>
        </div>

        {/* Recent Security Events */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h2 className="text-xl font-semibold mb-4">Recent Security Events</h2>
          <div className="space-y-3">
            {events.slice(0, 5).map((event, i) => (
              <div key={i} className="security-card flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    event.action === 'delete' ? 'bg-red-400' :
                    event.action === 'update' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{event.description}</p>
                    <p className="text-xs text-gray-400">Actor: {event.actor_email} | IP: {event.ip_address || "N/A"}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(event.created_at).toLocaleString()}</span>
              </div>
            ))}
            {events.length === 0 && <p className="text-slate-400">No events logged.</p>}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
