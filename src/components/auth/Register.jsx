import React, { useState, useRef } from "react";
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight,
  Building2, Gavel, Phone, MapPin, CreditCard,
  Landmark, Upload, X, Wallet, CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/queries/auth";
import { toast } from "sonner";
import PrimaryButton from "../shared/PrimaryButton";

/* ── Reusable helpers ─────────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <p className="text-xs font-semibold uppercase tracking-[3px] text-yellow-600 pb-2.5 border-b border-stone-200">
    {children}
  </p>
);

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs font-semibold uppercase tracking-widest text-stone-600">{label}</span>
    {children}
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

/* ── Main Component ───────────────────────────────────────────────── */
const Register = () => {
  const fileRef = useRef(null);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "Bidder",
    bankAccountNumber: "",
    bankAccountName: "",
    bankName: "",
    paypalEmail: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl]     = useState("");
  const [showPw, setShowPw]             = useState(false);
  const [showCpw, setShowCpw]           = useState(false);
  const [errors, setErrors]             = useState({});

  const navigate = useNavigate();

  /* ── Mutation ─────────────────────────────────────────────── */
  const {mutate: registerUser, isPending} = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      toast.success("User has been registered successfully");
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      if (data.token) navigate({ to: "/" });
    },
    onError: (error) => toast.error(error.message)
  });

  /* ── Handlers ─────────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setErrors((p) => ({ ...p, profileImage: "Only PNG, JPEG, or WEBP allowed." }));
      return;
    }
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrors((p) => ({ ...p, profileImage: "" }));
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setProfileImage(null);
    setPreviewUrl("");
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ── Validation ───────────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!profileImage) e.profileImage = "Profile image is required.";
    if (!formData.userName.trim()) e.userName = "Username is required.";
    else if (formData.userName.trim().length < 3) e.userName = "At least 3 characters.";
    if (!formData.email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Invalid email address.";
    if (!formData.phone) e.phone = "Phone number is required.";
    else if (!/^\+?[\d\s\-()]{6,}$/.test(formData.phone)) e.phone = "Invalid phone number.";
    if (!formData.address.trim()) e.address = "Address is required.";
    if (!formData.password) e.password = "Password is required.";
    else if (formData.password.length < 8) e.password = "At least 8 characters.";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      e.password = "Must include uppercase, lowercase & number.";
    if (!formData.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match.";
    if (formData.role === "Auctioneer") {
      if (!formData.bankAccountNumber.trim()) e.bankAccountNumber = "Bank account number required.";
      if (!formData.bankAccountName.trim())  e.bankAccountName  = "Account holder name required.";
      if (!formData.bankName.trim())         e.bankName         = "Bank name required.";
      if (!formData.paypalEmail)             e.paypalEmail      = "PayPal email is required.";
      else if (!/\S+@\S+\.\S+/.test(formData.paypalEmail)) e.paypalEmail = "Invalid PayPal email.";
    }
    return e;
  };

  /* ── Submit ───────────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    const data = new FormData();
    data.append("profileImage", profileImage);
    Object.entries(formData).forEach(([k, v]) => {
      if (k !== "confirmPassword" && k !== "agreeToTerms") data.append(k, v);
    });
    registerUser(data);
  };

  /* ── Input class helper ───────────────────────────────────────── */
  const inputCls = (err) =>
    [
      "w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white text-stone-800 text-sm",
      "placeholder-stone-300 outline-none transition-all duration-200",
      "focus:ring-2 focus:ring-yellow-400/30",
      err
        ? "border-red-400 focus:border-red-400"
        : "border-stone-200 focus:border-yellow-500",
    ].join(" ");

  const isAuctioneer = formData.role === "Auctioneer";

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute -top-1/2 -right-1/4 w-96 h-96 lg:w-[600px] lg:h-[600px] bg-gradient-radial rounded-full animate-float"></div>
      <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 lg:w-[500px] lg:h-[500px] bg-gradient-radial rounded-full animate-float" style={{ animationDelay: '5s' }}></div>

      {/* ── Card ── max-w-2xl gives ~672px, much more comfortable */}
      <div className="w-full max-w-xl relative z-10">

        <div className="bg-[#FDFAF6] rounded-2xl shadow-2xl overflow-hidden border border-stone-200">

          {/* ── Header ── */}
          <div className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-yellow-950 px-10 py-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_100%_at_100%_0%,rgba(201,147,60,0.28),transparent)]" />
            <span className="absolute -top-3 right-9 text-[96px] leading-none text-yellow-300/5 font-serif select-none pointer-events-none">
              ⚖
            </span>
            <p className="relative text-xs font-semibold tracking-[3px] uppercase text-yellow-400">
              Elite Auction House
            </p>
            <h1 className="relative mt-1.5 font-serif text-4xl font-black text-white leading-tight">
              Create Your Account
            </h1>
            <p className="relative mt-1 text-sm text-white/50">
              Join our exclusive community of collectors &amp; sellers
            </p>
          </div>

          {/* ── Body ── */}
          <div className="px-10 py-9 space-y-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-8">

              {/* ── ROLE ── */}
              <div className="space-y-3">
                <SectionLabel>Your Role</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "Bidder",     Icon: Gavel,     desc: "Discover & bid on items" },
                    { value: "Auctioneer", Icon: Building2, desc: "List & manage auctions"  },
                  ].map(({ value, Icon, desc }) => {
                    const active = formData.role === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, role: value }))}
                        className={[
                          "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200",
                          active
                            ? "border-yellow-600 bg-gradient-to-r from-yellow-500 to-yellow-700 shadow-md"
                            : "border-stone-200 bg-white hover:border-yellow-300 hover:bg-yellow-50/40",
                        ].join(" ")}
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${active ? "bg-white/20" : "bg-stone-100"}`}>
                          <Icon size={20} className={active ? "text-white" : "text-stone-400"} />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${active ? "text-white" : "text-stone-500"}`}>{value}</p>
                          <p className={`text-xs mt-0.5 ${active ? "text-yellow-100" : "text-stone-400"}`}>{desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── PROFILE IMAGE ── */}
              <div className="space-y-3">
                <SectionLabel>Profile Photo</SectionLabel>
                <div
                  onClick={() => fileRef.current?.click()}
                  role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
                  className={[
                    "flex items-center gap-5 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
                    previewUrl
                      ? "border-emerald-400 bg-emerald-50/60"
                      : "border-stone-200 bg-white hover:border-yellow-400 hover:bg-yellow-50/40",
                  ].join(" ")}
                >
                  <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} className="hidden" />

                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-stone-200 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-yellow-50 border-2 border-dashed border-yellow-300 flex items-center justify-center shrink-0">
                      <Upload size={22} className="text-yellow-500" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {profileImage ? (
                      <>
                        <p className="text-sm font-medium text-stone-700 flex items-center gap-1.5 truncate">
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                          {profileImage.name}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {(profileImage.size / 1024).toFixed(0)} KB · Click to change
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-stone-600">Upload profile photo</p>
                        <p className="text-xs text-stone-400 mt-0.5">PNG, JPEG or WEBP · Click to browse</p>
                      </>
                    )}
                  </div>

                  {profileImage && (
                    <button
                      type="button" onClick={removeFile}
                      className="ml-auto w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center shrink-0 transition-colors"
                    >
                      <X size={13} className="text-red-500" />
                    </button>
                  )}
                </div>
                {errors.profileImage && <p className="text-xs text-red-500">{errors.profileImage}</p>}
              </div>

              {/* ── BASIC INFO ── */}
              <div className="space-y-4">
                <SectionLabel>Basic Information</SectionLabel>

                {/* Username */}
                <Field label="Username" error={errors.userName}>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" />
                    <input className={inputCls(errors.userName)} name="userName" value={formData.userName} onChange={handleChange} placeholder="johndoe" />
                  </div>
                </Field>

                {/* Email + Phone — now properly side-by-side */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email Address" error={errors.email}>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" />
                      <input className={inputCls(errors.email)} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                    </div>
                  </Field>
                  <Field label="Phone Number" error={errors.phone}>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" />
                      <input maxLength={10} className={inputCls(errors.phone)} type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
                    </div>
                  </Field>
                </div>

                {/* Address */}
                <Field label="Address" error={errors.address}>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" />
                    <input className={inputCls(errors.address)} name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, New York, NY 10001" />
                  </div>
                </Field>
              </div>

              {/* ── SECURITY ── */}
              <div className="space-y-4">
                <SectionLabel>Security</SectionLabel>
                <div className="grid grid-cols-2 gap-4">

                  <Field label="Password" error={errors.password}>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" />
                      <input
                        className={`${inputCls(errors.password)} pr-10`}
                        type={showPw ? "text" : "password"}
                        name="password" value={formData.password}
                        onChange={handleChange} placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>

                  <Field label="Confirm Password" error={errors.confirmPassword}>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" />
                      <input
                        className={`${inputCls(errors.confirmPassword)} pr-10`}
                        type={showCpw ? "text" : "password"}
                        name="confirmPassword" value={formData.confirmPassword}
                        onChange={handleChange} placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowCpw(!showCpw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors">
                        {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>
                </div>
              </div>

              {/* ── AUCTIONEER PANEL ── */}
              {isAuctioneer && (
                <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-6 space-y-5">
                  <div>
                    <span className="inline-flex items-center gap-1.5 bg-yellow-500 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
                      <Landmark size={11} /> Auctioneer Details
                    </span>
                    <p className="text-xs text-stone-500 mt-2">
                      We need your payment details to process auction proceeds.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <SectionLabel>Bank Transfer</SectionLabel>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Bank Name" error={errors.bankName}>
                        <div className="relative">
                          <Landmark size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" />
                          <input className={inputCls(errors.bankName)} name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Chase Bank" />
                        </div>
                      </Field>
                      <Field label="Account Holder Name" error={errors.bankAccountName}>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" />
                          <input className={inputCls(errors.bankAccountName)} name="bankAccountName" value={formData.bankAccountName} onChange={handleChange} placeholder="John Doe" />
                        </div>
                      </Field>
                    </div>
                    <Field label="Bank Account Number" error={errors.bankAccountNumber}>
                      <div className="relative">
                        <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" />
                        <input className={inputCls(errors.bankAccountNumber)} name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" />
                      </div>
                    </Field>
                  </div>

                  <div className="space-y-4">
                    <SectionLabel>PayPal</SectionLabel>
                    <Field label="PayPal Email" error={errors.paypalEmail}>
                      <div className="relative">
                        <Wallet size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" />
                        <input className={inputCls(errors.paypalEmail)} type="email" name="paypalEmail" value={formData.paypalEmail} onChange={handleChange} placeholder="paypal@example.com" />
                      </div>
                    </Field>
                  </div>
                </div>
              )}

              {/* ── SUBMIT ── */}
              <PrimaryButton isPending={isPending} disabled={isPending} rightIcon={true}>Register</PrimaryButton>

            </form>

            {/* Sign in */}
            <p className="mt-7 text-center text-sm text-stone-500">
              Already have an account?{" "}
              <Link to="/login" className="text-yellow-600 font-semibold hover:underline">
                Sign in →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-stone-400 mt-6 tracking-wide">
          © 2024 EliteAuction · All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Register;