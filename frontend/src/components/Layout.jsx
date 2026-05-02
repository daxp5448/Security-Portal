import React from 'react'
import { Navbar } from './Navbar'
import { Outlet } from 'react-router-dom'
import FloatingChatbot from './FloatingChatbot'

export default function Layout() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 dark:from-slate-950 dark:to-slate-900 flex flex-col font-sans text-gray-900 dark:text-slate-100">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6">
                <Outlet />
            </main>
            <footer className="py-6 border-t bg-background dark:border-slate-800">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    © 2026 Sentinel Shield. All rights reserved.
                    <div className="mt-2 space-x-4">
                        <a href="#" className="hover:underline">Privacy Policy</a>
                        <a href="#" className="hover:underline">Terms of Service</a>
                    </div>
                </div>
            </footer>
            
            {/* Floating Chatbot - Available on all user pages */}
            <FloatingChatbot />
        </div>
    )
}
