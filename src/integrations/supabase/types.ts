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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          admin_notes: string | null
          applicant_id: string
          approved_at: string | null
          dataset_id: string
          funding_source: string | null
          id: string
          project_description: string
          project_title: string
          provider_notes: string | null
          purpose: string
          reviewed_at: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          submitted_at: string
          supervisor_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          applicant_id: string
          approved_at?: string | null
          dataset_id: string
          funding_source?: string | null
          id?: string
          project_description: string
          project_title: string
          provider_notes?: string | null
          purpose: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          submitted_at?: string
          supervisor_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          applicant_id?: string
          approved_at?: string | null
          dataset_id?: string
          funding_source?: string | null
          id?: string
          project_description?: string
          project_title?: string
          provider_notes?: string | null
          purpose?: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          submitted_at?: string
          supervisor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dataset_statistics: {
        Row: {
          created_at: string
          dataset_id: string
          id: string
          mean_value: number | null
          missing_count: number | null
          percentage: number | null
          std_deviation: number | null
          total_count: number | null
          variable_name: string
          variable_type: string
        }
        Insert: {
          created_at?: string
          dataset_id: string
          id?: string
          mean_value?: number | null
          missing_count?: number | null
          percentage?: number | null
          std_deviation?: number | null
          total_count?: number | null
          variable_name: string
          variable_type: string
        }
        Update: {
          created_at?: string
          dataset_id?: string
          id?: string
          mean_value?: number | null
          missing_count?: number | null
          percentage?: number | null
          std_deviation?: number | null
          total_count?: number | null
          variable_name?: string
          variable_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "dataset_statistics_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      datasets: {
        Row: {
          approved: boolean | null
          category: string | null
          created_at: string
          data_dict_url: string | null
          description: string
          end_date: string | null
          file_url: string | null
          id: string
          keywords: string[] | null
          provider_id: string
          published: boolean | null
          record_count: number | null
          search_count: number | null
          start_date: string | null
          subject_area_id: string | null
          supervisor_id: string | null
          title_cn: string
          type: Database["public"]["Enums"]["dataset_type"]
          updated_at: string
          variable_count: number | null
        }
        Insert: {
          approved?: boolean | null
          category?: string | null
          created_at?: string
          data_dict_url?: string | null
          description: string
          end_date?: string | null
          file_url?: string | null
          id?: string
          keywords?: string[] | null
          provider_id: string
          published?: boolean | null
          record_count?: number | null
          search_count?: number | null
          start_date?: string | null
          subject_area_id?: string | null
          supervisor_id?: string | null
          title_cn: string
          type: Database["public"]["Enums"]["dataset_type"]
          updated_at?: string
          variable_count?: number | null
        }
        Update: {
          approved?: boolean | null
          category?: string | null
          created_at?: string
          data_dict_url?: string | null
          description?: string
          end_date?: string | null
          file_url?: string | null
          id?: string
          keywords?: string[] | null
          provider_id?: string
          published?: boolean | null
          record_count?: number | null
          search_count?: number | null
          start_date?: string | null
          subject_area_id?: string | null
          supervisor_id?: string | null
          title_cn?: string
          type?: Database["public"]["Enums"]["dataset_type"]
          updated_at?: string
          variable_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "datasets_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "datasets_subject_area_id_fkey"
            columns: ["subject_area_id"]
            isOneToOne: false
            referencedRelation: "research_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "datasets_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          contact_email: string
          contact_id_number: string
          contact_id_type: Database["public"]["Enums"]["id_type"]
          contact_person: string
          contact_phone: string
          created_at: string
          full_name: string
          id: string
          short_name: string | null
          type: Database["public"]["Enums"]["institution_type"]
          updated_at: string
          username: string
          verified: boolean | null
        }
        Insert: {
          contact_email: string
          contact_id_number: string
          contact_id_type: Database["public"]["Enums"]["id_type"]
          contact_person: string
          contact_phone: string
          created_at?: string
          full_name: string
          id?: string
          short_name?: string | null
          type: Database["public"]["Enums"]["institution_type"]
          updated_at?: string
          username: string
          verified?: boolean | null
        }
        Update: {
          contact_email?: string
          contact_id_number?: string
          contact_id_type?: Database["public"]["Enums"]["id_type"]
          contact_person?: string
          contact_phone?: string
          created_at?: string
          full_name?: string
          id?: string
          short_name?: string | null
          type?: Database["public"]["Enums"]["institution_type"]
          updated_at?: string
          username?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      research_outputs: {
        Row: {
          abstract: string | null
          citation_count: number | null
          created_at: string
          dataset_id: string
          file_url: string | null
          id: string
          patent_number: string | null
          publication_url: string | null
          submitter_id: string
          title: string
          type: Database["public"]["Enums"]["output_type"]
        }
        Insert: {
          abstract?: string | null
          citation_count?: number | null
          created_at?: string
          dataset_id: string
          file_url?: string | null
          id?: string
          patent_number?: string | null
          publication_url?: string | null
          submitter_id: string
          title: string
          type: Database["public"]["Enums"]["output_type"]
        }
        Update: {
          abstract?: string | null
          citation_count?: number | null
          created_at?: string
          dataset_id?: string
          file_url?: string | null
          id?: string
          patent_number?: string | null
          publication_url?: string | null
          submitter_id?: string
          title?: string
          type?: Database["public"]["Enums"]["output_type"]
        }
        Relationships: [
          {
            foreignKeyName: "research_outputs_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_outputs_submitter_id_fkey"
            columns: ["submitter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      research_subjects: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          name: string
          name_en: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          name_en?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          name_en?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          education: Database["public"]["Enums"]["education_level"] | null
          email: string
          field: string | null
          id: string
          id_number: string
          id_type: Database["public"]["Enums"]["id_type"]
          institution_id: string | null
          phone: string
          real_name: string
          role: Database["public"]["Enums"]["user_role"]
          supervisor_id: string | null
          title: string | null
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          education?: Database["public"]["Enums"]["education_level"] | null
          email: string
          field?: string | null
          id: string
          id_number: string
          id_type: Database["public"]["Enums"]["id_type"]
          institution_id?: string | null
          phone: string
          real_name: string
          role?: Database["public"]["Enums"]["user_role"]
          supervisor_id?: string | null
          title?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          education?: Database["public"]["Enums"]["education_level"] | null
          email?: string
          field?: string | null
          id?: string
          id_number?: string
          id_type?: Database["public"]["Enums"]["id_type"]
          institution_id?: string | null
          phone?: string
          real_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          supervisor_id?: string | null
          title?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_institutions_for_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          full_name: string
          id: string
          institution_type: string
          short_name: string
          verified: boolean
        }[]
      }
      get_public_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_authenticated_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      application_status: "submitted" | "under_review" | "approved" | "denied"
      dataset_type:
        | "cohort"
        | "case_control"
        | "cross_sectional"
        | "rct"
        | "registry"
        | "biobank"
        | "omics"
        | "wearable"
      education_level:
        | "bachelor"
        | "master"
        | "phd"
        | "postdoc"
        | "professor"
        | "other"
      id_type: "national_id" | "passport" | "other"
      institution_type:
        | "hospital"
        | "university"
        | "research_center"
        | "lab"
        | "government"
        | "enterprise"
        | "other"
      output_type: "paper" | "patent"
      user_role:
        | "public_visitor"
        | "registered_researcher"
        | "data_provider"
        | "institution_supervisor"
        | "platform_admin"
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
      application_status: ["submitted", "under_review", "approved", "denied"],
      dataset_type: [
        "cohort",
        "case_control",
        "cross_sectional",
        "rct",
        "registry",
        "biobank",
        "omics",
        "wearable",
      ],
      education_level: [
        "bachelor",
        "master",
        "phd",
        "postdoc",
        "professor",
        "other",
      ],
      id_type: ["national_id", "passport", "other"],
      institution_type: [
        "hospital",
        "university",
        "research_center",
        "lab",
        "government",
        "enterprise",
        "other",
      ],
      output_type: ["paper", "patent"],
      user_role: [
        "public_visitor",
        "registered_researcher",
        "data_provider",
        "institution_supervisor",
        "platform_admin",
      ],
    },
  },
} as const
