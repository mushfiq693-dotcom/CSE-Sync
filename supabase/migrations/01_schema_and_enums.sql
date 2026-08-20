-- ==============================================================================
-- GSTU CSE Student & Alumni Directory — Migration 01: Schema & Enums
-- ==============================================================================

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('admin', 'approved_user');
CREATE TYPE user_status AS ENUM ('pending', 'approved');
CREATE TYPE profile_type AS ENUM ('student', 'alumni');
CREATE TYPE job_status AS ENUM ('employed', 'business_owner', 'unemployed', 'teaching', 'other');

-- 2. Create Sessions Table (Batch / Session info)
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(50) NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for session sorting
CREATE INDEX IF NOT EXISTS idx_sessions_sort_order ON public.sessions (sort_order ASC);

-- 3. Create User Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    student_id VARCHAR(50) NOT NULL,
    role user_role NOT NULL DEFAULT 'approved_user',
    status user_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for admin pending queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles (status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles (role);

-- 4. Create Student & Alumni Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    profile_type profile_type NOT NULL, -- 'student' | 'alumni'
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE RESTRICT,
    
    -- Optional Visual / Contact info
    avatar_url TEXT,
    phone VARCHAR(30),
    facebook_url TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    
    -- Career Info
    job_status job_status DEFAULT 'unemployed',
    workplace VARCHAR(255),
    workplace_details TEXT,
    
    -- Location Info
    home_district VARCHAR(100),
    hometown VARCHAR(100),
    current_city VARCHAR(100),
    
    -- Pre-university Education
    school VARCHAR(255),
    college VARCHAR(255),
    
    -- Audit fields (resolved server-side)
    created_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE RESTRICT,
    updated_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints (Strictly per requirements)
    -- Student ID is unique within its own role category (student vs alumni)
    CONSTRAINT unique_student_id_per_profile_type UNIQUE (student_id, profile_type)
);

-- Performance Indexes for search, filter & Student ID sorting
CREATE INDEX IF NOT EXISTS idx_profiles_session_student_id ON public.profiles (session_id, student_id ASC);
CREATE INDEX IF NOT EXISTS idx_profiles_type ON public.profiles (profile_type);
CREATE INDEX IF NOT EXISTS idx_profiles_name ON public.profiles (full_name);
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON public.profiles (student_id);
