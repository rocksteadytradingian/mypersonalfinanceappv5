export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          amount: number;
          type: string;
          category: string;
          details: string;
          from: string;
          credit_card_id?: string;
          fund_source_id?: string;
          loan_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          amount: number;
          period: string;
          spent: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['budgets']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['budgets']['Insert']>;
      };
      fund_sources: {
        Row: {
          id: string;
          user_id: string;
          bank_name: string;
          account_name: string;
          account_type: string;
          balance: number;
          last_updated: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['fund_sources']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['fund_sources']['Insert']>;
      };
      credit_cards: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          bank: string;
          limit: number;
          cut_off_date: number;
          balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['credit_cards']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['credit_cards']['Insert']>;
      };
      investments: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          purchase_date: string;
          purchase_price: number;
          current_value: number;
          quantity: number;
          status: string;
          fund_source_id?: string;
          notes?: string;
          last_updated: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['investments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['investments']['Insert']>;
      };
      loans: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          lender: string;
          type: string;
          original_amount: number;
          current_balance: number;
          interest_rate: number;
          monthly_payment: number;
          start_date: string;
          end_date: string;
          status: string;
          next_payment_date: string;
          fund_source_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['loans']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['loans']['Insert']>;
      };
      user_profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          photo_url?: string;
          country: string;
          currency: string;
          theme: string;
          monthly_budget_limit?: number;
          monthly_income_target?: number;
          savings_goal?: number;
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
    };
  };
}