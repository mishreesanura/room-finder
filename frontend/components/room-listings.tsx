"use client";

import { MapPin, PhoneIcon, Home, Users, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Room } from "@/types/supabase";

interface RoomListingsProps {
  rooms: Room[];
  loading: boolean;
}

const getBadgeColor = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("1")) {
    return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300";
  } else if (lowerType.includes("2")) {
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
  } else if (lowerType.includes("3")) {
    return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
  }
  return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
};

const getTenantBadgeColor = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType === "bachelor") {
    return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300";
  } else if (lowerType === "family") {
    return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
  } else if (lowerType === "girls") {
    return "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300";
  } else if (lowerType === "working") {
    return "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300";
  }
  return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
};

export default function RoomListings({ rooms, loading }: RoomListingsProps) {
  if (loading) {
    return (
      <section
        id="browse"
        className="py-16 md:py-24 px-4 bg-white dark:bg-slate-950 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                Loading rooms...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="browse"
      className="pt-8 pb-16 md:pt-10 md:pb-24 px-4 bg-white dark:bg-slate-950 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 dark:bg-emerald-900/10 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {rooms.length > 0
              ? `Found ${rooms.length} Room${rooms.length === 1 ? "" : "s"}`
              : "Available Rooms"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {rooms.length > 0
              ? "Discover handpicked rooms from verified owners"
              : "No rooms found matching your criteria"}
          </p>
        </motion.div>

        {/* Empty State */}
        {rooms.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No rooms found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your filters to see more results
            </p>
          </motion.div>
        )}

        {/* Room Grid */}
        {rooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, idx) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group h-full"
              >
                <Link href={`/rooms/${room.id}`}>
                  <div className="relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 h-full flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1">
                    {/* Image Container */}
                    <div className="relative h-48 md:h-56 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <img
                        src={room.image_urls?.[0] || "/placeholder.svg"}
                        alt={room.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-6 flex flex-col flex-1">
                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {room.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-start gap-2 mb-4 text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{room.location}</span>
                      </div>

                      {/* Rent Price - Highlighted */}
                      <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                          Monthly Rent
                        </p>
                        <p className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-600 to-emerald-500">
                          ₹{room.price.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getBadgeColor(
                            room.property_type
                          )}`}
                        >
                          <Home className="w-3 h-3" />
                          {room.property_type.toUpperCase()}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getTenantBadgeColor(
                            room.tenant_preference
                          )}`}
                        >
                          <Users className="w-3 h-3" />
                          {room.tenant_preference.charAt(0).toUpperCase() +
                            room.tenant_preference.slice(1)}
                        </span>
                      </div>

                      {/* Owner Contact Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-linear-to-r from-emerald-600 to-emerald-700 text-white py-2.5 rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-auto"
                      >
                        <PhoneIcon className="w-4 h-4" />
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
