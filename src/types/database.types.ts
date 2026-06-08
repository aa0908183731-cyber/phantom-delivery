// Supabase 資料庫型別。
//
// 正式專案中可用下列指令自動產生覆蓋本檔：
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
//
// 這裡先手寫一份與 supabase/schema.sql 對應的型別，讓 App 在尚未接上 Supabase
// 時也能享有完整型別檢查。

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
      restaurants: {
        Row: {
          id: string;
          name: string;
          category: string;
          rating: number | null;
          review_count: number | null;
          min_order: number | null;
          delivery_time: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          rating?: number | null;
          review_count?: number | null;
          min_order?: number | null;
          delivery_time?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["restaurants"]["Insert"]>;
        Relationships: [];
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string | null;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          category: string | null;
        };
        Insert: {
          id?: string;
          restaurant_id?: string | null;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          category?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["menu_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey";
            columns: ["restaurant_id"];
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          restaurant_id: string | null;
          reviewer_name: string | null;
          rating: number | null;
          content: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id?: string | null;
          reviewer_name?: string | null;
          rating?: number | null;
          content?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "reviews_restaurant_id_fkey";
            columns: ["restaurant_id"];
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      fake_orders: {
        Row: {
          id: string;
          session_id: string | null;
          items: Json | null;
          address: string | null;
          payment_method: string | null;
          // 狀態只允許：confirmed → preparing → delivering
          // 絕對不會變成 delivered
          status: string;
          rider_name: string | null;
          rider_lat: number | null;
          rider_lng: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          items?: Json | null;
          address?: string | null;
          payment_method?: string | null;
          status?: string;
          rider_name?: string | null;
          rider_lat?: number | null;
          rider_lng?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["fake_orders"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// 方便使用的別名
export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type FakeOrder = Database["public"]["Tables"]["fake_orders"]["Row"];
export type FakeOrderInsert =
  Database["public"]["Tables"]["fake_orders"]["Insert"];
