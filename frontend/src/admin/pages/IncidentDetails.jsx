import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, AlertTriangle, User, Image } from "lucide-react";
import gsap from 'gsap';
import PageTransition from '../../components/PageTransition';

export default function IncidentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo('.incident-detail', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  }, [id]);

  const incident = {
    id: id,
    type: "Theft",
    description: "Wallet stolen from pocket in crowded market area",
    location: "Connaught Place, New Delhi",
    datetime: "2026-04-10 14:30",
    status: "investigating",
    severity: "medium",
    reportedBy: "John Doe",
    assignedOfficer: "Rajesh Kumar",
    images: ["evidence1.jpg", "evidence2.jpg"]
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="incident-detail">
          <button onClick={() => navigate('/admin/threats')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors duration-200">
            <ArrowLeft className="w-4 h-4" /> Back to Incidents
          </button>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Incident #{incident.id}</h1>
                <p className="text-gray-400">{incident.type}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                incident.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {incident.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="font-medium">{incident.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Date & Time</p>
                    <p className="font-medium">{incident.datetime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Severity</p>
                    <p className="font-medium capitalize">{incident.severity}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Reported By</p>
                    <p className="font-medium">{incident.reportedBy}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Assigned Officer</p>
                    <p className="font-medium">{incident.assignedOfficer}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300">{incident.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Image className="w-5 h-5" /> Evidence ({incident.images.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {incident.images.map((img, i) => (
                  <div key={i} className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                    <Image className="w-8 h-8 text-gray-600" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors duration-200 font-medium">
                Update Status
              </button>
              <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200">
                Reassign Officer
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
