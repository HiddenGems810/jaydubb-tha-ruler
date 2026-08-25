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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      booking_inquiries: {
        Row: {
          admin_notes: string | null
          budget_range: string | null
          created_at: string
          email: string
          event_date: string | null
          id: string
          inquiry_type: string
          location: string | null
          message: string
          name: string
          organization: string | null
          status: Database["public"]["Enums"]["inquiry_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          budget_range?: string | null
          created_at?: string
          email: string
          event_date?: string | null
          id?: string
          inquiry_type?: string
          location?: string | null
          message: string
          name: string
          organization?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          budget_range?: string | null
          created_at?: string
          email?: string
          event_date?: string | null
          id?: string
          inquiry_type?: string
          location?: string | null
          message?: string
          name?: string
          organization?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: Json
          cover_media_id: string | null
          created_at: string
          created_by: string | null
          entry_number: number
          entry_type: Database["public"]["Enums"]["journal_entry_type"]
          event_date: string | null
          excerpt: string | null
          featured_at: string | null
          id: string
          location: string | null
          og_media_id: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["journal_status"]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          entry_number?: number
          entry_type?: Database["public"]["Enums"]["journal_entry_type"]
          event_date?: string | null
          excerpt?: string | null
          featured_at?: string | null
          id?: string
          location?: string | null
          og_media_id?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["journal_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          entry_number?: number
          entry_type?: Database["public"]["Enums"]["journal_entry_type"]
          event_date?: string | null
          excerpt?: string | null
          featured_at?: string | null
          id?: string
          location?: string | null
          og_media_id?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["journal_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "journal_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_og_media_id_fkey"
            columns: ["og_media_id"]
            isOneToOne: false
            referencedRelation: "journal_media"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_media: {
        Row: {
          alt_text: string | null
          blur_data_url: string | null
          caption: string | null
          created_at: string
          credit: string | null
          entry_id: string
          file_size_bytes: number | null
          height: number | null
          id: string
          kind: Database["public"]["Enums"]["journal_media_kind"]
          mime_type: string
          sort_order: number
          storage_path: string
          updated_at: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          blur_data_url?: string | null
          caption?: string | null
          created_at?: string
          credit?: string | null
          entry_id: string
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["journal_media_kind"]
          mime_type: string
          sort_order?: number
          storage_path: string
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          blur_data_url?: string | null
          caption?: string | null
          created_at?: string
          credit?: string | null
          entry_id?: string
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["journal_media_kind"]
          mime_type?: string
          sort_order?: number
          storage_path?: string
          updated_at?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_media_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      media_items: {
        Row: {
          alt_text: string
          caption: string | null
          category: string
          created_at: string
          credit: string | null
          display_order: number
          file_url: string
          id: string
          is_featured: boolean
          is_published: boolean
          media_type: Database["public"]["Enums"]["media_type"]
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          alt_text: string
          caption?: string | null
          category?: string
          created_at?: string
          credit?: string | null
          display_order?: number
          file_url: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          media_type?: Database["public"]["Enums"]["media_type"]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          caption?: string | null
          category?: string
          created_at?: string
          credit?: string | null
          display_order?: number
          file_url?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          media_type?: Database["public"]["Enums"]["media_type"]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      press_items: {
        Row: {
          article_url: string
          created_at: string
          display_order: number
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          is_published: boolean
          outlet: string
          published_date: string
          title: string
          updated_at: string
        }
        Insert: {
          article_url: string
          created_at?: string
          display_order?: number
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          outlet: string
          published_date: string
          title: string
          updated_at?: string
        }
        Update: {
          article_url?: string
          created_at?: string
          display_order?: number
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          outlet?: string
          published_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      releases: {
        Row: {
          amazon_music_url: string | null
          apple_music_url: string | null
          artwork_url: string
          audiomack_url: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_featured: boolean
          is_published: boolean
          release_date: string
          release_type: Database["public"]["Enums"]["release_type"]
          slug: string
          spotify_url: string | null
          title: string
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          amazon_music_url?: string | null
          apple_music_url?: string | null
          artwork_url: string
          audiomack_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_featured?: boolean
          is_published?: boolean
          release_date: string
          release_type?: Database["public"]["Enums"]["release_type"]
          slug: string
          spotify_url?: string | null
          title: string
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          amazon_music_url?: string | null
          apple_music_url?: string | null
          artwork_url?: string
          audiomack_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_featured?: boolean
          is_published?: boolean
          release_date?: string
          release_type?: Database["public"]["Enums"]["release_type"]
          slug?: string
          spotify_url?: string | null
          title?: string
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      shows: {
        Row: {
          address: string | null
          city: string
          country: string
          created_at: string
          doors_time: string | null
          event_date: string
          id: string
          is_featured: boolean
          is_published: boolean
          poster_url: string | null
          slug: string
          state_region: string
          status: Database["public"]["Enums"]["show_status"]
          supporting_text: string | null
          ticket_url: string | null
          timezone: string
          title: string
          updated_at: string
          venue_name: string
        }
        Insert: {
          address?: string | null
          city: string
          country?: string
          created_at?: string
          doors_time?: string | null
          event_date: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          poster_url?: string | null
          slug: string
          state_region: string
          status?: Database["public"]["Enums"]["show_status"]
          supporting_text?: string | null
          ticket_url?: string | null
          timezone?: string
          title: string
          updated_at?: string
          venue_name: string
        }
        Update: {
          address?: string | null
          city?: string
          country?: string
          created_at?: string
          doors_time?: string | null
          event_date?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          poster_url?: string | null
          slug?: string
          state_region?: string
          status?: Database["public"]["Enums"]["show_status"]
          supporting_text?: string | null
          ticket_url?: string | null
          timezone?: string
          title?: string
          updated_at?: string
          venue_name?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          is_public?: boolean
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          display_name: string
          display_order: number
          id: string
          is_active: boolean
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          display_name: string
          display_order?: number
          id?: string
          is_active?: boolean
          platform: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          display_name?: string
          display_order?: number
          id?: string
          is_active?: boolean
          platform?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          audio_preview_url: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          is_explicit: boolean
          is_published: boolean
          release_id: string
          title: string
          track_number: number
          updated_at: string
        }
        Insert: {
          audio_preview_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_explicit?: boolean
          is_published?: boolean
          release_id: string
          title: string
          track_number?: number
          updated_at?: string
        }
        Update: {
          audio_preview_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_explicit?: boolean
          is_published?: boolean
          release_id?: string
          title?: string
          track_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      vip_members: {
        Row: {
          consent_at: string
          created_at: string
          email: string
          first_name: string | null
          id: string
          source: string
          status: Database["public"]["Enums"]["member_status"]
          unsubscribed_at: string | null
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          consent_at?: string
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          source?: string
          status?: Database["public"]["Enums"]["member_status"]
          unsubscribed_at?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          consent_at?: string
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          source?: string
          status?: Database["public"]["Enums"]["member_status"]
          unsubscribed_at?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      reorder_journal_media: {
        Args: { ordered_ids: string[]; target_entry_id: string }
        Returns: Database["public"]["Tables"]["journal_media"]["Row"][]
      }
      set_featured_journal_entry: {
        Args: { target_id: string }
        Returns: Database["public"]["Tables"]["journal_entries"]["Row"]
      }
    }
    Enums: {
      inquiry_status: "new" | "in_review" | "responded" | "booked" | "archived"
      journal_entry_type:
        | "journal"
        | "photo_dump"
        | "on_the_road"
        | "studio"
        | "release_notes"
        | "behind_the_scenes"
        | "personal"
        | "milestone"
      journal_media_kind: "image" | "video"
      journal_status: "draft" | "scheduled" | "published" | "archived"
      media_type: "image" | "video_embed" | "audio"
      member_status: "active" | "unsubscribed" | "bounced"
      release_type: "single" | "ep" | "album" | "mixtape"
      show_status:
        | "scheduled"
        | "sold_out"
        | "postponed"
        | "cancelled"
        | "completed"
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
      inquiry_status: ["new", "in_review", "responded", "booked", "archived"],
      journal_entry_type: [
        "journal",
        "photo_dump",
        "on_the_road",
        "studio",
        "release_notes",
        "behind_the_scenes",
        "personal",
        "milestone",
      ],
      journal_media_kind: ["image", "video"],
      journal_status: ["draft", "scheduled", "published", "archived"],
      media_type: ["image", "video_embed", "audio"],
      member_status: ["active", "unsubscribed", "bounced"],
      release_type: ["single", "ep", "album", "mixtape"],
      show_status: [
        "scheduled",
        "sold_out",
        "postponed",
        "cancelled",
        "completed",
      ],
    },
  },
} as const
