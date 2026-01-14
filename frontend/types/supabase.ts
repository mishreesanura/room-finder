export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: number;
          owner_id: string;
          title: string;
          location: string;
          price: number;
          property_type: string;
          tenant_preference: string;
          contact_number: string | null;
          image_urls: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          owner_id: string;
          title: string;
          location: string;
          price: number;
          property_type: string;
          tenant_preference: string;
          contact_number?: string | null;
          image_urls?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          owner_id?: string;
          title?: string;
          location?: string;
          price?: number;
          property_type?: string;
          tenant_preference?: string;
          contact_number?: string | null;
          image_urls?: string[] | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rooms_owner_id_fkey";
            columns: ["owner_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          role: "owner" | "finder";
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          role?: "owner" | "finder";
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          role?: "owner" | "finder";
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenience type aliases
export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type RoomInsert = Database["public"]["Tables"]["rooms"]["Insert"];
export type RoomUpdate = Database["public"]["Tables"]["rooms"]["Update"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
