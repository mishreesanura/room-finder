"use client"

import { MapPin, Bed, Users, Phone } from "lucide-react"
import ImageCarousel from "./image-carousel"

interface RoomDetailsContentProps {
  roomId?: string
}

export default function RoomDetailsContent({ roomId }: RoomDetailsContentProps) {
  const mockRoomData = {
    id: roomId || "1",
    title: "Spacious 2 BHK in Bandra",
    location: "Bandra, Mumbai",
    price: 45000,
    propertyType: "2 BHK",
    tenantPreference: "Family",
    description: "Beautiful, well-maintained 2 BHK apartment with excellent natural lighting and modern amenities.",
    images: [
      "/bright-living-room-with-sofa.jpg",
      "/modern-bedroom-with-window-natural-light.jpg",
      "/student-dormitory-room-tidy-organized.jpg",
      "/luxury-apartment-with-terrace-view.jpg",
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image Carousel */}
          <div className="lg:col-span-2">
            <ImageCarousel images={mockRoomData.images} title={mockRoomData.title} />
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Title and Location */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{mockRoomData.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-base">{mockRoomData.location}</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Rent per month</p>
              <p className="text-4xl font-bold text-primary">
                ₹{mockRoomData.price.toLocaleString()}
                <span className="text-lg text-muted-foreground font-normal">/month</span>
              </p>
            </div>

            {/* Details Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Property Details</h2>

              <div className="space-y-3">
                {/* Property Type */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Bed className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Property Type</span>
                  </div>
                  <span className="font-semibold text-foreground">{mockRoomData.propertyType}</span>
                </div>

                {/* Tenant Preference */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Tenant Preference</span>
                  </div>
                  <span className="font-semibold text-foreground">{mockRoomData.tenantPreference}</span>
                </div>
              </div>
            </div>

            <div className="relative bg-card border border-border rounded-lg p-6 space-y-4 overflow-hidden">
              <h2 className="text-lg font-semibold text-foreground">Owner Contact Details</h2>

              {/* Blurred Content */}
              <div className="space-y-3 blur-sm pointer-events-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="font-semibold text-slate-500">+91 98765 43210</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Email</p>
                  <p className="font-semibold text-slate-500">owner@example.com</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">WhatsApp</p>
                  <p className="font-semibold text-slate-500">+91 98765 43210</p>
                </div>
              </div>

              {/* Overlay with CTA */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-white/90 flex flex-col items-center justify-center rounded-lg">
                <div className="text-center">
                  <p className="text-muted-foreground font-medium mb-4">Sign in to view owner contact information</p>
                  <button className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                    Login to View
                  </button>
                </div>
              </div>
            </div>

            {/* Alternative Contact Button */}
            <button className="w-full px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-emerald-50 transition-colors">
              Contact Owner
            </button>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">About this room</h2>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">{mockRoomData.description}</p>
        </div>
      </div>
    </div>
  )
}
