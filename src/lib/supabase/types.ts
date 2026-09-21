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
      bills: {
        Row: {
          amount_cents: number
          created_at: string
          due_date: string
          family_id: string
          id: string
          name: string
          paid: boolean
          paid_at: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          due_date: string
          family_id: string
          id?: string
          name: string
          paid?: boolean
          paid_at?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          due_date?: string
          family_id?: string
          id?: string
          name?: string
          paid?: boolean
          paid_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bills_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_groups: {
        Row: {
          created_at: string
          family_id: string
          id: string
          kind: string
          limit_cents: number
          monogram: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          family_id: string
          id?: string
          kind?: string
          limit_cents?: number
          monogram: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          family_id?: string
          id?: string
          kind?: string
          limit_cents?: number
          monogram?: string
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "budget_groups_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_card_purchases: {
        Row: {
          amount_cents: number
          card_id: string
          created_at: string
          id: string
          installment_current: number
          installment_total: number
          name: string
        }
        Insert: {
          amount_cents: number
          card_id: string
          created_at?: string
          id?: string
          installment_current?: number
          installment_total?: number
          name: string
        }
        Update: {
          amount_cents?: number
          card_id?: string
          created_at?: string
          id?: string
          installment_current?: number
          installment_total?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_card_purchases_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_cards: {
        Row: {
          closing_day: number
          created_at: string
          due_day: number
          family_id: string
          id: string
          limit_cents: number
          name: string
        }
        Insert: {
          closing_day?: number
          created_at?: string
          due_day?: number
          family_id: string
          id?: string
          limit_cents?: number
          name?: string
        }
        Update: {
          closing_day?: number
          created_at?: string
          due_day?: number
          family_id?: string
          id?: string
          limit_cents?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_cards_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      debts: {
        Row: {
          created_at: string
          family_id: string
          id: string
          installment_amount_cents: number
          installment_count: number
          interest_rate_monthly: number
          name: string
          original_amount_cents: number
          remaining_cents: number
        }
        Insert: {
          created_at?: string
          family_id: string
          id?: string
          installment_amount_cents?: number
          installment_count?: number
          interest_rate_monthly?: number
          name: string
          original_amount_cents: number
          remaining_cents: number
        }
        Update: {
          created_at?: string
          family_id?: string
          id?: string
          installment_amount_cents?: number
          installment_count?: number
          interest_rate_monthly?: number
          name?: string
          original_amount_cents?: number
          remaining_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "debts_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          created_at: string
          debt_strategy: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          debt_strategy?: string
          id?: string
          name?: string
        }
        Update: {
          created_at?: string
          debt_strategy?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      family_invites: {
        Row: {
          created_at: string
          email: string
          family_id: string
          id: string
          invited_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          family_id: string
          id?: string
          invited_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          family_id?: string
          id?: string
          invited_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_invites_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_contributions: {
        Row: {
          amount_cents: number
          goal_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_cents?: number
          goal_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          goal_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_contributions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goal_contributions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string
          deadline: string | null
          family_id: string
          id: string
          monthly_target_cents: number
          name: string
          shared: boolean
          target_cents: number
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          family_id: string
          id?: string
          monthly_target_cents?: number
          name: string
          shared?: boolean
          target_cents: number
        }
        Update: {
          created_at?: string
          deadline?: string | null
          family_id?: string
          id?: string
          monthly_target_cents?: number
          name?: string
          shared?: boolean
          target_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "goals_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_answers: {
        Row: {
          completed_at: string | null
          first_goal: string | null
          fixed_cost_chips: string[]
          has_debts: boolean | null
          monthly_income_cents: number
          org_model: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          first_goal?: string | null
          fixed_cost_chips?: string[]
          has_debts?: boolean | null
          monthly_income_cents?: number
          org_model?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          first_goal?: string | null
          fixed_cost_chips?: string[]
          has_debts?: boolean | null
          monthly_income_cents?: number
          org_model?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_color: string
          created_at: string
          family_id: string | null
          full_name: string
          id: string
          onboarding_completed_at: string | null
          role: string
          theme_preference: string
        }
        Insert: {
          avatar_color?: string
          created_at?: string
          family_id?: string | null
          full_name?: string
          id: string
          onboarding_completed_at?: string | null
          role?: string
          theme_preference?: string
        }
        Update: {
          avatar_color?: string
          created_at?: string
          family_id?: string | null
          full_name?: string
          id?: string
          onboarding_completed_at?: string | null
          role?: string
          theme_preference?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount_cents: number
          budget_group_id: string | null
          created_at: string
          family_id: string
          id: string
          installments: number
          occurred_at: string
          payment_method: string | null
          recurring: boolean
          type: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          budget_group_id?: string | null
          created_at?: string
          family_id: string
          id?: string
          installments?: number
          occurred_at?: string
          payment_method?: string | null
          recurring?: boolean
          type: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          budget_group_id?: string | null
          created_at?: string
          family_id?: string
          id?: string
          installments?: number
          occurred_at?: string
          payment_method?: string | null
          recurring?: boolean
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_budget_group_id_fkey"
            columns: ["budget_group_id"]
            isOneToOne: false
            referencedRelation: "budget_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_family_id: { Args: never; Returns: string }
      provision_family: { Args: { p_name: string }; Returns: string }
      remove_family_member: {
        Args: { p_member_id: string }
        Returns: undefined
      }
      set_family_member_role: {
        Args: { p_member_id: string; p_role: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
