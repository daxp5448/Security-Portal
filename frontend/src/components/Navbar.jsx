import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Shield, Home, TriangleAlert, Users, BookOpen, Bell, CircleHelp, LogIn, LogOut, Sun, Moon, Globe, ShieldCheck, LayoutDashboard, Phone } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './ui/Button'

import { useLanguage } from '../contexts/LanguageContext'

export function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { lang, setLang, t } = useLanguage()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isDark, setIsDark] = useState(false)
    const [showLangDropdown, setShowLangDropdown] = useState(false)

    // Language names mapping
    const languages = [
        { code: 'EN', name: 'English', native: 'English', flag: '🇬🇧' },
        { code: 'HI', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
        { code: 'BN', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
        { code: 'TE', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
        { code: 'MR', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
        { code: 'TA', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
        { code: 'GU', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
        { code: 'KN', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
        { code: 'ML', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
        { code: 'PA', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
        { code: 'OR', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' }
    ]

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true')

        // Initial Theme Check
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true)
            document.documentElement.classList.add('dark')
        } else {
            setIsDark(false)
            document.documentElement.classList.remove('dark')
        }
    }, [location.pathname])

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('role')
        setIsAuthenticated(false)
        navigate('/login')
    }

    const toggleTheme = () => {
        const newTheme = !isDark
        setIsDark(newTheme)
        if (newTheme) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    const handleLanguageSelect = (langCode) => {
        setLang(langCode)
        setShowLangDropdown(false)
    }

    const navItems = [
        { name: t('nav.home'), path: '/', icon: Home },
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: t('nav.report'), path: '/report', icon: TriangleAlert },
        { name: t('nav.community'), path: '/community', icon: Users },
        { name: t('nav.content'), path: '/content', icon: BookOpen },
    ]

    return (
        <nav className="border-b bg-white/80 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 sticky top-0 z-50 dark:bg-[#0F172A]/80 dark:border-slate-800 transition-colors">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary shrink-0">
                    <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    <span className="hidden lg:block dark:text-white">SurakshaSetu</span>
                </Link>

                {/* Navigation Links - Simplified */}
                <div className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                    isActive 
                                        ? "text-primary bg-primary/10 dark:text-blue-400 dark:bg-blue-500/10" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-gray-100/50 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="hidden xl:inline">{item.name}</span>
                            </Link>
                        )
                    })}
                </div>

                {/* Right Side Actions - Streamlined */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-slate-800/50 text-gray-500 dark:text-slate-300 transition-colors">
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>

                    {/* Language Selector Dropdown */}
                    <div className="relative hidden sm:block">
                        <button 
                            onClick={() => setShowLangDropdown(!showLangDropdown)} 
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-slate-800/50 text-gray-500 dark:text-slate-300 text-xs font-medium transition-colors"
                        >
                            <Globe className="h-4 w-4" />
                            <span className="max-w-[80px] truncate">
                                {languages.find(l => l.code === lang)?.native || lang}
                            </span>
                            <svg className={`w-3 h-3 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Language Dropdown Card */}
                        {showLangDropdown && (
                            <>
                                {/* Backdrop */}
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setShowLangDropdown(false)}
                                />
                                
                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 w-64 glass-card rounded-xl shadow-2xl border border-border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-2 border-b border-border">
                                        <p className="text-xs font-semibold text-muted-foreground px-2 py-1">Select Language</p>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto p-1">
                                        {languages.map((language) => (
                                            <button
                                                key={language.code}
                                                onClick={() => handleLanguageSelect(language.code)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left",
                                                    lang === language.code
                                                        ? "bg-primary/10 text-primary"
                                                        : "hover:bg-gray-100/50 dark:hover:bg-slate-800/50"
                                                )}
                                            >
                                                <span className="text-lg">{language.flag}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{language.native}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{language.name}</p>
                                                </div>
                                                {lang === language.code && (
                                                    <svg className="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* SOS Emergency Button - Compact */}
                    <Link 
                        to="/sos" 
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium text-xs shadow-md hover:shadow-lg hover:scale-105"
                    >
                        <Phone className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">SOS</span>
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            {/* Admin Portal Link - Icon Only */}
                            <Link 
                                to="/admin/dashboard" 
                                className="hidden sm:flex items-center justify-center w-9 h-9 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-all duration-200 dark:text-cyan-400 dark:hover:bg-cyan-900/20"
                                title="Admin Panel"
                            >
                                <ShieldCheck className="h-4 w-4" />
                            </Link>
                            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300 dark:border-slate-600">
                                <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile" className="h-full w-full object-cover" />
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 gap-1.5 px-2">
                                <LogOut className="h-4 w-4" /> 
                                <span className="hidden xl:inline">Logout</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {/* Quick Admin Access - Icon Only */}
                            <Link 
                                to="/admin/dashboard" 
                                className="hidden sm:flex items-center justify-center w-9 h-9 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-all duration-200 dark:text-cyan-400 dark:hover:bg-cyan-900/20"
                                title="Admin Panel"
                            >
                                <ShieldCheck className="h-4 w-4" />
                            </Link>
                            <Link to="/login">
                                <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 px-3">
                                    <LogIn className="h-4 w-4" /> 
                                    <span className="hidden md:inline">Login</span>
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
