export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          piece_id: string | null
          upvotes: number
          user_id: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          piece_id?: string | null
          upvotes?: number
          user_id?: string | null
        }
        Update: {
          content?: Json | null
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
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      folders: {
        Row: {
          created_at: string
          id: string
          name: string
          world_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          world_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
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
          id?: string
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
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      modifiers: {
        Row: {
          content: string
          created_at: string
          creator_id: string | null
          description: string
          id: string
          modified_at: string | null
          name: string
          usage: number
        }
        Insert: {
          content?: string
          created_at?: string
          creator_id?: string | null
          description?: string
          id?: string
          modified_at?: string | null
          name?: string
          usage?: number
        }
        Update: {
          content?: string
          created_at?: string
          creator_id?: string | null
          description?: string
          id?: string
          modified_at?: string | null
          name?: string
          usage?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_modifiers_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      pieces: {
        Row: {
          allow_comments: boolean
          created_at: string
          creator_id: string
          draft_created_at: string | null
          draft_modified_at: string | null
          folder_id: string | null
          id: string
          is_draft: boolean
          is_favorite: boolean
          is_pinned: boolean
          modified_at: string | null
          name: string
          nsfw: boolean
          piece_json: Json | null
          piece_type: string
          prompt_id: string | null
          tags: string[]
          world_id: string | null
        }
        Insert: {
          allow_comments?: boolean
          created_at?: string
          creator_id: string
          draft_created_at?: string | null
          draft_modified_at?: string | null
          folder_id?: string | null
          id?: string
          is_draft?: boolean
          is_favorite?: boolean
          is_pinned?: boolean
          modified_at?: string | null
          name?: string
          nsfw?: boolean
          piece_json?: Json | null
          piece_type?: string
          prompt_id?: string | null
          tags?: string[]
          world_id?: string | null
        }
        Update: {
          allow_comments?: boolean
          created_at?: string
          creator_id?: string
          draft_created_at?: string | null
          draft_modified_at?: string | null
          folder_id?: string | null
          id?: string
          is_draft?: boolean
          is_favorite?: boolean
          is_pinned?: boolean
          modified_at?: string | null
          name?: string
          nsfw?: boolean
          piece_json?: Json | null
          piece_type?: string
          prompt_id?: string | null
          tags?: string[]
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pieces_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pieces_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pieces_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pieces_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          content: string | null
          created_at: string
          creator_id: string | null
          id: number
          model: string | null
          modified_at: string | null
          modifiers: string | null
          name: string | null
          origin: string | null
          tags: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          creator_id?: string | null
          id?: number
          model?: string | null
          modified_at?: string | null
          modifiers?: string | null
          name?: string | null
          origin?: string | null
          tags?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          creator_id?: string | null
          id?: number
          model?: string | null
          modified_at?: string | null
          modifiers?: string | null
          name?: string | null
          origin?: string | null
          tags?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_posts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prompt_history: {
        Row: {
          created_at: string
          creator_id: string
          id: string
          json_content: Json | null
          world_id: string | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          id?: string
          json_content?: Json | null
          world_id?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          id?: string
          json_content?: Json | null
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_history_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_history_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          }
        ]
      }
      prompts: {
        Row: {
          created_at: string
          id: string
          is_favorite: boolean
          prompt: string
          updated_at: string
          world_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_favorite?: boolean
          prompt: string
          updated_at: string
          world_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_favorite?: boolean
          prompt?: string
          updated_at?: string
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompts_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
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
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
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
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          hits?: number
          id?: string
          name?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          hits?: number
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_category_fkey"
            columns: ["category"]
            isOneToOne: false
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
          primary_genre: string | null
          progress: string
          secondary_genre: string | null
          tags: string[]
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
          name: string
          nsfw?: boolean
          primary_genre?: string | null
          progress?: string
          secondary_genre?: string | null
          tags: string[]
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
          name?: string
          nsfw?: boolean
          primary_genre?: string | null
          progress?: string
          secondary_genre?: string | null
          tags?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "worlds_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worlds_primary_genre_fkey"
            columns: ["primary_genre"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worlds_secondary_genre_fkey"
            columns: ["secondary_genre"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_fandom: {
        Args: {
          p_fandom_id: string
          p_amount: number
        }
        Returns: undefined
      }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
