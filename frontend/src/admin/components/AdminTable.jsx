import { ChevronRight, MoreHorizontal } from "lucide-react";

export default function AdminTable({
    title,
    icon: Icon,
    headers,
    data,
    renderRow
}) {
    return (
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800/50">
            {title && (
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                        {Icon && <Icon className="h-5 w-5 text-blue-400" />}
                        {title}
                    </h3>
                    <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        View All <ChevronRight className="h-3 w-3" />
                    </button>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-slate-400 border-b border-slate-800 bg-slate-900/50">
                        <tr>
                            {headers.map((h, i) => (
                                <th key={i} className={`py-3 px-4 font-medium ${i === 0 ? "pl-4" : ""}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {data && data.length > 0 ? (
                            data.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                                    {renderRow ? renderRow(row, i) : (
                                        <>
                                            {Object.values(row).map((cell, ci) => (
                                                <td key={ci} className="py-3 px-4 text-slate-300">{cell}</td>
                                            ))}
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headers.length} className="py-8 text-center text-slate-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
