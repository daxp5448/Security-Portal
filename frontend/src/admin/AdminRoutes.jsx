import { Routes, Route, Navigate } from "react-router-dom"
import AdminLayout from "./AdminLayout"

import Dashboard from "./pages/Dashboard"
import Threats from "./pages/Threats"
import Users from "./pages/Users"
import Logs from "./pages/Logs"
import Settings from "./pages/Settings"
import DispatchPanel from "./pages/DispatchPanel"
import Officers from "./pages/Officers"
import Analytics from "./pages/Analytics"
import ReportsExport from "./pages/ReportsExport"
import SecurityOps from "./pages/SecurityOps"
import IncidentDetails from "./pages/IncidentDetails"

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="threats" element={<Threats />} />
        <Route path="threats/:id" element={<IncidentDetails />} />
        <Route path="dispatch" element={<DispatchPanel />} />
        <Route path="officers" element={<Officers />} />
        <Route path="users" element={<Users />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<ReportsExport />} />
        <Route path="security" element={<SecurityOps />} />
        <Route path="logs" element={<Logs />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
