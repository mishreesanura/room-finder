"use client";

import type React from "react";
import { Search, MapPin, DollarSign, Home, Users } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onSearch?: (filters: {
    location: string;
    minPrice: string;
    maxPrice: string;
    propertyType: string;
    tenantPreference: string;
  }) => void;
  initialFilters?: {
    location: string;
    minPrice: string;
    maxPrice: string;
    propertyType: string;
    tenantPreference: string;
  };
}

export default function HeroSection({
  onSearch,
  initialFilters,
}: HeroSectionProps) {
  const [formData, setFormData] = useState(
    initialFilters || {
      location: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "all",
      tenantPreference: "all",
    }
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(formData);
    }
  };

  return (
    <section className="relative bg-linear-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 md:py-20 lg:py-28 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-slate-100 dark:bg-slate-800/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 text-balance">
            Find Your Perfect{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-600 to-emerald-500">
              Room
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-balance">
            Search through thousands of verified rooms from trusted owners.
            Filter by location, price, and preferences to find exactly what you
            need.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 backdrop-blur-sm"
        >
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-3">
              {/* Location - Highest Priority */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  <MapPin className="inline w-4 h-4 mr-1 text-emerald-600" />
                  Location <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="City, area, or landmark..."
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1 text-emerald-600" />
                  Min Price
                </label>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="₹5,000"
                  value={formData.minPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1 text-emerald-600" />
                  Max Price
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="₹50,000"
                  value={formData.maxPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  <Home className="inline w-4 h-4 mr-1 text-emerald-600" />
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="1 Bed">1 Bed</option>
                  <option value="2 Bed">2 Beds</option>
                  <option value="3 Bed">3 Beds</option>
                  <option value="Studio">Studio</option>
                </select>
              </div>

              {/* Tenant Preference */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  <Users className="inline w-4 h-4 mr-1 text-emerald-600" />
                  Tenant Type
                </label>
                <select
                  name="tenantPreference"
                  value={formData.tenantPreference}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="all">All</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Family">Family</option>
                  <option value="Girls">Girls</option>
                  <option value="Working">Working</option>
                  <option value="Any">Any</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-linear-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Search</span>
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {[
            { label: "10,000+", desc: "Verified Rooms" },
            { label: "2,500+", desc: "Trusted Owners" },
            { label: "₹5K-₹1L", desc: "Price Range" },
            { label: "50+", desc: "Cities Covered" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-600 to-emerald-500">
                {stat.label}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
