import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SOS from "./pages/SOS";
import Chatbot from "./pages/Chatbot";
import SafeRoute from "./pages/SafeRoute";
import Auth from "./pages/Auth";
import Community from "./pages/Community";
import ContentLibrary from "./pages/ContentLibrary";
import ReportIncident from "./pages/ReportIncident";
import AdminRoutes from "./admin/AdminRoutes";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />

          {/* Main Layout containing NavBar, Sidebar, etc. */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="report" element={<ReportIncident />} />
            <Route path="chat" element={<Chatbot />} />
            <Route path="safe-routes" element={<SafeRoute />} />
            <Route path="community" element={<Community />} />
            <Route path="content" element={<ContentLibrary />} />
          </Route>

          {/* Full-screen App Routes */}
          <Route path="/sos" element={<SOS />} />

          {/* Admin Routes - Temporarily unprotected for development */}
          <Route
            path="/admin/*"
            element={<AdminRoutes />}
          />
        </Routes>
      </Router>
  );
}
