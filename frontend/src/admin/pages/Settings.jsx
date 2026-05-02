import { Settings as SettingsIcon, Save, Bell, Lock, User, Monitor } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6 text-white pb-10 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-slate-400 text-sm">Configure system preferences and security policies.</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800/50">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Monitor className="h-5 w-5 text-blue-400" />
            General Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">System Name</label>
              <input type="text" defaultValue="Sentinel Shield v1.0" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-slate-300">Maintenance Mode</p>
                <p className="text-xs text-slate-500">Disable access for non-admins</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800/50">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-400" />
            Security Policies
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Session Timeout (minutes)</label>
              <input type="number" defaultValue="30" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-slate-300">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Enforce 2FA for all admin accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
