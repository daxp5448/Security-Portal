import { useState, useEffect } from "react";
import { FileText, Download, Calendar, Filter } from "lucide-react";
import gsap from 'gsap';
import PageTransition from '../../components/PageTransition';

export default function ReportsExport() {
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.reports-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    tl.fromTo('.report-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.3');
    return () => tl.kill();
  }, []);

  const reports = [
    { id: 1, name: "Monthly Incident Report", date: "2026-04-01", type: "PDF", size: "2.4 MB" },
    { id: 2, name: "User Activity Log", date: "2026-03-28", type: "CSV", size: "1.8 MB" },
    { id: 3, name: "Officer Performance", date: "2026-03-25", type: "PDF", size: "3.1 MB" },
    { id: 4, name: "Safety Analytics Q1", date: "2026-03-20", type: "PDF", size: "5.2 MB" },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="reports-header flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <FileText className="w-8 h-8 text-cyan-400" />
              Reports & Export
            </h1>
            <p className="text-gray-400">Generate and download safety reports</p>
          </div>
          <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2">
            <Download className="w-4 h-4" /> Generate New Report
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input type="date" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
              <option>All Types</option>
              <option>PDF</option>
              <option>CSV</option>
              <option>Excel</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="report-card bg-slate-900 rounded-xl p-5 border border-slate-800 flex items-center justify-between hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold">{report.name}</h3>
                  <p className="text-sm text-gray-400">{report.date} • {report.type} • {report.size}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200 flex items-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
