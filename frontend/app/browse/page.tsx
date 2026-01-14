"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import RoomListings from "@/components/room-listings";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import type { Room } from "@/types/supabase";

export default function BrowseRooms() {
  const supabase = createClient();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "all",
    tenantPreference: "all",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async (searchFilters = filters) => {
    try {
      setLoading(true);

      // Build query
      let query = supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply location filter (case-insensitive partial match)
      if (searchFilters.location && searchFilters.location.trim()) {
        query = query.ilike("location", `%${searchFilters.location}%`);
      }

      // Apply minimum price filter
      if (searchFilters.minPrice && searchFilters.minPrice.trim()) {
        const minPrice = parseFloat(searchFilters.minPrice);
        if (!isNaN(minPrice)) {
          query = query.gte("price", minPrice);
        }
      }

      // Apply maximum price filter
      if (searchFilters.maxPrice && searchFilters.maxPrice.trim()) {
        const maxPrice = parseFloat(searchFilters.maxPrice);
        if (!isNaN(maxPrice)) {
          query = query.lte("price", maxPrice);
        }
      }

      // Apply property type filter
      if (searchFilters.propertyType && searchFilters.propertyType !== "all") {
        query = query.eq("property_type", searchFilters.propertyType);
      }

      // Apply tenant preference filter
      if (
        searchFilters.tenantPreference &&
        searchFilters.tenantPreference !== "all"
      ) {
        query = query.eq("tenant_preference", searchFilters.tenantPreference);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load rooms");
        return;
      }

      setRooms(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred while loading rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchFilters: typeof filters) => {
    setFilters(searchFilters);
    fetchRooms(searchFilters);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection onSearch={handleSearch} initialFilters={filters} />
      <RoomListings rooms={rooms} loading={loading} />
    </main>
  );
}
