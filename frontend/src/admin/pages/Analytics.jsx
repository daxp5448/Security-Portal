import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { adminService } from "../../services/adminService";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import gsap from 'gsap';
import PageTransition from '../../components/PageTransition';

export default function Analytics() {
  const [incidentTrend, setIncidentTrend] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [resolutionData, setResolutionData] = useState([]);
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.analytics-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    tl.fromTo('.analytics-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.3');
    
    // Fetch data
    const fetchAnalytics = async () => {
      try {
        const [trend, categories, resolution, areas] = await Promise.all([
          adminService.getAnalyticsTrends(),
          adminService.getAnalyticsCategories(),
          adminService.getAnalyticsResolution(),
          adminService.getDangerousAreas(),
        ]);
        setIncidentTrend(trend);
        setCategoryData(categories);
        setResolutionData(resolution);
        setHotspots(areas);
      } catch (error) {
        console.error("Failed to load analytics: ", error);
      }
    };
    fetchAnalytics();

    return () => tl.kill();
  }, []);

  const COLORS = ['#06b6d4', '#ef4444', '#10b981', '#f59e0b'];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="analytics-header">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            Analytics & Insights
          </h1>
          <p className="text-gray-400">Comprehensive safety data and trends</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="analytics-card bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-sm text-gray-400 mb-1">Total Incidents</p>
            <p className="text-3xl font-bold">234</p>
            <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% from last month
            </p>
          </div>
          <div className="analytics-card bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-sm text-gray-400 mb-1">Resolution Rate</p>
            <p className="text-3xl font-bold text-green-400">78%</p>
            <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +5% improvement
            </p>
          </div>
          <div className="analytics-card bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-sm text-gray-400 mb-1">Avg Response Time</p>
            <p className="text-3xl font-bold text-cyan-400">8.5m</p>
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> +2min slower
            </p>
          </div>
          <div className="analytics-card bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-sm text-gray-400 mb-1">Active Users</p>
            <p className="text-3xl font-bold text-purple-400">1,245</p>
            <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +8% growth
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incident Trend */}
          <div className="analytics-card bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Incident Trend (7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incidentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="analytics-card bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="text-lg font-semibold mb-4">Incident Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Resolution Rate */}
          <div className="analytics-card bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="text-lg font-semibold mb-4">Resolution Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hotspot Areas */}
          <div className="analytics-card bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="text-lg font-semibold mb-4">High-Risk Areas</h3>
            <div className="space-y-3">
              {hotspots.map((area, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div>
                    <p className="font-medium">{area.location_name}</p>
                    <p className="text-sm text-gray-400">{area.incident_count} incidents</p>
                  </div>
                  <span className={`text-sm font-medium ${area.average_risk_score > 50 ? 'text-red-400' : 'text-yellow-400'}`}>
                    Risk: {area.average_risk_score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
