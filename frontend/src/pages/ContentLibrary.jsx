import React, { useState, useEffect, useRef } from 'react'
import { Book, PlayCircle, Lock, Shield, FileText, Search } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useLanguage } from '../contexts/LanguageContext'
import gsap from 'gsap'
import PageTransition from '../components/PageTransition'
import FloatingCard from '../components/FloatingCard'

export default function ContentLibrary() {
    const { t } = useLanguage()
    const [activeCategory, setActiveCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    const gridRef = useRef([])

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo('.content-header',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
        tl.fromTo('.content-card',
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
            '-=0.3'
        );
        return () => tl.kill();
    }, [activeCategory]);

    const courses = [
        { title: "Password Security 101", category: "Basics", icon: Lock, color: "text-blue-600", bg: "bg-blue-100", wiki: "https://en.wikipedia.org/wiki/Password_strength", youtube: "https://www.youtube.com/results?search_query=password+security" },
        { title: "Two Factor Authentication", category: "Basics", icon: Lock, color: "text-green-600", bg: "bg-green-100", wiki: "https://en.wikipedia.org/wiki/Multi-factor_authentication", youtube: "https://www.youtube.com/results?search_query=two+factor+authentication" },
        { title: "Network Basics", category: "Basics", icon: Lock, color: "text-emerald-600", bg: "bg-emerald-100", wiki: "https://en.wikipedia.org/wiki/Computer_network", youtube: "https://www.youtube.com/results?search_query=network+basics" },
        { title: "Email Security", category: "Basics", icon: Lock, color: "text-sky-600", bg: "bg-sky-100", wiki: "https://en.wikipedia.org/wiki/Email_security", youtube: "https://www.youtube.com/results?search_query=email+security" },

        { title: "Phishing Assessment", category: "Prevention", icon: Shield, color: "text-red-600", bg: "bg-red-100", wiki: "https://en.wikipedia.org/wiki/Phishing", youtube: "https://www.youtube.com/results?search_query=phishing+attack" },
        { title: "Social Engineering", category: "Prevention", icon: Shield, color: "text-orange-600", bg: "bg-orange-100", wiki: "https://en.wikipedia.org/wiki/Social_engineering_(security)", youtube: "https://www.youtube.com/results?search_query=social+engineering+cyber" },
        { title: "Public WiFi Safety", category: "Prevention", icon: Shield, color: "text-yellow-600", bg: "bg-yellow-100", wiki: "https://en.wikipedia.org/wiki/Wireless_security", youtube: "https://www.youtube.com/results?search_query=public+wifi+security" },
        { title: "Malware Protection", category: "Prevention", icon: Shield, color: "text-pink-600", bg: "bg-pink-100", wiki: "https://en.wikipedia.org/wiki/Malware", youtube: "https://www.youtube.com/results?search_query=malware+protection" },
        { title: "Ransomware Defense", category: "Prevention", icon: Shield, color: "text-rose-600", bg: "bg-rose-100", wiki: "https://en.wikipedia.org/wiki/Ransomware", youtube: "https://www.youtube.com/results?search_query=ransomware+attack" },

        { title: "Data Privacy Law", category: "Advanced", icon: FileText, color: "text-purple-600", bg: "bg-purple-100", wiki: "https://en.wikipedia.org/wiki/Information_privacy", youtube: "https://www.youtube.com/results?search_query=data+privacy+law" },
        { title: "Cloud Security", category: "Advanced", icon: PlayCircle, color: "text-cyan-600", bg: "bg-cyan-100", wiki: "https://en.wikipedia.org/wiki/Cloud_computing_security", youtube: "https://www.youtube.com/results?search_query=cloud+security" },
        { title: "Zero Day Attacks", category: "Advanced", icon: PlayCircle, color: "text-indigo-600", bg: "bg-indigo-100", wiki: "https://en.wikipedia.org/wiki/Zero-day_(computing)", youtube: "https://www.youtube.com/results?search_query=zero+day+attack" },
        { title: "SQL Injection", category: "Advanced", icon: PlayCircle, color: "text-fuchsia-600", bg: "bg-fuchsia-100", wiki: "https://en.wikipedia.org/wiki/SQL_injection", youtube: "https://www.youtube.com/results?search_query=sql+injection" },
        { title: "DDoS Attacks", category: "Advanced", icon: PlayCircle, color: "text-violet-600", bg: "bg-violet-100", wiki: "https://en.wikipedia.org/wiki/Denial-of-service_attack", youtube: "https://www.youtube.com/results?search_query=ddos+attack" },
        { title: "Cyber Laws", category: "Advanced", icon: FileText, color: "text-slate-600", bg: "bg-slate-100", wiki: "https://en.wikipedia.org/wiki/Cyberlaw", youtube: "https://www.youtube.com/results?search_query=cyber+law" },
    ];


    const filteredCourses = activeCategory === 'All'
        ? courses
        : courses.filter(c => c.category === activeCategory)

    const searchedCourses = searchQuery
        ? filteredCourses.filter(c => 
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : filteredCourses

    const categories = [
        { id: 'All', label: t('content.categories.all') },
        { id: 'Basics', label: t('content.categories.basics') },
        { id: 'Prevention', label: t('content.categories.prevention') },
        { id: 'Advanced', label: t('content.categories.advanced') }
    ]

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto py-8 px-4 relative">
                {/* Non-intrusive login prompt for non-authenticated users */}
                {!isAuthenticated && (
                    <div className="mb-6 glass-panel p-4 rounded-xl flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            💡 Create an account to track your progress and save courses
                        </p>
                        <a href="/login" className="text-sm text-primary hover:underline font-medium">
                            Sign Up
                        </a>
                    </div>
                )}

                <div className="content-header text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                    {t('content.title')}
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t('content.subtitle')}
                </p>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search courses..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border bg-background text-foreground border-border focus:ring-2 focus:ring-primary outline-none transition-all duration-200"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === cat.id
                                    ? 'bg-primary text-white'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchedCourses.map((course, i) => (
                        <FloatingCard
                            key={i}
                            className="content-card glass-card rounded-2xl p-6 hover:shadow-lg transition-all group relative overflow-hidden"
                            delay={i * 0.05}
                        >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <course.icon className={`h-24 w-24 ${course.color}`} />
                        </div>

                        <div className={`w-12 h-12 rounded-xl ${course.bg} flex items-center justify-center mb-4`}>
                            <course.icon className={`h-6 w-6 ${course.color}`} />
                        </div>

                        <div className="mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">
                                {categories.find(c => c.id === course.category)?.label || course.category}
                            </span>
                            <h3 className="text-xl font-bold">
                                {course.title}
                            </h3>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => window.open(course.wiki, '_blank')}
                            >
                                <Book className="mr-2 h-4 w-4" /> {t('content.readArticle')}
                            </Button>

                            <Button
                                className="w-full bg-red-600 hover:bg-red-500 text-white"
                                onClick={() => window.open(course.youtube, '_blank')}
                            >
                                <PlayCircle className="mr-2 h-4 w-4" /> Watch Video
                            </Button>
                            </div>
                        </FloatingCard>
                    ))}
                </div>

                {searchedCourses.length === 0 && (
                    <div className="text-center py-12">
                        <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-lg text-muted-foreground">No courses found matching your search</p>
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
