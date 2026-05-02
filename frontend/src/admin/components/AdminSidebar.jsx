import { NavLink } from "react-router-dom"
import { LayoutDashboard, ShieldAlert, Users, Send, UserCheck, BarChart3, FileText, Shield, FileSearch, Settings } from "lucide-react"

const links = [
  { name: "Command Center", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Incidents", path: "/admin/threats", icon: ShieldAlert },
  { name: "Dispatch", path: "/admin/dispatch", icon: Send },
  { name: "Officers", path: "/admin/officers", icon: UserCheck },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { name: "Reports", path: "/admin/reports", icon: FileText },
  { name: "Security Ops", path: "/admin/security", icon: Shield },
  { name: "Audit Logs", path: "/admin/logs", icon: FileSearch },
  { name: "Settings", path: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  return (
    <div className="h-full bg-[#081321] border-r border-white/10 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-6 text-cyan-400">🛡️ Admin Portal</h2>

      <nav className="flex flex-col gap-1">
        {links.map(l => (
          <NavLink
            key={l.path}
            to={l.path}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-all duration-200 ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-400 font-medium"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`
            }
          >
            <l.icon className="w-4 h-4" />
            {l.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
