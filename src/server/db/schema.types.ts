// ==============================================================================
// GSTU CSE Student & Alumni Directory — Database TypeScript Types
// ==============================================================================

export type UserRole = 'admin' | 'approved_user';
export type UserStatus = 'pending' | 'approved';
export type ProfileType = 'student' | 'alumni';
export type JobStatus = 'employed' | 'business_owner' | 'unemployed' | 'teaching' | 'other';

export interface SessionRecord {
  id: string;
  label: string;
  sort_order: number;
  created_at: string;
}

export interface UserProfileRecord {
  id: string;
  name: string;
  email: string;
  student_id: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface ProfileRecord {
  id: string;
  full_name: string;
  student_id: string;
  profile_type: ProfileType;
  session_id: string;
  
  // Optional Visual & Contact Info
  avatar_url?: string | null;
  phone?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  
  // Career Info
  job_status: JobStatus;
  workplace?: string | null;
  workplace_details?: string | null;
  
  // Location Info
  home_district?: string | null;
  hometown?: string | null;
  current_city?: string | null;
  
  // Pre-university Education
  school?: string | null;
  college?: string | null;
  
  // Leadership & Pinned Batch Roles (CR/ACR)
  leadership_role?: 'CR' | 'ACR' | null;

  // Academic Merit Ranking (1st, 2nd, 3rd)
  academic_rank?: '1st' | '2nd' | '3rd' | null;

  // Audit fields
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;

  // Joined relations (optional in queries)
  session?: SessionRecord;
  creator?: { name: string };
  updater?: { name: string };
}

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
      sessions: {
        Row: SessionRecord;
        Insert: {
          id?: string;
          label: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: UserProfileRecord;
        Insert: {
          id: string;
          name: string;
          email: string;
          student_id: string;
          role?: UserRole;
          status?: UserStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          student_id?: string;
          role?: UserRole;
          status?: UserStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: ProfileRecord;
        Insert: {
          id?: string;
          full_name: string;
          student_id: string;
          profile_type: ProfileType;
          session_id: string;
          avatar_url?: string | null;
          phone?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          linkedin_url?: string | null;
          job_status?: JobStatus;
          workplace?: string | null;
          workplace_details?: string | null;
          home_district?: string | null;
          hometown?: string | null;
          current_city?: string | null;
          school?: string | null;
          college?: string | null;
          leadership_role?: 'CR' | 'ACR' | null;
          academic_rank?: '1st' | '2nd' | '3rd' | null;
          created_by: string;
          updated_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          student_id?: string;
          profile_type?: ProfileType;
          session_id?: string;
          avatar_url?: string | null;
          phone?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          linkedin_url?: string | null;
          job_status?: JobStatus;
          workplace?: string | null;
          workplace_details?: string | null;
          home_district?: string | null;
          hometown?: string | null;
          current_city?: string | null;
          school?: string | null;
          college?: string | null;
          leadership_role?: 'CR' | 'ACR' | null;
          academic_rank?: '1st' | '2nd' | '3rd' | null;
          created_by?: string;
          updated_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_approved_user: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      user_status: UserStatus;
      profile_type: ProfileType;
      job_status: JobStatus;
    };
  };
}
