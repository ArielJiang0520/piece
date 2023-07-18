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
      pieces: {
        Row: {
          content: string
          created_at: string
          creator_id: string
          id: string
          logline: string
          name: string
          nsfw: boolean
          tags: string[]
          world_id: string | null
        }
        Insert: {
          content?: string
          created_at?: string
          creator_id: string
          id?: string
          logline?: string
          name?: string
          nsfw?: boolean
          tags?: string[]
          world_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          creator_id?: string
          id?: string
          logline?: string
          name?: string
          nsfw?: boolean
          tags?: string[]
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pieces_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pieces_world_id_fkey"
            columns: ["world_id"]
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      worlds: {
        Row: {
          allow_contribution: boolean
          allow_suggestion: boolean
          created_at: string
          creator_id: string | null
          description: Json
          id: string
          logline: string
          nsfw: boolean
          tags: string[]
          world_name: string
        }
        Insert: {
          allow_contribution?: boolean
          allow_suggestion?: boolean
          created_at?: string
          creator_id?: string | null
          description?: Json
          id?: string
          logline?: string
          nsfw?: boolean
          tags?: string[]
          world_name: string
        }
        Update: {
          allow_contribution?: boolean
          allow_suggestion?: boolean
          created_at?: string
          creator_id?: string | null
          description?: Json
          id?: string
          logline?: string
          nsfw?: boolean
          tags?: string[]
          world_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "worlds_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
