"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertiesTable } from "./properties-table";
import { AddRoomModal } from "./add-room-modal";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import type { Room } from "@/types/supabase";

export default function OwnerDashboard() {
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);

      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error("You must be logged in to view your rooms");
        return;
      }

      // Fetch rooms for current owner
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

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

  const handleAddRoom = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (property: any) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
    fetchRooms(); // Refresh the list after closing modal
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (!confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      const { error } = await supabase.from("rooms").delete().eq("id", roomId);

      if (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete room");
        return;
      }

      toast.success("Room deleted successfully");
      fetchRooms(); // Refresh the list
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred while deleting the room");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Properties</h1>
          <p className="text-muted-foreground mt-2">
            Manage your room listings and details
          </p>
        </div>
        <Button
          onClick={handleAddRoom}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Room
        </Button>
      </div>

      {/* Properties Table */}
      <PropertiesTable
        rooms={rooms}
        loading={loading}
        onEdit={handleEditRoom}
        onDelete={handleDeleteRoom}
      />

      {/* Add/Edit Room Modal */}
      {isModalOpen && (
        <AddRoomModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          property={editingProperty}
        />
      )}
    </div>
  );
}
