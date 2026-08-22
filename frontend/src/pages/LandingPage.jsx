import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Calendar,
  Stethoscope,
  FileText,
  Users,
  Sparkles,
  Pill,
  Video,
  Heart,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Play,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Features", href: "#features" },
    { label: "Contact", href: "#contact" },
  ];

  const services = [
    {
      title: "Cardiology",
      description:
        "Comprehensive heart care with advanced diagnostics and personalized treatment.",
      icon: Heart,
      image:
        "https://images.pexels.com/photos/4225920/pexels-photo-4225920.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      title: "Neurology",
      description:
        "Expert care for disorders of the brain, spine and nervous system.",
      icon: Activity,
      image:
        "https://images.pexels.com/photos/6234603/pexels-photo-6234603.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      title: "Dental Care",
      description:
        "Complete dental services for a healthy and confident smile.",
      icon: Stethoscope,
      image:
        "https://images.pexels.com/photos/6627562/pexels-photo-6627562.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

  const features = [
    {
      icon: Heart,
      title: "Experienced Doctors",
      subtitle: "Qualified healthcare specialists",
      color: "purple",
    },
    {
      icon: ShieldCheck,
      title: "Quality Healthcare",
      subtitle: "Safe and reliable medical care",
      color: "teal",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      subtitle: "Round-the-clock healthcare support",
      color: "amber",
    },
  ];

  const points = [
    "Patient-centered, compassionate care",
    "State-of-the-art medical equipment",
    "Personalized treatment plans",
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-slate-800">

      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">

            {/* Logo */}
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>

              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                Medi<span className="text-amber-500">sphere</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-semibold text-slate-600 hover:text-amber-500 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition shadow-sm"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <div className="md:hidden py-5 border-t border-slate-100">
              <div className="flex flex-col gap-4">

                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className="font-semibold text-slate-700 hover:text-amber-500"
                  >
                    {link.label}
                  </a>
                ))}

                <div className="flex gap-3 pt-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex-1 text-center py-3 rounded-full border border-slate-200 font-bold"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex-1 text-center py-3 rounded-full bg-amber-500 text-white font-bold"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section
        id="home"
        className="relative overflow-hidden pt-16 pb-20 lg:pt-24"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Hero Content */}
            <div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold mb-6">
                <Users className="w-4 h-4" />
                Trusted Healthcare Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-950">
                Your Health,
                <br />
                Our{" "}
                <span className="text-amber-500">Priority</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                MediSphere brings patients, doctors and clinical operations
                together through a modern healthcare management platform.
                Access quality care, manage appointments and stay connected
                with your healthcare team.
              </p>

              {/* Hero Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#services"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:border-amber-300 transition-all"
                >
                  Explore Services
                </a>

              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-3 gap-5 max-w-xl mt-12 pt-7 border-t border-slate-200">

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                    400+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">
                    Expert Doctors
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                    500+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">
                    Patients Treated
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                    97%
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">
                    Satisfaction
                  </div>
                </div>

              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative min-h-[500px] flex items-center justify-center">

              {/* Background Circle */}
              <div className="absolute w-[380px] h-[380px] sm:w-[460px] sm:h-[460px] rounded-full bg-[#F4EBDD]" />

              {/* Main Image */}
              <div className="relative w-[280px] h-[380px] sm:w-[330px] sm:h-[440px] rounded-[160px] overflow-hidden border-8 border-white shadow-2xl z-10 rotate-3">
                <img
                  src="https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Doctor with patient"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Secondary Image */}
              <div className="absolute bottom-4 left-2 sm:left-8 w-36 h-44 rounded-[70px] overflow-hidden border-4 border-white shadow-xl z-20 -rotate-6">
                <img
                  src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=500"
                  alt="Medical consultation"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 24/7 Badge */}
              <div className="absolute top-16 right-0 sm:right-5 bg-white rounded-2xl shadow-xl p-4 z-30 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-teal-600" />
                </div>

                <div>
                  <div className="text-sm font-extrabold text-slate-900">
                    24/7 Care
                  </div>
                  <div className="text-xs text-slate-500">
                    Always available
                  </div>
                </div>
              </div>

              {/* Floating Check */}
              <div className="absolute bottom-24 right-2 sm:right-12 w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg z-30">
                <CheckCircle2 className="w-7 h-7" />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STATS STRIP
      ========================================================= */}
      <section className="py-10 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-extrabold">400+</div>
                <div className="text-xs text-slate-400">
                  Expert Doctors
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <div className="text-2xl font-extrabold">500+</div>
                <div className="text-xs text-slate-400">
                  Patients Treated
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-extrabold">25+</div>
                <div className="text-xs text-slate-400">
                  Years Experience
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-extrabold">97%</div>
                <div className="text-xs text-slate-400">
                  Satisfaction Rate
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT
      ========================================================= */}
      <section
        id="about"
        className="py-20 lg:py-28 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Images */}
            <div className="relative">

              <div className="absolute -top-5 -left-5 w-24 h-24 rounded-3xl bg-amber-100" />

              <div className="relative grid grid-cols-2 gap-5">

                <div className="pt-12">
                  <img
                    src="https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Doctor consulting patient"
                    className="w-full h-[360px] object-cover rounded-[40px] shadow-xl"
                  />
                </div>

                <div>
                  <img
                    src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Healthcare professional"
                    className="w-full h-[360px] object-cover rounded-[40px] shadow-xl"
                  />
                </div>

              </div>

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-2xl px-6 py-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-slate-900">
                    15+
                  </div>
                  <div className="text-xs text-slate-500">
                    Years of Care
                  </div>
                </div>
              </div>

            </div>

            {/* Content */}
            <div>

              <span className="text-sm font-bold text-amber-600">
                — About MediSphere
              </span>

              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 leading-tight">
                A Legacy of Caring,
                <br />
                A Future of Healing
              </h2>

              <p className="mt-6 text-slate-600 leading-relaxed">
                MediSphere is designed to simplify clinical operations and
                connect patients, doctors and administrators through one
                intelligent healthcare management platform.
              </p>

              <p className="mt-4 text-slate-600 leading-relaxed">
                From appointment management to patient records and doctor
                operations, our platform helps healthcare teams provide
                efficient, organized and patient-centered care.
              </p>

              <div className="mt-7 space-y-4">
                {points.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    </div>

                    <span className="text-sm font-semibold text-slate-700">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition"
              >
                Discover More
                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}
      <section
        id="services"
        className="py-20 lg:py-28 bg-[#F5EFE6]/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

            <div>
              <span className="text-sm font-bold text-amber-600">
                — Our Services
              </span>

              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950">
                Specialized Medical
                <br />
                Services for Every Need
              </h2>
            </div>

            <p className="max-w-lg text-sm text-slate-600 leading-relaxed">
              From routine consultations to specialized treatments, MediSphere
              helps coordinate healthcare services efficiently while keeping
              patients and healthcare professionals connected.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className={`group bg-white rounded-[28px] p-5 shadow-sm hover:shadow-xl transition-all duration-300 ${
                    index === 1
                      ? "md:-translate-y-5"
                      : ""
                  }`}
                >

                  <div className="flex items-center justify-between mb-4">

                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {service.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-amber-600" />
                    </div>

                  </div>

                  <div className="relative h-56 rounded-2xl overflow-hidden">

                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <Link
                      to="/register"
                      className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg transition"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>

          <div className="text-center mt-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm"
            >
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================
          WHY CHOOSE US
      ========================================================= */}
      <section
        id="features"
        className="py-20 lg:py-28 bg-[#FBF9F5]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Features */}
            <div className="space-y-4">

              {features.map((feature) => {
                const Icon = feature.icon;

                const bg =
                  feature.color === "purple"
                    ? "bg-purple-50 border-purple-100"
                    : feature.color === "teal"
                    ? "bg-teal-50 border-teal-100"
                    : "bg-amber-50 border-amber-100";

                const iconColor =
                  feature.color === "purple"
                    ? "text-purple-600"
                    : feature.color === "teal"
                    ? "text-teal-600"
                    : "text-amber-600";

                return (
                  <div
                    key={feature.title}
                    className={`p-5 rounded-3xl border ${bg} flex items-center gap-5 hover:shadow-md transition`}
                  >

                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                      <Icon className={`w-7 h-7 ${iconColor}`} />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900">
                        {feature.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {feature.subtitle}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>

            {/* Content */}
            <div>

              <span className="text-sm font-bold text-amber-600">
                — Why Choose Us
              </span>

              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 leading-tight">
                Committed to Excellence
                <br />
                in Every Aspect of Care
              </h2>

              <p className="mt-6 text-slate-600 leading-relaxed">
                We combine healthcare expertise with modern technology to
                deliver an organized clinical experience for administrators,
                doctors and patients.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <Activity className="w-7 h-7 text-teal-600 mb-3" />
                  <h4 className="font-bold text-slate-900">
                    Smart Operations
                  </h4>
                  <p className="text-xs text-slate-500 mt-2">
                    Simplified clinical workflows and management.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <ShieldCheck className="w-7 h-7 text-amber-600 mb-3" />
                  <h4 className="font-bold text-slate-900">
                    Secure Platform
                  </h4>
                  <p className="text-xs text-slate-500 mt-2">
                    Role-based access for healthcare users.
                  </p>
                </div>

              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500 flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Your Health Deserves
            <br />
            Better Care
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-slate-400">
            Join MediSphere and experience a smarter way to manage healthcare,
            appointments and clinical operations.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold border border-white/10"
            >
              Sign In
            </Link>

          </div>

        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer
        id="contact"
        className="bg-white pt-16 pb-8 border-t border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand */}
            <div>

              <Link
                to="/"
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>

                <span className="text-2xl font-extrabold text-slate-900">
                  Medi<span className="text-amber-500">sphere</span>
                </span>
              </Link>

              <p className="mt-5 text-sm text-slate-500 leading-relaxed">
                Providing modern healthcare management solutions that connect
                patients, doctors and clinical operations.
              </p>

              <div className="flex gap-3 mt-6">

                <a
                  href="#facebook"
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-amber-500 hover:text-white transition"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                <a
                  href="#instagram"
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-amber-500 hover:text-white transition"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="#linkedin"
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-amber-500 hover:text-white transition"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

              </div>

            </div>

            {/* Quick Links */}
            <div>

              <h3 className="font-extrabold text-slate-900">
                Quick Links
              </h3>

              <div className="flex flex-col gap-3 mt-5">

                <a href="#home" className="text-sm text-slate-500 hover:text-amber-500">
                  Home
                </a>

                <a href="#about" className="text-sm text-slate-500 hover:text-amber-500">
                  About Us
                </a>

                <a href="#services" className="text-sm text-slate-500 hover:text-amber-500">
                  Services
                </a>

                <a href="#features" className="text-sm text-slate-500 hover:text-amber-500">
                  Why Choose Us
                </a>

                <a href="#contact" className="text-sm text-slate-500 hover:text-amber-500">
                  Contact
                </a>

              </div>

            </div>

            {/* Services */}
            <div>

              <h3 className="font-extrabold text-slate-900">
                Services
              </h3>

              <div className="flex flex-col gap-3 mt-5">

                <span className="text-sm text-slate-500">
                  Cardiology
                </span>

                <span className="text-sm text-slate-500">
                  Neurology
                </span>

                <span className="text-sm text-slate-500">
                  Dental Care
                </span>

                <span className="text-sm text-slate-500">
                  Appointments
                </span>

                <span className="text-sm text-slate-500">
                  Digital Prescriptions
                </span>

              </div>

            </div>

            {/* Contact */}
            <div>

              <h3 className="font-extrabold text-slate-900">
                Get In Touch
              </h3>

              <div className="space-y-5 mt-5">

                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-sm text-slate-500">
                    Infosys Clinical Operations Platform
                  </span>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-sm text-slate-500">
                    +91 90000 00000
                  </span>
                </div>

                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-sm text-slate-500">
                    support@medisphere.com
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="text-xs text-slate-500">
              © 2026 <strong>MediSphere</strong>. All rights reserved.
            </p>

            <p className="text-xs text-slate-400">
              Built with React, Vite, Spring Boot and MySQL
            </p>

          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;