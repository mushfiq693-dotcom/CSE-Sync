-- ==============================================================================
-- GSTU CSE Student & Alumni Directory — Migration 02: Row Level Security (RLS)
-- ==============================================================================

-- 1. Helper Functions to check roles securely within Postgres
CREATE OR REPLACE FUNCTION public.is_approved_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid()
          AND status = 'approved'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid()
          AND role = 'admin'
          AND status = 'approved'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Enable Row Level Security
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. Policies for `sessions` table
-- ------------------------------------------------------------------------------
-- Anyone (including public visitors) can view sessions
CREATE POLICY "Public can view sessions"
    ON public.sessions FOR SELECT
    USING (true);

-- Only Admins can insert, update, or delete sessions
CREATE POLICY "Admins can manage sessions (insert)"
    ON public.sessions FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage sessions (update)"
    ON public.sessions FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage sessions (delete)"
    ON public.sessions FOR DELETE
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. Policies for `user_profiles` table
-- ------------------------------------------------------------------------------
-- Users can view their own profile; Admins can view all user profiles
CREATE POLICY "Users can view own profile or admins view all"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

-- Only Admins can update user approval status or role
CREATE POLICY "Admins can update user status and roles"
    ON public.user_profiles FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only Admins can delete users (e.g. reject registration)
CREATE POLICY "Admins can delete user records"
    ON public.user_profiles FOR DELETE
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. Policies for `profiles` table (Student & Alumni Directory)
-- ------------------------------------------------------------------------------
-- Public visitors and authenticated users can view all profiles
CREATE POLICY "Public directory access"
    ON public.profiles FOR SELECT
    USING (true);

-- Approved users and Admins can create profiles
CREATE POLICY "Approved users can create profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (public.is_approved_user());

-- Shared Edit: Any approved user or Admin can update ANY profile
CREATE POLICY "Approved users can update any profile"
    ON public.profiles FOR UPDATE
    USING (public.is_approved_user())
    WITH CHECK (public.is_approved_user());

-- Admin-Only: Only Admins can delete student/alumni profiles
CREATE POLICY "Only admins can delete profiles"
    ON public.profiles FOR DELETE
    USING (public.is_admin());
