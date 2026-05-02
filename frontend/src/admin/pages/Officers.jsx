import { useState, useEffect } from "react";
import { UserCheck, Phone, MapPin, Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import gsap from 'gsap';
import PageTransition from '../../components/PageTransition';
import { adminService } from "../../services/adminService";
import AlertBox from "../components/AlertBox";

export default function Officers() {
  const [officers, setOfficers] = useState([]);
  const [alert, setAlert] = useState(null);

  const loadOfficers = async () => {
    try {
      const data = await adminService.getOfficers();
      setOfficers(data);
    } catch (error) {
      console.error("Failed to load officers", error);
    }
  };

  useEffect(() => {
    loadOfficers();
    const tl = gsap.timeline();
    tl.fromTo('.officers-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    tl.fromTo('.officer-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.3');
    return () => tl.kill();
  }, []);

  const handleAddOfficer = async () => {
    const name = window.prompt("Officer Name:");
    if (!name) return;
    const phone = window.prompt("Officer Phone:");
    const location = window.prompt("Assigned Location:");
    try {
      await adminService.createOfficer({ name, phone, location, status: "available" });
      loadOfficers();
      setAlert({ type: "success", message: "Officer created successfully" });
    } catch (e) {
      setAlert({ type: "error", message: "Failed to create officer." });
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

        <div className="officers-header flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-cyan-400" />
              Officers Management
            </h1>
            <p className="text-gray-400">Manage field officers and their assignments</p>
          </div>
          <button onClick={handleAddOfficer} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors duration-200 font-medium">
            + Add Officer
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-sm text-gray-400 mb-1">Total Officers</p>
            <p className="text-3xl font-bold">{officers.length}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-sm text-gray-400 mb-1">On Duty</p>
            <p className="text-3xl font-bold text-green-400">{officers.filter(o => o.status === 'on-duty').length}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-sm text-gray-400 mb-1">Total Resolved</p>
            <p className="text-3xl font-bold text-cyan-400">{officers.reduce((sum, o) => sum + (o.incidents_resolved || 0), 0)}</p>
          </div>
        </div>

        {/* Officers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officers.map((officer) => (
            <div key={officer.id} className="officer-card bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{officer.name}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {officer.phone}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  officer.status === 'on-duty' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {officer.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {officer.location}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-gray-400">Resolved: <span className="text-cyan-400 font-medium">{officer.incidents_resolved}</span></span>
                  <span className="text-gray-400">Rating: <span className="text-yellow-400 font-medium">⭐ {officer.rating}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
