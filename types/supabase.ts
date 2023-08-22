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
      characters: {
        Row: {
          created_at: string
          fandom_id: string
          hits: number
          name: string
        }
        Insert: {
          created_at?: string
          fandom_id: string
          hits?: number
          name?: string
        }
        Update: {
          created_at?: string
          fandom_id?: string
          hits?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_fandom_id_fkey"
            columns: ["fandom_id"]
            referencedRelation: "fandoms"
            referencedColumns: ["id"]
          }
        ]
      }
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
          num_of_worlds: number
        }
        Insert: {
          aliases?: string[]
          created_at?: string
          id: string
          media_type?: string | null
          name?: string
          num_of_worlds?: number
        }
        Update: {
          aliases?: string[]
          created_at?: string
          id?: string
          media_type?: string | null
          name?: string
          num_of_worlds?: number
        }
        Relationships: [
          {
            foreignKeyName: "fandoms_media_type_fkey"
            columns: ["media_type"]
            referencedRelation: "fandoms_media_types"
            referencedColumns: ["id"]
          }
        ]
      }
      fandoms_media_types: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
        }
        Update: {
          created_at?: string
          id?: string
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
      relationships: {
        Row: {
          created_at: string
          fandom_id: string
          hits: number
          name: string
        }
        Insert: {
          created_at?: string
          fandom_id: string
          hits?: number
          name?: string
        }
        Update: {
          created_at?: string
          fandom_id?: string
          hits?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationships_fandom_id_fkey"
            columns: ["fandom_id"]
            referencedRelation: "fandoms"
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
          created_at: string
          id: string
          user_id: string
          world_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          world_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          world_id?: string
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
      tags: {
        Row: {
          category: string | null
          created_at: string
          hits: number
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          hits?: number
          name?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          hits?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_category_fkey"
            columns: ["category"]
            referencedRelation: "tags_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      tags_categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      worlds: {
        Row: {
          allow_contribution: boolean
          allow_suggestion: boolean
          characters: string[]
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
          name: string
          nsfw: boolean
          origin: string | null
          relationship_types: string[]
          relationships: string[]
          tags: string[]
        }
        Insert: {
          allow_contribution?: boolean
          allow_suggestion?: boolean
          characters: string[]
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
          name: string
          nsfw?: boolean
          origin?: string | null
          relationship_types?: string[]
          relationships: string[]
          tags: string[]
        }
        Update: {
          allow_contribution?: boolean
          allow_suggestion?: boolean
          characters?: string[]
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
          name?: string
          nsfw?: boolean
          origin?: string | null
          relationship_types?: string[]
          relationships?: string[]
          tags?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "worlds_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worlds_origin_fkey"
            columns: ["origin"]
            referencedRelation: "fandoms"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      upsert_characters: {
        Args: {
          character_names: string[]
          p_fandom_id: string
        }
        Returns: undefined
      }
      upsert_relationships: {
        Args: {
          relationship_names: string[]
          p_fandom_id: string
        }
        Returns: undefined
      }
      upsert_tags: {
        Args: {
          tags_list: string[]
        }
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
