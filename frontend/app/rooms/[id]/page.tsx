import { notFound, redirect } from "next/navigation";
import { MapPin, Bed, Users, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import ImageCarousel from "@/components/image-carousel";
import type { Room } from "@/types/supabase";

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Parse ID to number (database uses bigint)
  const roomId = parseInt(id, 10);

  if (isNaN(roomId)) {
    notFound();
  }

  // Fetch room details
  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single();

  if (error || !room) {
    notFound();
  }

  // Type assertion for room data
  const roomData = room as Room;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image Carousel */}
          <div className="lg:col-span-2">
            {room.image_urls && room.image_urls.length > 0 ? (
              <ImageCarousel images={room.image_urls} title={room.title} />
            ) : (
              <div className="w-full aspect-4/3 bg-slate-200 rounded-xl flex items-center justify-center">
                <p className="text-slate-500">No images available</p>
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Title and Location */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {room.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-base">{room.location}</span>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Rent per month
              </p>
              <p className="text-4xl font-bold text-primary">
                ₹{room.price.toLocaleString("en-IN")}
                <span className="text-lg text-muted-foreground font-normal">
                  /month
                </span>
              </p>
            </div>

            {/* Property Details Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Property Details
              </h2>

              <div className="space-y-3">
                {/* Property Type */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Bed className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Property Type</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {room.property_type}
                  </span>
                </div>

                {/* Tenant Preference */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">
                      Tenant Preference
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {room.tenant_preference}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Contact Section */}
            <div className="relative bg-card border border-border rounded-lg p-6 space-y-4 overflow-hidden">
              <h2 className="text-lg font-semibold text-foreground">
                Owner Contact Details
              </h2>

              {isAuthenticated ? (
                // Show contact details if logged in
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <a
                        href={`tel:${room.contact_number}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {room.contact_number}
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                // Show blurred content with login prompt if not logged in
                <>
                  {/* Blurred Content */}
                  <div className="space-y-3 blur-sm pointer-events-none select-none">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Phone</p>
                        <p className="font-semibold text-slate-500">
                          +91 98765 43210
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Login Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="text-center space-y-4 p-6">
                      <p className="text-sm text-muted-foreground">
                        You need to be logged in to view contact details
                      </p>
                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl"
                      >
                        Login to View Contact Details
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
