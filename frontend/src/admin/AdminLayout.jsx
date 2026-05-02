import { Outlet } from "react-router-dom"
import AdminSidebar from "./components/AdminSidebar"
import AdminTopbar from "./components/AdminTopbar"

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#050b14] text-white">
      <AdminSidebar />

      <div className="flex flex-col flex-1">
        {/* Development Mode Notice */}
        <div className="bg-cyan-500/10 border-b border-cyan-500/20 px-6 py-2 text-center">
          <p className="text-xs text-cyan-400">
            🔧 Development Mode - Admin panel is currently unprotected for testing
          </p>
        </div>
        
        <AdminTopbar />
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
