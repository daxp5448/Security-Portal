import { useState, useEffect } from "react";
import { Send, MapPin, Clock, AlertTriangle, Phone, CheckCircle } from "lucide-react";
import gsap from 'gsap';
import PageTransition from '../../components/PageTransition';
import { adminService } from "../../services/adminService";
import AlertBox from "../components/AlertBox";

export default function DispatchPanel() {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [alert, setAlert] = useState(null);

  const loadData = async () => {
    try {
      const [alertsRes, offRes] = await Promise.all([
        adminService.getIncidents(),
        adminService.getOfficers()
      ]);
      const openIncidents = (alertsRes.items || alertsRes).filter(i => i.status !== "resolved");
      setActiveAlerts(openIncidents);
      setOfficers(offRes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    const tl = gsap.timeline();
    tl.fromTo('.dispatch-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    tl.fromTo('.dispatch-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.3');
    return () => tl.kill();
  }, []);

  const assignOfficer = async (alertId, officerId) => {
    try {
      await adminService.assignOfficer(alertId, officerId);
      loadData();
      setAlert({ type: "success", message: "Officer assigned successfully" });
    } catch (e) {
      setAlert({ type: "error", message: "Failed to assign officer" });
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Alert Box */}
        {alert && (
          <AlertBox
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="dispatch-header">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Send className="w-8 h-8 text-cyan-400" />
            Dispatch Panel
          </h1>
          <p className="text-gray-400">Assign nearest officers to active incidents</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Alerts */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Active Alerts ({activeAlerts.filter(a => !a.assigned_to).length})
            </h2>

            {activeAlerts.map((alert) => (
              <div key={alert.id} className="dispatch-card bg-slate-900 rounded-xl p-5 border border-slate-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{alert.title}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {alert.location_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(alert.incident_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    alert.risk_category === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {alert.risk_category.toUpperCase()}
                  </span>
                </div>

                {alert.assigned_to ? (
                  <div className="flex items-center gap-2 text-green-400 bg-green-500/10 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">Officer Assigned</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 mb-2">Available Officers:</p>
                    {officers.filter(o => o.status === 'available').map(officer => (
                      <button
                        key={officer.id}
                        onClick={() => assignOfficer(alert.id, officer.id)}
                        className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-cyan-400" />
                          <div className="text-left">
                            <p className="text-sm font-medium">{officer.name}</p>
                            <p className="text-xs text-gray-400">{officer.location}</p>
                          </div>
                        </div>
                        <span className="text-xs text-cyan-400">{officer.response_time_mins} mins</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Officers Status */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Send className="w-5 h-5 text-cyan-400" />
              Officers Status
            </h2>

            {officers.map((officer) => (
              <div key={officer.id} className="dispatch-card bg-slate-900 rounded-xl p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{officer.name}</h3>
                    <p className="text-sm text-gray-400">{officer.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    officer.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {officer.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Response: {officer.response_time_mins} mins
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
