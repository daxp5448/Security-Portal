import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import gsap from 'gsap'
import {
    AlertTriangle,
    Calendar,
    Clock,
    MapPin,
    FileText,
    Shield,
    CheckCircle2
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function ReportIncident() {
    const containerRef = useRef(null)
    const { t } = useLanguage()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [severity, setSeverity] = useState(50)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(containerRef.current, {
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            })

            gsap.from(".form-item", {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
                delay: 0.2
            })
        }, containerRef)
        return () => ctx.revert()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSubmitted(true)
            e.target.reset()
        }, 1500)
    }

    return (
        <div className="min-h-screen py-10 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -z-10" />

            <div ref={containerRef} className="max-w-4xl mx-auto">
                <div className="text-center mb-12 form-item">
                    <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4 text-red-600 dark:text-red-400">
                        <Shield className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        {t('report.title')}
                    </h1>
                    <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
                        {t('report.subtitle')}
                    </p>
                </div>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700 relative overflow-hidden">
                    {isSubmitted && (
                        <div className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
                            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('report.success')}</h3>
                            <p className="text-muted-foreground dark:text-gray-300">Thank you for your report. Our security team has been notified.</p>
                            <Button className="mt-6" onClick={() => setIsSubmitted(false)}>Submit Another Report</Button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Incident Type Section */}
                        <div className="form-item space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                {t('report.typeLabel')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('report.typeLabel')}</label>
                                    <select className="w-full h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all ring-offset-2 focus:ring-2 focus:ring-blue-500/20 px-4 text-sm outline-none dark:bg-slate-900 dark:border-slate-600 dark:text-white">
                                        <option value="">Select Category...</option>
                                        <option value="phishing">{t('report.types.fraud')}</option>
                                        <option value="malware">Malware / Virus</option>
                                        <option value="access">Unauthorized Access</option>
                                        <option value="data">Data Leakage</option>
                                        <option value="physical">Physical Security</option>
                                        <option value="other">{t('report.types.other')}</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location / System</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <Input placeholder="e.g., Finance Server, Building B" className="pl-10 h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timing Section */}
                        <div className="form-item space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <Clock className="h-5 w-5 text-blue-500" />
                                Timeline
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('report.dateLabel').split(' & ')[0]}</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <Input type="date" className="pl-10 h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('report.dateLabel').split(' & ')[1] || 'Time'}</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <Input type="time" className="pl-10 h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="form-item space-y-2">
                            <label className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <FileText className="h-5 w-5 text-purple-500" />
                                {t('report.descLabel')}
                            </label>
                            <textarea
                                className="w-full min-h-[150px] rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-sm ring-offset-2 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y focus:bg-white transition-all dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                placeholder={t('community.newPostPlaceholder')}
                            />
                        </div>

                        {/* Severity Slider */}
                        <div className="form-item bg-gray-50/80 dark:bg-slate-900/50 p-6 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-6">
                                <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">{t('report.severityLabel')}</label>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${severity < 33 ? 'bg-green-100 text-green-700' :
                                    severity < 66 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {severity < 33 ? 'Low Impact' : severity < 66 ? 'Medium Impact' : 'Critical Impact'}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={severity}
                                onChange={(e) => setSeverity(e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-slate-700"
                            />
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium uppercase">
                                <span>Minor</span>
                                <span>Business Impact</span>
                                <span>Critical Failure</span>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="form-item pt-4 flex items-center justify-end gap-4">
                            <Button type="button" variant="ghost" className="text-muted-foreground hover:text-foreground">Cancel</Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 h-auto text-lg shadow-lg hover:shadow-blue-500/25 transition-all w-full md:w-auto">
                                {isSubmitting ? t('report.submitting') : t('report.submit')}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Secure Footer */}
                <div className="text-center mt-8 text-xs text-muted-foreground flex items-center justify-center gap-2 form-item">
                    <Shield className="h-3 w-3" />
                    <span>End-to-end encrypted submission. Your identity is protected.</span>
                </div>
            </div>
        </div>
    )
}
