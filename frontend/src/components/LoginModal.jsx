import React from 'react'
import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function LoginModal() {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50 text-center max-w-sm mx-4 transform transition-all animate-in fade-in zoom-in duration-300">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4 text-blue-600">
                    <Lock className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
                <p className="text-muted-foreground mb-6">
                    Please log in to participate in the community and access premium content.
                </p>
                <div className="space-y-3">
                    <Link to="/login" className="block w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Log In to Continue
                        </Button>
                    </Link>
                    <button 
                        onClick={() => {
                            localStorage.setItem('isAuthenticated', 'true');
                            localStorage.setItem('role', 'admin');
                            localStorage.setItem('user', JSON.stringify({ name: 'Admin User', email: 'admin@surakshasetu.com' }));
                            window.location.href = '/admin/dashboard';
                        }}
                        className="w-full px-4 py-2 text-sm text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-all duration-200 border border-cyan-200 hover:border-cyan-300"
                    >
                        🔐 Quick Admin Access (Demo)
                    </button>
                    <p className="text-xs text-muted-foreground">
                        Don't have an account? <Link to="/login" className="text-blue-600 hover:underline">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginModal
