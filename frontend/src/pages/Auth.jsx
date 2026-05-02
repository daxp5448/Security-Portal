import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { loginUser, registerUser, forgotPasswordItem } from "../services/authService";

export default function Auth() {
  const [view, setView] = useState("login"); // 'login', 'register', 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    securityA: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Explicitly snap the root HTML to dark mode when visiting Auth
    document.documentElement.classList.add("dark");
  }, []);

  /* ===================== LOGIN ===================== */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await loginUser(formData.email, formData.password);
      const { access_token, refresh_token, role } = response.data;

      if (!access_token) throw new Error("Token missing");

      localStorage.setItem("access_token", access_token);
      if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", role || "user");
      
      // Ensure dark theme is firmly established globally for the first time
      document.documentElement.classList.add('dark');
      localStorage.setItem("theme", "dark");

      navigate(role === "admin" || role === "moderator" ? "/admin/dashboard" : "/");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Invalid email or password");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===================== REGISTER ===================== */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (currentStep < 3) {
      // Validate current step before proceeding
      if (currentStep === 1) {
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          setError("Please fill in all fields");
          return;
        }
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters long");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
      }
      if (currentStep === 2 && !formData.fullName) {
        setError("Please enter your full name");
        return;
      }
      setCurrentStep(currentStep + 1);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerUser({
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
      });

      setSuccess("Account successfully created! Please log in.");
      setView("login");
      setCurrentStep(1);
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        phone: "",
        securityA: "",
      });
    } catch (err) {
      if (err.response?.status === 422 && Array.isArray(err.response?.data?.detail)) {
        setError(err.response.data.detail.map(d => d.msg).join(', '));
      } else {
        setError(err.response?.data?.detail || "Registration failed");
      }
    }
  };

  /* ===================== FORGOT PASSWORD ===================== */
  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      await forgotPasswordItem(formData.email);
      setSuccess("A recovery link has been sent to your email.");
    } catch (err) {
      setError("Failed to send recovery email. Ensure email format is correct.");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== REGISTER STEPS ===================== */
  const renderStep = () => {
    const inputClass = "bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-primary/50 focus:ring-primary/50 w-full";

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email Address"
              className={inputClass}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <div>
              <Input
                type="password"
                placeholder="Create Password (min 8 characters)"
                className={inputClass}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <p className="text-xs text-slate-400 mt-1 ml-1">Must be at least 8 characters</p>
            </div>
            <Input
              type="password"
              placeholder="Confirm Password"
              className={inputClass}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              className={inputClass}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <Input
              placeholder="Phone (Optional)"
              className={inputClass}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Input
              placeholder="Security PIN / Answer"
              className={inputClass}
              value={formData.securityA}
              onChange={(e) => setFormData({ ...formData, securityA: e.target.value })}
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-[420px] glass-panel p-8 rounded-2xl relative overflow-hidden shadow-2xl">
        {/* Soft Background Glows */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-10" />

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white p-3 rounded-xl mb-4 shadow-lg">
            <Shield className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {view === "login" && "Welcome Back"}
            {view === "register" && "Create Account"}
            {view === "forgot" && "Recover Account"}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {view === "login" && "Sign in to access your dashboard"}
            {view === "register" && `Step ${currentStep} of 3`}
            {view === "forgot" && "Enter your email to receive a reset link"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-4 fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-safe/10 border border-safe/50 text-safe p-3 rounded-lg text-sm mb-4 fade-in">
            {success}
          </div>
        )}

        {/* Toggle Tabs */}
        {view !== "forgot" && (
          <div className="flex mb-6 bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                view === "login" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-400 hover:text-white"
              }`}
              onClick={() => { setView("login"); setError(""); setSuccess(""); }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                view === "register" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-400 hover:text-white"
              }`}
              onClick={() => { setView("register"); setCurrentStep(1); setError(""); setSuccess(""); }}
            >
              Register
            </button>
          </div>
        )}

        {/* FORMS */}
        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-4 fade-in">
            <div className="space-y-1">
               <label className="text-xs font-medium text-slate-300 ml-1">Email Address</label>
               <Input
                 type="email"
                 placeholder="name@example.com"
                 className="bg-white/5 border border-white/10 text-white placeholder-white/30"
                 value={formData.email}
                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                 required
               />
            </div>
            <div className="space-y-1">
               <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  <button type="button" onClick={() => { setView("forgot"); setError(""); setSuccess(""); }} className="text-xs text-primary hover:text-primary/80 hover:underline">
                    Forgot password?
                  </button>
               </div>
               <div className="relative">
                 <Input
                   type={showPassword ? "text" : "password"}
                   placeholder="••••••••"
                   className="bg-white/5 border border-white/10 text-white placeholder-white/30 pr-10"
                   value={formData.password}
                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                   required
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                 >
                   {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                 </button>
               </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white transition-all transform hover:scale-[1.02]"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        )}

        {view === "register" && (
          <form onSubmit={handleRegister} className="space-y-6 fade-in">
            {renderStep()}
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 border-white/10 text-white hover:bg-white/5"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-white transition-all hover:scale-[1.02]"
              >
                {currentStep === 3 ? "Create Account" : "Next Step"}
                {currentStep !== 3 && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </form>
        )}

        {view === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-6 fade-in">
             <div className="space-y-1">
               <label className="text-xs font-medium text-slate-300 ml-1">Email Address</label>
               <Input
                 type="email"
                 placeholder="name@example.com"
                 className="bg-white/5 border border-white/10 text-white placeholder-white/30"
                 value={formData.email}
                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                 required
               />
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-transform hover:scale-[1.02]"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => { setView("login"); setError(""); setSuccess(""); }}
                className="w-full text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
