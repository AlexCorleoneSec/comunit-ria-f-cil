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
      atendimentos: {
        Row: {
          batalhao: string | null
          companhia: string | null
          created_at: string
          data_fato: string
          data_registro: string
          demanda: string | null
          endereco_ocorrencia: string | null
          grande_comando: string | null
          id: string
          observacoes: string | null
          origem_atendimento: string
          primeiro_mediador_id: string | null
          resumo_fato: string | null
          segundo_mediador_id: string | null
          status: string | null
          tipo_local: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          batalhao?: string | null
          companhia?: string | null
          created_at?: string
          data_fato: string
          data_registro?: string
          demanda?: string | null
          endereco_ocorrencia?: string | null
          grande_comando?: string | null
          id?: string
          observacoes?: string | null
          origem_atendimento: string
          primeiro_mediador_id?: string | null
          resumo_fato?: string | null
          segundo_mediador_id?: string | null
          status?: string | null
          tipo_local?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          batalhao?: string | null
          companhia?: string | null
          created_at?: string
          data_fato?: string
          data_registro?: string
          demanda?: string | null
          endereco_ocorrencia?: string | null
          grande_comando?: string | null
          id?: string
          observacoes?: string | null
          origem_atendimento?: string
          primeiro_mediador_id?: string | null
          resumo_fato?: string | null
          segundo_mediador_id?: string | null
          status?: string | null
          tipo_local?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "atendimentos_primeiro_mediador_id_fkey"
            columns: ["primeiro_mediador_id"]
            isOneToOne: false
            referencedRelation: "mediadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atendimentos_segundo_mediador_id_fkey"
            columns: ["segundo_mediador_id"]
            isOneToOne: false
            referencedRelation: "mediadores"
            referencedColumns: ["id"]
          },
        ]
      }
      mediadores: {
        Row: {
          batalhao: string | null
          celular: string | null
          companhia: string | null
          created_at: string
          cursos_certificacoes: string | null
          data_credenciamento: string | null
          email: string | null
          formacao: string | null
          grande_comando: string | null
          id: string
          nome: string
          opm: string | null
          posto_graduacao: string | null
          re: string | null
          status_credenciamento:
            | Database["public"]["Enums"]["status_credenciamento"]
            | null
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          batalhao?: string | null
          celular?: string | null
          companhia?: string | null
          created_at?: string
          cursos_certificacoes?: string | null
          data_credenciamento?: string | null
          email?: string | null
          formacao?: string | null
          grande_comando?: string | null
          id?: string
          nome: string
          opm?: string | null
          posto_graduacao?: string | null
          re?: string | null
          status_credenciamento?:
            | Database["public"]["Enums"]["status_credenciamento"]
            | null
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          batalhao?: string | null
          celular?: string | null
          companhia?: string | null
          created_at?: string
          cursos_certificacoes?: string | null
          data_credenciamento?: string | null
          email?: string | null
          formacao?: string | null
          grande_comando?: string | null
          id?: string
          nome?: string
          opm?: string | null
          posto_graduacao?: string | null
          re?: string | null
          status_credenciamento?:
            | Database["public"]["Enums"]["status_credenciamento"]
            | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pvs_cadastros: {
        Row: {
          ano_inicio: number | null
          cia_pm: string | null
          cidade: string | null
          contato_tutor: string | null
          created_at: string
          documento_tutor: string | null
          email_tutor: string | null
          endereco: string | null
          endereco_ponto_a: string | null
          endereco_ponto_b: string | null
          id: string
          latitude: number | null
          longitude: number | null
          modalidade: string | null
          nome_tutor: string
          opm: string | null
          ponto_final_lat: number | null
          ponto_final_lng: number | null
          ponto_inicial_lat: number | null
          ponto_inicial_lng: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ano_inicio?: number | null
          cia_pm?: string | null
          cidade?: string | null
          contato_tutor?: string | null
          created_at?: string
          documento_tutor?: string | null
          email_tutor?: string | null
          endereco?: string | null
          endereco_ponto_a?: string | null
          endereco_ponto_b?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          modalidade?: string | null
          nome_tutor: string
          opm?: string | null
          ponto_final_lat?: number | null
          ponto_final_lng?: number | null
          ponto_inicial_lat?: number | null
          ponto_inicial_lng?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ano_inicio?: number | null
          cia_pm?: string | null
          cidade?: string | null
          contato_tutor?: string | null
          created_at?: string
          documento_tutor?: string | null
          email_tutor?: string | null
          endereco?: string | null
          endereco_ponto_a?: string | null
          endereco_ponto_b?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          modalidade?: string | null
          nome_tutor?: string
          opm?: string | null
          ponto_final_lat?: number | null
          ponto_final_lng?: number | null
          ponto_inicial_lat?: number | null
          ponto_inicial_lng?: number | null
          updated_at?: string
          user_id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      status_credenciamento: "ativo" | "inativo"
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
      app_role: ["admin", "moderator", "user"],
      status_credenciamento: ["ativo", "inativo"],
    },
  },
} as const
