export default function StatCard({ title, value, color, icon: Icon }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl flex justify-between items-start hover:bg-slate-800 transition">
      <div>
        <p className="text-slate-400 text-sm">{title}</p>
        <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
      </div>

      {Icon && (
        <div className="p-2 bg-slate-800 rounded-lg">
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      )}
    </div>
  );
}
