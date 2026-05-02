import { useEffect, useState } from "react";
import { ShieldAlert, Map, AlertTriangle } from "lucide-react";
import AdminTable from "../components/AdminTable";
import StatCard from "../components/StatCard";
import { adminService } from "../../services/adminService";

export default function Threats() {
  const [incidents, setIncidents] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const loadThreatData = async () => {
      try {
        const [incidentResponse, dangerousAreas] = await Promise.all([
          adminService.getIncidents(),
          adminService.getDangerousAreas(),
        ]);
        setIncidents(incidentResponse.items || []);
        setAreas(dangerousAreas);
      } catch (error) {
        console.error("Failed to load threat data", error);
      }
    };

    loadThreatData();
  }, []);

  const activeThreats = incidents.filter((incident) => incident.status !== "resolved").length;
  const highRiskThreats = incidents.filter((incident) => incident.risk_category === "high").length;
  const coveredAreas = areas.length;

  return (
    <div className="space-y-6 text-white pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Threat Intelligence</h1>
          <p className="text-slate-400 text-sm">Real-time monitoring of security threats and incidents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Active Threats" value={activeThreats} color="text-red-400" icon={AlertTriangle} />
        <StatCard title="High Risk Cases" value={highRiskThreats} color="text-green-400" icon={ShieldAlert} />
        <StatCard title="Critical Areas" value={coveredAreas} color="text-blue-400" icon={Map} />
      </div>

      <div className="bg-slate-900 rounded-xl p-6 h-[400px] flex items-center justify-center relative border border-slate-800/50">
        <div className="text-center w-full max-w-xl">
          <Map className="h-16 w-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300">Live Threat Map</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mt-2">
            Top incident clusters are calculated from PostgreSQL analytics and refreshed from the admin API.
          </p>
          <div className="mt-6 grid gap-2 text-left">
            {areas.slice(0, 5).map((area) => (
              <div key={area.location_name} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm">
                <span>{area.location_name}</span>
                <span className="font-mono text-red-400">{area.incident_count} incidents</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdminTable
        title="Recent Incidents"
        icon={ShieldAlert}
        headers={["Incident", "Location", "Reporter", "Severity", "Status"]}
        data={incidents}
        renderRow={(row) => (
          <>
            <td className="py-3 px-4 text-slate-200 font-medium">{row.title}</td>
            <td className="py-3 px-4 text-slate-400 text-sm">{row.location_name}</td>
            <td className="py-3 px-4 text-slate-400 text-sm">User #{row.created_by}</td>
            <td className="py-3 px-4">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${row.risk_category === "high" ? "bg-rose-500/10 text-rose-500" :
                  row.risk_category === "moderate" ? "bg-red-400/10 text-red-400" :
                    "bg-yellow-400/10 text-yellow-400"
                }`}>
                {row.risk_category}
              </span>
            </td>
            <td className="py-3 px-4">
              <span className={`text-sm ${row.status !== "resolved" ? "text-red-400 animate-pulse font-bold" : "text-green-400"
                }`}>
                {row.status}
              </span>
            </td>
          </>
        )}
      />
    </div>
  );
}
