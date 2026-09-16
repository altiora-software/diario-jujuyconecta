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
      banners: {
        Row: {
          activo: boolean
          created_at: string
          id: number
          imagen_url: string | null
          link_url: string | null
          orden: number | null
          posicion: Database["public"]["Enums"]["posicion_banner"]
          titulo: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          id?: number
          imagen_url?: string | null
          link_url?: string | null
          orden?: number | null
          posicion?: Database["public"]["Enums"]["posicion_banner"]
          titulo?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          id?: number
          imagen_url?: string | null
          link_url?: string | null
          orden?: number | null
          posicion?: Database["public"]["Enums"]["posicion_banner"]
          titulo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      categorias: {
        Row: {
          created_at: string
          id: number
          nombre: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          nombre: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          nombre?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      notas_comentarios: {
        Row: {
          contenido: string
          created_at: string | null
          id: number
          noticia_id: number
        }
        Insert: {
          contenido: string
          created_at?: string | null
          id?: never
          noticia_id: number
        }
        Update: {
          contenido?: string
          created_at?: string | null
          id?: never
          noticia_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "notas_comentarios_noticia_id_fkey"
            columns: ["noticia_id"]
            isOneToOne: false
            referencedRelation: "noticias"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_rating: {
        Row: {
          created_at: string | null
          id: number
          noticia_id: number
          rating: number | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          noticia_id: number
          rating?: number | null
        }
        Update: {
          created_at?: string | null
          id?: never
          noticia_id?: number
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notas_rating_noticia_id_fkey"
            columns: ["noticia_id"]
            isOneToOne: false
            referencedRelation: "noticias"
            referencedColumns: ["id"]
          },
        ]
      }
      noticia_bloques: {
        Row: {
          contenido: string | null
          created_at: string | null
          id: number
          media_url: string | null
          noticia_id: number
          orden: number
          tipo: string
        }
        Insert: {
          contenido?: string | null
          created_at?: string | null
          id?: number
          media_url?: string | null
          noticia_id: number
          orden: number
          tipo: string
        }
        Update: {
          contenido?: string | null
          created_at?: string | null
          id?: number
          media_url?: string | null
          noticia_id?: number
          orden?: number
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "noticia_bloques_noticia_id_fkey"
            columns: ["noticia_id"]
            isOneToOne: false
            referencedRelation: "noticias"
            referencedColumns: ["id"]
          },
        ]
      }
      noticias: {
        Row: {
          categoria_id: number | null
          contenido: string | null
          cover_url: string | null
          created_at: string
          destacado: boolean
          estado: string
          fecha_publicacion: string | null
          id: number
          imagen_url: string | null
          origen: string | null
          owner_id: string | null
          resumen: string | null
          slug: string
          titulo: string
          updated_at: string
          url_origen: string | null
        }
        Insert: {
          categoria_id?: number | null
          contenido?: string | null
          cover_url?: string | null
          created_at?: string
          destacado?: boolean
          estado?: string
          fecha_publicacion?: string | null
          id?: number
          imagen_url?: string | null
          origen?: string | null
          owner_id?: string | null
          resumen?: string | null
          slug: string
          titulo: string
          updated_at?: string
          url_origen?: string | null
        }
        Update: {
          categoria_id?: number | null
          contenido?: string | null
          cover_url?: string | null
          created_at?: string
          destacado?: boolean
          estado?: string
          fecha_publicacion?: string | null
          id?: number
          imagen_url?: string | null
          origen?: string | null
          owner_id?: string | null
          resumen?: string | null
          slug?: string
          titulo?: string
          updated_at?: string
          url_origen?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "noticias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "noticias_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "noticias_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "v_is_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "noticias_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "v_is_editor"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      programas: {
        Row: {
          created_at: string
          descripcion: string | null
          horario: string | null
          id: number
          nombre: string
          slug: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          horario?: string | null
          id?: number
          nombre: string
          slug?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          horario?: string | null
          id?: number
          nombre?: string
          slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_is_admin: {
        Row: {
          id: string | null
        }
        Insert: {
          id?: string | null
        }
        Update: {
          id?: string | null
        }
        Relationships: []
      }
      v_is_editor: {
        Row: {
          id: string | null
        }
        Insert: {
          id?: string | null
        }
        Update: {
          id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_set_user_role: {
        Args: {
          p_role: Database["public"]["Enums"]["user_role"]
          p_user_id: string
        }
        Returns: undefined
      }
      promote_user: {
        Args: {
          p_email: string
          p_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: undefined
      }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      posicion_banner:
        | "home_top"
        | "home_middle"
        | "home_bottom"
        | "sidebar"
        | "portada"
      user_role: "admin" | "editor" | "colaborador"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      posicion_banner: [
        "home_top",
        "home_middle",
        "home_bottom",
        "sidebar",
        "portada",
      ],
      user_role: ["admin", "editor", "colaborador"],
    },
  },
} as const
