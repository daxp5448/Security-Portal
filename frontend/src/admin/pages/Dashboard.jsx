import { useState, useEffect } from "react";
import { Activity, ShieldAlert, Server, Users, Globe, ShieldCheck, Lock, FileText, AlertTriangle } from "lucide-react";
import StatCard from "../components/StatCard";
import AdminChart from "../components/AdminChart";
import AdminTable from "../components/AdminTable";
import { adminService } from "../../services/adminService";
import gsap from 'gsap';
import PageTransition from '../../components/PageTransition';
import AlertBox from '../components/AlertBox';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_reports: 0,
    verified_reports: 0,
    resolved_reports: 0
  });
  const [logs, setLogs] = useState([]);
  const [mapStats, setMapStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    fetchDashboardData();

    // GSAP animations
    const tl = gsap.timeline();
    tl.fromTo('.admin-stat-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
    return () => tl.kill();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const role = localStorage.getItem('role');
      
      if (!token || (role !== 'admin' && role !== 'moderator')) {
        setAuthError(true);
        setLoading(false);
        return;
      }
      
      const [statsData, logsData, mapData, incidentsData] = await Promise.all([
        adminService.getStats(),
        adminService.getAuditLogs(10),
        adminService.getMapStats(),
        adminService.getIncidents()
      ]);
      setStats(statsData);
      // Transform audit logs for display
      const transformedLogs = (logsData || []).map(log => ({
        timestamp: log.created_at,
        user: log.actor_email || 'System',
        action: log.description || log.action,
        ip: log.ip_address || 'N/A',
        status: log.status === 'failed' ? 'Failed' : 'Success'
      }));
      setLogs(transformedLogs);
      setMapStats(mapData);
      setRecentIncidents(incidentsData || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      if (error.response?.status === 403) {
        setAuthError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const securityScore = Math.min(100, Math.max(0, 100 - (stats.verified_reports * 5)));

  const cpuData = [
    { t: 1, v: 8 }, { t: 2, v: 12 }, { t: 3, v: 9 },
    { t: 4, v: 14 }, { t: 5, v: 10 }, { t: 6, v: 18 }
  ];

  const memoryData = [
    { t: 1, v: 40 }, { t: 2, v: 45 }, { t: 3, v: 42 },
    { t: 4, v: 50 }, { t: 5, v: 48 }, { t: 6, v: 55 }
  ];

  const networkData = [
    { t: 1, v: 200 }, { t: 2, v: 400 }, { t: 3, v: 350 },
    { t: 4, v: 500 }, { t: 5, v: 450 }, { t: 6, v: 600 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Success": return "bg-green-400/10 text-green-400";
      case "Failed": return "bg-red-400/10 text-red-400";
      case "Warning": return "bg-yellow-400/10 text-yellow-400";
      default: return "bg-slate-400/10 text-slate-400";
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6 text-white pb-10">

        {/* Authentication Error Message */}
        {authError && (
          <AlertBox
            type="error"
            message="Authentication Required: You must login as an admin or moderator to access the admin dashboard."
            onClose={() => window.location.href = '/login'}
          />
        )}

        {/* Loading State */}
        {loading && !authError && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="text-slate-400 mt-4">Loading dashboard data...</p>
          </div>
        )}

        {!authError && !loading && (
          <>
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="admin-stat-card">
            <StatCard title="Security Score" value={`${securityScore}/100`} color={securityScore > 80 ? "text-green-400" : "text-yellow-400"} icon={ShieldCheck} />
          </div>
          <div className="admin-stat-card">
            <StatCard title="Total Users" value={stats.total_users || 0} color="text-purple-400" icon={Users} />
          </div>
          <div className="admin-stat-card">
            <StatCard title="Active Incidents" value={stats.verified_reports || 0} color="text-red-400" icon={ShieldAlert} />
          </div>
          <div className="admin-stat-card">
            <StatCard title="Resolved Cases" value={stats.resolved_reports || 0} color="text-blue-400" icon={Server} />
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminChart title="CPU Usage (%)" data={cpuData} color="#38bdf8" type="area" />
            <AdminChart title="Memory Usage (%)" data={memoryData} color="#a78bfa" type="line" />
          </div>

          {/* World Map */}
          <WorldMap mapStats={mapStats} />
        </div>

        {/* Right Sidebar Area */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <ActionButton icon={Lock} color="text-red-500" bg="bg-red-500/10" title="System Lockdown" subtitle="Emergency protocol" />
              <ActionButton icon={AlertTriangle} color="text-yellow-500" bg="bg-yellow-500/10" title="Broadcast Alert" subtitle="Notify all users" />
              <ActionButton icon={FileText} color="text-blue-500" bg="bg-blue-500/10" title="Generate Report" subtitle="Download security audit" />
            </div>
          </div>

          <AdminChart title="Network Traffic (MB)" data={networkData} color="#34d399" type="area" />
        </div>
      </div>

      {/* Logs Table */}
      <AdminTable
        title="Live Security Feed"
        icon={Activity}
        headers={["Time", "User", "Action", "IP", "Status"]}
        data={logs}
        renderRow={(row) => (
          <>
            <td className="py-3 px-4 text-slate-300">{new Date(row.timestamp).toLocaleTimeString()}</td>
            <td className="py-3 px-4 text-slate-300 font-medium">{row.user}</td>
            <td className="py-3 px-4 text-slate-300">{row.action}</td>
            <td className="py-3 px-4 text-slate-400 font-mono text-xs">{row.ip}</td>
            <td className="py-3 px-4">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(row.status)}`}>
                {row.status}
              </span>
            </td>
          </>
        )}
      />
          </>
        )}
      </div>
    </PageTransition>
  );
}

function ActionButton({ icon: Icon, color, bg, title, subtitle }) {
  return (
    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-slate-600">
      <div className={`p-2 rounded ${bg} ${color}`}>
        <Icon size={18} />
      </div>
      <div className="text-left">
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-slate-400">{subtitle}</div>
      </div>
    </button>
  );
}

function WorldMap({ mapStats }) {
  return (
    <div className="bg-slate-900 rounded-xl p-6 h-[350px] flex items-center justify-center relative overflow-hidden border border-slate-800">
      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] opacity-5 bg-cover bg-center" />
      <div className="z-10 text-center w-full">
        <Globe className="h-16 w-16 text-slate-700 mx-auto mb-4 animate-pulse opacity-50" />
        <p className="text-slate-500 font-mono text-sm mb-4">Real-time Threat Map Visualization</p>

        {/* Mocking visual representation of data concentration if mapStats exists */}
        {mapStats && mapStats.length > 0 ? (
          <div className="text-left max-w-xs mx-auto bg-black/40 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-bold">Top Threat Zones</p>
            {mapStats.map((stat, i) => (
              <div key={i} className="flex justify-between text-sm py-1 border-b border-slate-700 last:border-0">
                <span>{stat._id || "Unknown Region"}</span>
                <span className="text-red-400 font-mono">{stat.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-600">No active threats reported yet.</p>
        )}
      </div>

      <div className="absolute top-[20%] left-[20%] h-2 w-2 bg-red-500 rounded-full animate-ping" />
      <div className="absolute top-[40%] right-[30%] h-2 w-2 bg-yellow-500 rounded-full animate-ping delay-75" />
      <div className="absolute bottom-[30%] left-[40%] h-2 w-2 bg-blue-500 rounded-full animate-ping delay-150" />
    </div>
  );
}
