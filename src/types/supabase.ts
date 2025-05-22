export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      albums: {
        Row: {
          id: string
          created_at: string
          name: string
          emoji: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          emoji: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          emoji?: string
          user_id?: string
        }
      }
      photos: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          url: string
          album_id: string
          user_id: string
          is_public: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          url: string
          album_id: string
          user_id: string
          is_public?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          url?: string
          album_id?: string
          user_id?: string
          is_public?: boolean
          metadata?: Json | null
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          date_of_birth: string
          phone_number: string
          email: string
          hobbies: string[] | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          date_of_birth: string
          phone_number: string
          email: string
          hobbies?: string[] | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          date_of_birth?: string
          phone_number?: string
          email?: string
          hobbies?: string[] | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}