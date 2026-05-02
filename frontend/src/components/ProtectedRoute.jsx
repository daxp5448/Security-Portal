import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const isAuth = localStorage.getItem("isAuthenticated") === "true"
  const role = localStorage.getItem("role")

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return children
}
