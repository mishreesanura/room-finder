"use client";

import { Edit2, Trash2, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Room } from "@/types/supabase";

interface PropertiesTableProps {
  rooms: Room[];
  loading: boolean;
  onEdit: (property: Room) => void;
  onDelete: (roomId: number) => void;
}

export function PropertiesTable({
  rooms,
  loading,
  onEdit,
  onDelete,
}: PropertiesTableProps) {
  if (loading) {
    return (
      <Card className="border border-border overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Image
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Location
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Rent
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rooms.map((room) => (
              <tr
                key={room.id}
                className="hover:bg-secondary/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <img
                    src={room.image_urls?.[0] || "/placeholder.svg"}
                    alt={room.title}
                    className="w-16 h-16 rounded-lg object-cover border border-border"
                  />
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-foreground">{room.title}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    {room.location}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-lg font-semibold text-primary">
                    ₹{room.price.toLocaleString("en-IN")}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {room.property_type.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(room)}
                      className="gap-2 border-border hover:bg-secondary"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(room.id)}
                      className="gap-2 border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {rooms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No properties added yet.</p>
          <p className="text-sm text-muted-foreground">
            Click "Add New Room" to get started.
          </p>
        </div>
      )}
    </Card>
  );
}
