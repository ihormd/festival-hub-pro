export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      artist_applications: {
        Row: {
          admin_notes: string | null
          bio: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          id: string
          portfolio_links: string[] | null
          set_length_minutes: number | null
          stage_name: string
          stage_preference: string | null
          status: Database["public"]["Enums"]["application_status"]
          tech_rider_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          bio?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          portfolio_links?: string[] | null
          set_length_minutes?: number | null
          stage_name: string
          stage_preference?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          tech_rider_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          bio?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          portfolio_links?: string[] | null
          set_length_minutes?: number | null
          stage_name?: string
          stage_preference?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          tech_rider_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          handled: boolean
          id: string
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          handled?: boolean
          id?: string
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          handled?: boolean
          id?: string
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      festival_schedule: {
        Row: {
          active: boolean
          area: string | null
          created_at: string
          day: Database["public"]["Enums"]["festival_day"]
          description: string | null
          end_time: string | null
          id: string
          sort_order: number
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          area?: string | null
          created_at?: string
          day: Database["public"]["Enums"]["festival_day"]
          description?: string | null
          end_time?: string | null
          id?: string
          sort_order?: number
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          area?: string | null
          created_at?: string
          day?: Database["public"]["Enums"]["festival_day"]
          description?: string | null
          end_time?: string | null
          id?: string
          sort_order?: number
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      merch_order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price_cents: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price_cents: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "merch_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "merch_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merch_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "merch_products"
            referencedColumns: ["id"]
          },
        ]
      }
      merch_orders: {
        Row: {
          contact_email: string
          contact_name: string | null
          created_at: string
          id: string
          status: Database["public"]["Enums"]["order_status"]
          stripe_session_id: string | null
          total_cents: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact_email: string
          contact_name?: string | null
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_session_id?: string | null
          total_cents: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact_email?: string
          contact_name?: string | null
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_session_id?: string | null
          total_cents?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      merch_products: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price_cents: number
          stock: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price_cents: number
          stock?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price_cents?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          locale: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          locale?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          locale?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          active: boolean
          created_at: string
          id: string
          level: Database["public"]["Enums"]["sponsor_level"]
          logo_url: string | null
          name: string
          sort_order: number
          updated_at: string
          website_url: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["sponsor_level"]
          logo_url?: string | null
          name: string
          sort_order?: number
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["sponsor_level"]
          logo_url?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      sponsorships: {
        Row: {
          amount_cents: number
          company_name: string
          contact_email: string
          contact_name: string | null
          created_at: string
          id: string
          is_public: boolean
          logo_url: string | null
          message: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          stripe_session_id: string | null
          tier: Database["public"]["Enums"]["sponsor_tier"]
          updated_at: string
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          amount_cents: number
          company_name: string
          contact_email: string
          contact_name?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          logo_url?: string | null
          message?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          stripe_session_id?: string | null
          tier: Database["public"]["Enums"]["sponsor_tier"]
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          amount_cents?: number
          company_name?: string
          contact_email?: string
          contact_name?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          logo_url?: string | null
          message?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          stripe_session_id?: string | null
          tier?: Database["public"]["Enums"]["sponsor_tier"]
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          active: boolean
          bio: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          role: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          role: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          role?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_applications: {
        Row: {
          admin_notes: string | null
          business_name: string
          category: string
          contact_email: string
          contact_phone: string | null
          created_at: string
          description: string | null
          document_urls: string[] | null
          id: string
          requested_spot_id: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          business_name: string
          category: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          document_urls?: string[] | null
          id?: string
          requested_spot_id?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          business_name?: string
          category?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          document_urls?: string[] | null
          id?: string
          requested_spot_id?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_applications_requested_spot_id_fkey"
            columns: ["requested_spot_id"]
            isOneToOne: false
            referencedRelation: "vendor_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_bookings: {
        Row: {
          amount_cents: number
          business_name: string | null
          contact_email: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          pending_until: string | null
          spot_id: string
          status: Database["public"]["Enums"]["booking_status"]
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          business_name?: string | null
          contact_email: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          pending_until?: string | null
          spot_id: string
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          business_name?: string | null
          contact_email?: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          pending_until?: string | null
          spot_id?: string
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_bookings_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "vendor_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_spots: {
        Row: {
          code: string
          created_at: string
          h: number
          id: string
          label: string | null
          notes: string | null
          pending_until: string | null
          price_cents: number
          status: Database["public"]["Enums"]["spot_status"]
          updated_at: string
          vendor_user_id: string | null
          w: number
          x: number
          y: number
        }
        Insert: {
          code: string
          created_at?: string
          h?: number
          id?: string
          label?: string | null
          notes?: string | null
          pending_until?: string | null
          price_cents?: number
          status?: Database["public"]["Enums"]["spot_status"]
          updated_at?: string
          vendor_user_id?: string | null
          w?: number
          x: number
          y: number
        }
        Update: {
          code?: string
          created_at?: string
          h?: number
          id?: string
          label?: string | null
          notes?: string | null
          pending_until?: string | null
          price_cents?: number
          status?: Database["public"]["Enums"]["spot_status"]
          updated_at?: string
          vendor_user_id?: string | null
          w?: number
          x?: number
          y?: number
        }
        Relationships: []
      }
      volunteer_applications: {
        Row: {
          admin_notes: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          full_name: string
          id: string
          interests: string[] | null
          notes: string | null
          selected_shifts: string[] | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          full_name: string
          id?: string
          interests?: string[] | null
          notes?: string | null
          selected_shifts?: string[] | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          full_name?: string
          id?: string
          interests?: string[] | null
          notes?: string | null
          selected_shifts?: string[] | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      volunteer_shifts: {
        Row: {
          area: string
          capacity: number
          created_at: string
          description: string | null
          ends_at: string
          id: string
          starts_at: string
        }
        Insert: {
          area: string
          capacity?: number
          created_at?: string
          description?: string | null
          ends_at: string
          id?: string
          starts_at: string
        }
        Update: {
          area?: string
          capacity?: number
          created_at?: string
          description?: string | null
          ends_at?: string
          id?: string
          starts_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      book_vendor_spot: {
        Args: {
          _business_name: string
          _contact_email: string
          _contact_name: string
          _contact_phone: string
          _method: Database["public"]["Enums"]["payment_method"]
          _spot_id: string
        }
        Returns: {
          amount_cents: number
          business_name: string | null
          contact_email: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          pending_until: string | null
          spot_id: string
          status: Database["public"]["Enums"]["booking_status"]
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "vendor_bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      confirm_vendor_booking: {
        Args: { _booking_id: string }
        Returns: {
          amount_cents: number
          business_name: string | null
          contact_email: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          pending_until: string | null
          spot_id: string
          status: Database["public"]["Enums"]["booking_status"]
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "vendor_bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      release_expired_vendor_holds: { Args: never; Returns: number }
    }
    Enums: {
      app_role: "admin" | "vendor" | "artist" | "volunteer" | "donor"
      application_status: "pending" | "approved" | "rejected" | "cancelled"
      booking_status: "pending" | "paid" | "expired" | "cancelled"
      festival_day: "saturday" | "sunday"
      order_status: "pending" | "paid" | "fulfilled" | "cancelled" | "refunded"
      payment_method: "stripe" | "etransfer"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      sponsor_level: "platinum" | "gold" | "silver" | "bronze"
      sponsor_tier: "bronze" | "silver" | "gold" | "platinum" | "custom"
      spot_status: "available" | "pending" | "occupied" | "reserved"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "vendor", "artist", "volunteer", "donor"],
      application_status: ["pending", "approved", "rejected", "cancelled"],
      booking_status: ["pending", "paid", "expired", "cancelled"],
      festival_day: ["saturday", "sunday"],
      order_status: ["pending", "paid", "fulfilled", "cancelled", "refunded"],
      payment_method: ["stripe", "etransfer"],
      payment_status: ["pending", "paid", "failed", "refunded"],
      sponsor_level: ["platinum", "gold", "silver", "bronze"],
      sponsor_tier: ["bronze", "silver", "gold", "platinum", "custom"],
      spot_status: ["available", "pending", "occupied", "reserved"],
    },
  },
} as const
