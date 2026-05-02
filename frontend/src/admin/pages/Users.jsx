import { useState, useEffect } from "react";
import { Users as UsersIcon, UserPlus, Trash2, Mail, Shield, X } from "lucide-react";
import AdminTable from "../components/AdminTable";
import { adminService } from "../../services/adminService";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import AlertBox from "../components/AlertBox";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [alert, setAlert] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete User",
      message: `Are you sure you want to delete ${user.full_name || user.email}? This action cannot be undone.`,
      type: "danger",
      onConfirm: async () => {
        try {
          await adminService.deleteUser(user.id);
          setUsers(users.filter((u) => u.id !== user.id));
          setAlert({ type: "success", message: "User deleted successfully" });
        } catch (error) {
          setAlert({ type: "error", message: "Failed to delete user" });
        } finally {
          setConfirmDialog({ isOpen: false });
        }
      }
    });
  };

  const handleToggleBlock = async (user) => {
    try {
      await adminService.toggleUserBlock(user.id, !user.is_active);
      fetchUsers();
      setAlert({ 
        type: "success", 
        message: `User ${user.is_active ? "blocked" : "unblocked"} successfully` 
      });
    } catch (error) {
      setAlert({ type: "error", message: "Failed to update user status" });
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      fetchUsers();
      setAlert({ type: "success", message: "User role updated successfully" });
    } catch (error) {
      setAlert({ type: "error", message: "Failed to update user role" });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminService.createUser({
        email: newUser.email,
        password: newUser.password,
        full_name: newUser.fullName,
        is_active: true
      });
      setShowModal(false);
      setNewUser({ email: "", password: "", fullName: "" });
      fetchUsers();
      setAlert({ type: "success", message: "User created successfully" });
    } catch (error) {
      setAlert({ type: "error", message: "Failed to create user. Email might be taken." });
    }
  };

  return (
    <div className="space-y-6 text-white pb-10">
      {/* Alert Box */}
      {alert && (
        <AlertBox
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false })}
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-slate-400 text-sm">Manage system access and user roles.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading users...</p>
      ) : (
        <AdminTable
          title="All Users"
          icon={UsersIcon}
          headers={["Name", "Email", "Role", "Status", "Actions"]}
          data={users}
          renderRow={(row) => (
            <>
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {(row.full_name || row.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-200 font-medium">{row.full_name || "N/A"}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-slate-400 text-sm flex items-center gap-2">
                <Mail className="h-3 w-3" />
                {row.email}
              </td>
              <td className="py-3 px-4">
                <select
                  value={row.role || 'user'}
                  onChange={(e) => handleRoleChange(row.id, e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.is_active ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                  {row.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleBlock(row)}
                    className={`p-1 hover:bg-slate-700 rounded transition-colors ${row.is_active ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"}`}
                    title={row.is_active ? "Block User" : "Unblock User"}
                  >
                    <Shield className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(row)}
                    className="p-1 hover:bg-red-900/30 rounded text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete User"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </>
          )}
        />
      )}

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-500" />
              Add New User
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Full Name</label>
                <Input
                  required
                  placeholder="John Doe"
                  className="bg-slate-800 border-slate-700 text-white"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Email</label>
                <Input
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="bg-slate-800 border-slate-700 text-white"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Password</label>
                <Input
                  required
                  type="password"
                  placeholder="Secret123"
                  className="bg-slate-800 border-slate-700 text-white"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500">
                  Create User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
