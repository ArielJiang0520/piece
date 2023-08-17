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
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          piece_id: string | null
          upvotes: number
          user_id: string | null
        }
        Insert: {
          content?: string
          created_at?: string | null
          id: string
          piece_id?: string | null
          upvotes?: number
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          piece_id?: string | null
          upvotes?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_piece_id_fkey"
            columns: ["piece_id"]
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      fandoms: {
        Row: {
          aliases: string[]
          created_at: string
          id: string
          media_type: string | null
          name: string
        }
        Insert: {
          aliases?: string[]
          created_at?: string
          id: string
          media_type?: string | null
          name?: string
        }
        Update: {
          aliases?: string[]
          created_at?: string
          id?: string
          media_type?: string | null
          name?: string
        }
        Relationships: []
      }
      folders: {
        Row: {
          created_at: string | null
          creator_id: string | null
          folder_name: string
          id: string
          world_id: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          folder_name?: string
          id?: string
          world_id?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          folder_name?: string
          id?: string
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folders_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_world_id_fkey"
            columns: ["world_id"]
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          }
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          piece_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          piece_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          piece_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_piece_id_fkey"
            columns: ["piece_id"]
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      pieces: {
        Row: {
          allow_comments: boolean
          content: string
          created_at: string
          creator_id: string
          folder_id: string | null
          id: string
          images: string[]
          logline: string
          modified_at: string | null
          nsfw: boolean
          tags: string[]
          title: string
          world_id: string | null
        }
        Insert: {
          allow_comments?: boolean
          content?: string
          created_at?: string
          creator_id: string
          folder_id?: string | null
          id?: string
          images?: string[]
          logline?: string
          modified_at?: string | null
          nsfw?: boolean
          tags?: string[]
          title?: string
          world_id?: string | null
        }
        Update: {
          allow_comments?: boolean
          content?: string
          created_at?: string
          creator_id?: string
          folder_id?: string | null
          id?: string
          images?: string[]
          logline?: string
          modified_at?: string | null
          nsfw?: boolean
          tags?: string[]
          title?: string
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
            foreignKeyName: "pieces_folder_id_fkey"
            columns: ["folder_id"]
            referencedRelation: "folders"
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
      stars: {
        Row: {
          created_at: string | null
          id: string
          piece_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          piece_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          piece_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stars_piece_id_fkey"
            columns: ["piece_id"]
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stars_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
          world_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          user_id?: string | null
          world_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_world_id_fkey"
            columns: ["world_id"]
            referencedRelation: "worlds"
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
          draft_created_at: string | null
          draft_modified_at: string | null
          id: string
          images: string[]
          is_draft: boolean
          is_public: boolean
          logline: string
          modified_at: string | null
          nsfw: boolean
          origin: string | null
          tags: string[]
          world_name: string
        }
        Insert: {
          allow_contribution?: boolean
          allow_suggestion?: boolean
          created_at?: string
          creator_id?: string | null
          description?: Json
          draft_created_at?: string | null
          draft_modified_at?: string | null
          id?: string
          images?: string[]
          is_draft?: boolean
          is_public?: boolean
          logline?: string
          modified_at?: string | null
          nsfw?: boolean
          origin?: string | null
          tags?: string[]
          world_name: string
        }
        Update: {
          allow_contribution?: boolean
          allow_suggestion?: boolean
          created_at?: string
          creator_id?: string | null
          description?: Json
          draft_created_at?: string | null
          draft_modified_at?: string | null
          id?: string
          images?: string[]
          is_draft?: boolean
          is_public?: boolean
          logline?: string
          modified_at?: string | null
          nsfw?: boolean
          origin?: string | null
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
