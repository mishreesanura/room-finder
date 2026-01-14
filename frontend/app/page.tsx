"use client";

import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ChevronRight,
  Bed,
  Bath,
  Ruler as Ruler2,
  ArrowRight,
  Search,
  MapPin,
  Home as HomeIcon,
  Users,
  Shield,
  Star,
  Play,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Animated counter component
function AnimatedCounter({
  target,
  duration = 2000,
  suffix = "",
}: {
  target: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return (
    <div ref={ref}>
      {count}
      {suffix}
    </div>
  );
}

// Floating particles background
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400/20 rounded-full"
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1000),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, Math.random() * -200 - 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const testimonials = [
    {
      quote:
        "RoomFinder helped me find my dream apartment in just 2 days! The filters are amazing and the verified listings gave me peace of mind.",
      author: "Priya Sharma",
      role: "Software Engineer",
      avatar: "PS",
      rating: 5,
    },
    {
      quote:
        "As a property owner, listing my rooms has never been easier. I got quality tenants within a week of posting!",
      author: "Rajesh Kumar",
      role: "Property Owner",
      avatar: "RK",
      rating: 5,
    },
    {
      quote:
        "The best platform for students looking for affordable accommodation. Found a great PG near my college!",
      author: "Ananya Patel",
      role: "Student",
      avatar: "AP",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative w-full bg-background overflow-x-hidden">
      <Header />

      {/* Hero Section - Enhanced */}
      <section
        ref={heroRef}
        className="relative w-full min-h-[90vh] overflow-hidden"
      >
        {/* Animated background */}
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0 bg-cover bg-center"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url(/apartment-living-room.jpg)",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
        </motion.div>

        {/* Floating particles */}
        <FloatingParticles />

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 lg:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Main content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="z-10"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-4 py-2 mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-300 text-sm font-medium">
                  500+ New listings this week
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Find Your{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                    Perfect Room
                  </span>
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                  />
                </span>
                <br />
                In Minutes
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg text-slate-300 mb-8 max-w-lg"
              >
                Discover thousands of verified rooms from trusted owners. Filter
                by location, price, and preferences to find exactly what you
                need.
              </motion.p>

              {/* Enhanced search bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center bg-white rounded-xl shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 flex-1">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by city, area, or landmark..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-slate-900 placeholder:text-slate-500 focus:outline-none text-base"
                    />
                  </div>
                  <Link href="/browse">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="m-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center gap-2"
                    >
                      Search
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex gap-8 mt-10"
              >
                {[
                  { icon: HomeIcon, label: "Properties", value: "10K+" },
                  { icon: Users, label: "Happy Users", value: "50K+" },
                  { icon: MapPin, label: "Cities", value: "100+" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <stat.icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right side - Stats cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:flex lg:justify-end z-10"
            >
              <div className="relative">
                {/* Main floating card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl min-w-[320px]"
                >
                  <h3 className="text-white text-xl font-semibold mb-6">
                    Why Choose Us?
                  </h3>

                  <div className="space-y-5">
                    {[
                      {
                        icon: Shield,
                        title: "Verified Listings",
                        desc: "All properties are verified",
                      },
                      {
                        icon: MapPin,
                        title: "Prime Locations",
                        desc: "Best areas covered",
                      },
                      {
                        icon: Users,
                        title: "Trusted Owners",
                        desc: "Background checked",
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.2, duration: 0.5 }}
                        className="flex items-start gap-4 group"
                      >
                        <div className="p-2.5 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors flex-shrink-0">
                          <item.icon className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-base">
                            {item.title}
                          </p>
                          <p className="text-slate-400 text-sm">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                value: 10000,
                suffix: "+",
                label: "Verified Rooms",
                icon: HomeIcon,
              },
              {
                value: 2500,
                suffix: "+",
                label: "Trusted Owners",
                icon: Users,
              },
              { value: 50000, suffix: "+", label: "Happy Tenants", icon: Star },
              {
                value: 100,
                suffix: "+",
                label: "Cities Covered",
                icon: MapPin,
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30"
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section - Enhanced */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                Discover Our{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Top Picks
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-lg">
                Handpicked properties that match your lifestyle and budget
              </p>
            </div>
            <Link href="/browse">
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold hover:shadow-lg transition-shadow"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "/apartment-living-room.jpg",
                title: "Light And Modern Apartment",
                location: "Bandra, Mumbai",
                beds: 3,
                baths: 1,
                sqft: 1000,
                price: 80000,
                status: "Featured",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                image: "/cozy-studio.jpg",
                title: "Comfortable Villa Green",
                location: "Ghatkopar, Mumbai",
                beds: 9,
                baths: 3,
                sqft: 800,
                price: 58000,
                status: "Featured",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                image: "/luxury-flat.jpg",
                title: "Quality House For Sale",
                location: "Prabhadevi, Mumbai",
                beds: 10,
                baths: 2,
                sqft: 500,
                price: 95000,
                status: "Featured",
                gradient: "from-emerald-500 to-teal-500",
              },
            ].map((room, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  <div className="relative overflow-hidden h-64">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={room.image || "/placeholder.svg"}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <motion.div
                      initial={{ x: 100 }}
                      whileInView={{ x: 0 }}
                      className={`absolute top-4 right-4 bg-gradient-to-r ${room.gradient} text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg`}
                    >
                      {room.status}
                    </motion.div>

                    <motion.div
                      initial={{ y: 100, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    >
                      <button className="w-full py-3 bg-white/90 backdrop-blur-sm text-slate-900 rounded-lg font-semibold hover:bg-white transition-colors">
                        View Details
                      </button>
                    </motion.div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                        {room.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm">{room.location}</span>
                    </div>

                    <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400 mb-5 pb-5 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <Bed className="w-4 h-4 text-emerald-500" />
                        <span>{room.beds} Beds</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <Bath className="w-4 h-4 text-emerald-500" />
                        <span>{room.baths} Baths</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <Ruler2 className="w-4 h-4 text-emerald-500" />
                        <span>{room.sqft}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Monthly Rent
                        </p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          ₹{room.price.toLocaleString()}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Help Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-white to-emerald-50 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/30 dark:bg-teal-900/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Finding Your Room is{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Simple
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our streamlined process makes finding or listing properties
              effortless
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-emerald-300 via-teal-400 to-emerald-300 dark:from-emerald-700 dark:via-teal-600 dark:to-emerald-700"></div>

            {[
              {
                step: "01",
                icon: Search,
                title: "Search Properties",
                desc: "Browse through thousands of verified listings with powerful filters",
                color: "from-emerald-500 to-teal-500",
              },
              {
                step: "02",
                icon: HomeIcon,
                title: "Schedule Visits",
                desc: "Book property visits at your convenience with instant confirmation",
                color: "from-emerald-500 to-teal-500",
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "Move In",
                desc: "Complete the paperwork and move into your new home hassle-free",
                color: "from-emerald-500 to-teal-500",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 text-center relative z-10"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span
                      className={`inline-block px-4 py-1 bg-gradient-to-r ${item.color} text-white rounded-full text-sm font-bold`}
                    >
                      Step {item.step}
                    </span>
                  </div>

                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-20 h-20 mx-auto mb-6 mt-4 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <item.icon className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/browse">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all flex items-center gap-2 mx-auto"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Users{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Say
              </span>
            </h2>
          </motion.div>

          <div className="relative">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-12"
            >
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map(
                  (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                    </motion.div>
                  )
                )}
              </div>

              <p className="text-xl md:text-2xl text-white/90 text-center mb-8 leading-relaxed">
                "{testimonials[activeTestimonial].quote}"
              </p>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <p className="text-white font-semibold text-lg">
                  {testimonials[activeTestimonial].author}
                </p>
                <p className="text-slate-400">
                  {testimonials[activeTestimonial].role}
                </p>
              </div>
            </motion.div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  whileHover={{ scale: 1.2 }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === activeTestimonial
                      ? "bg-emerald-500 w-8"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 border border-white/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 border border-white/20 rounded-full"
        />

        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your Perfect Room?
            </h2>
            <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of happy users who found their dream accommodation
              through RoomFinder
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all"
                >
                  Browse Rooms
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all"
                >
                  List Your Property
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
