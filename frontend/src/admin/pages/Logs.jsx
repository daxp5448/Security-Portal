import { useEffect, useMemo, useState } from "react";
import { FileText, Search, Filter } from "lucide-react";
import AdminTable from "../components/AdminTable";
import { adminService } from "../../services/adminService";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await adminService.getAuditLogs(100);
        setLogs(data);
      } catch (error) {
        console.error("Failed to load audit logs", error);
      }
    };

    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return logs;
    return logs.filter((log) =>
      [log.action, log.entity_type, log.description, log.actor_email, log.ip_address]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [logs, search]);

  const getLevel = (row) => {
    if (row.status === "failed") return "ERROR";
    if (row.action === "delete") return "CRITICAL";
    if (row.action === "update") return "WARN";
    return "INFO";
  };

  return (
    <div className="space-y-6 text-white pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">System Logs</h1>
          <p className="text-slate-400 text-sm">View and analyze system events, security alerts, and audit trails.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm hover:bg-slate-800 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      <AdminTable
        title="Recent Events"
        icon={FileText}
        headers={["Timestamp", "Level", "Source", "Message", "IP Address"]}
        data={filteredLogs}
        renderRow={(row) => {
          const level = getLevel(row);
          return (
          <>
            <td className="py-3 px-4 text-slate-400 font-mono text-xs whitespace-nowrap">{new Date(row.created_at).toLocaleString()}</td>
            <td className="py-3 px-4">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${level === "INFO" ? "bg-blue-400/10 text-blue-400" :
                  level === "WARN" ? "bg-yellow-400/10 text-yellow-400" :
                    level === "ERROR" ? "bg-red-400/10 text-red-400" :
                      "bg-rose-500/10 text-rose-500"
                }`}>
                {level}
              </span>
            </td>
            <td className="py-3 px-4 text-slate-300">{row.entity_type}</td>
            <td className="py-3 px-4 text-slate-300">{row.description}</td>
            <td className="py-3 px-4 text-slate-400 font-mono text-xs">{row.ip_address || "N/A"}</td>
          </>
        )}}
      />
    </div>
  );
}
