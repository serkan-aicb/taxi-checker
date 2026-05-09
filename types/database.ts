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
      users: {
        Row: {
          id: string;
          email: string;
          role: "passenger" | "driver" | "company" | "admin";
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: "passenger" | "driver" | "company" | "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "passenger" | "driver" | "company" | "admin";
          created_at?: string;
        };
      };
      driver_profiles: {
        Row: {
          id: string;
          user_id: string | null;
          first_name: string;
          last_name: string;
          gender: "male" | "female" | "diverse" | null;
          company: string | null;
          bio: string | null;
          city: string | null;
          region: string | null;
          postal_area: string | null;
          email: string | null;
          phone: string | null;
          mobile: string | null;
          website: string | null;
          facebook_url: string | null;
          instagram_url: string | null;
          whatsapp_url: string | null;
          linkedin_url: string | null;
          tiktok_url: string | null;
          telegram_url: string | null;
          profile_image: string | null;
          slug: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_status: "none" | "trialing" | "active" | "past_due" | "canceled" | "incomplete";
          current_period_end: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          first_name: string;
          last_name: string;
          gender?: "male" | "female" | "diverse" | null;
          company?: string | null;
          bio?: string | null;
          city?: string | null;
          region?: string | null;
          postal_area?: string | null;
          email?: string | null;
          phone?: string | null;
          mobile?: string | null;
          website?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          whatsapp_url?: string | null;
          linkedin_url?: string | null;
          tiktok_url?: string | null;
          telegram_url?: string | null;
          profile_image?: string | null;
          slug: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: "none" | "trialing" | "active" | "past_due" | "canceled" | "incomplete";
          current_period_end?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["driver_profiles"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          driver_id: string;
          overall_rating: number;
          question_1: number;
          question_2: number;
          question_3: number;
          question_4: number;
          question_5: number;
          public_comment: string | null;
          private_comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          overall_rating: number;
          question_1: number;
          question_2: number;
          question_3: number;
          question_4: number;
          question_5: number;
          public_comment?: string | null;
          private_comment?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      companies: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>;
      };
      company_drivers: {
        Row: {
          id: string;
          company_id: string;
          driver_id: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          driver_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_drivers"]["Insert"]>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

export type DriverProfile = Database["public"]["Tables"]["driver_profiles"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];

export interface DriverWithStats extends DriverProfile {
  avg_rating: number;
  review_count: number;
  avg_q1: number;
  avg_q2: number;
  avg_q3: number;
  avg_q4: number;
  avg_q5: number;
}
