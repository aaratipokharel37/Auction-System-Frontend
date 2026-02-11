import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/queries/auth";
import { toast } from "sonner";
import PrimaryButton from "../shared/PrimaryButton";

/* ── Reusable helpers ───────────────────────────────────────────── */
const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs font-semibold uppercase tracking-widest text-stone-600">
      {label}
    </span>
    {children}
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

/* ── Main Component ─────────────────────────────────────────────── */
const Login = () => {
  /* ── State ─────────────────────────────────────────────────── */
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  /* ── Mutation ─────────────────────────────────────────────── */
  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success("Login successful");


    // Save auth data
    localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate({ to: "/" }); // home
    },
    onError: (error) => toast.error(error.message),
  });


  /* ── Handlers ─────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };


  /* ── Validation ───────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!formData.email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Invalid email address.";

    if (!formData.password) e.password = "Password is required.";
    else if (formData.password.length < 6)
      e.password = "Password must be at least 6 characters.";

    return e;
  };


   /* ── Submit ─────────────────────────────────────────────── */
   const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    loginUser(formData);
  };

  /* ── Input class helper ───────────────────────────────────── */
  const inputCls = (err) =>
    [
      "w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white text-stone-800 text-sm",
      "placeholder-stone-300 outline-none transition-all duration-200",
      "focus:ring-2 focus:ring-yellow-400/30",
      err
        ? "border-red-400 focus:border-red-400"
        : "border-stone-200 focus:border-yellow-500",
    ].join(" ");
  

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute -top-1/2 -right-1/4 w-96 h-96 lg:w-[600px] lg:h-[600px] bg-gradient-radial rounded-full animate-float"></div>
      <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 lg:w-[500px] lg:h-[500px] bg-gradient-radial rounded-full animate-float" style={{ animationDelay: '5s' }}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
    

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeInUp delay-200">
          <h2 className="font-display text-3xl font-bold text-primary mb-2">Sign In</h2>
          <p className="text-gray-600 mb-8">Access your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-200 focus:border-secondary'
                  }`}
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPw ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-200 focus:border-secondary'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPw ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-secondary hover:text-accent font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 cursor-pointer text-white py-3 rounded-xl font-semibold hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-yellow-500  font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-400 text-sm mt-8">
          © 2024 EliteAuction. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;