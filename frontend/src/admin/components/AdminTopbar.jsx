export default function AdminTopbar() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#050b14]">
      <div>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-gray-400">Overview</p>
      </div>

      <div className="flex gap-8">
        <Stat title="Total Threats" value="1,245" color="text-red-400" />
        <Stat title="Active Incidents" value="42" color="text-orange-400" />
        <Stat title="System Status" value="Secure" color="text-green-400" />
      </div>
    </div>
  )
}

function Stat({ title, value, color }) {
  return (
    <div className="text-right">
      <p className="text-xs text-gray-400">{title}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  )
}
