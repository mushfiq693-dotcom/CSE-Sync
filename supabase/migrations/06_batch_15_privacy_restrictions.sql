-- ==============================================================================
-- GSTU CSE Student & Alumni Directory — Migration 06: Batch 15 Privacy Restrictions
-- Enforces row-level policies preventing Batch 15 users from modifying directory profiles
-- ==============================================================================

-- 1. Helper Function to check if the current user belongs to Batch 15
CREATE OR REPLACE FUNCTION public.is_batch_15_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid()
          AND (
            student_id ILIKE '15%'
            OR student_id ILIKE 'CSE15%'
            OR student_id ILIKE 'CSE 15%'
            OR student_id ILIKE '15-%'
            OR student_id ILIKE '15/_%' ESCAPE '/'
          )
          AND role != 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update INSERT policy on public.profiles: Approved non-Batch-15 users and admins can insert
DROP POLICY IF EXISTS "Approved users can create profiles" ON public.profiles;

CREATE POLICY "Approved users can create profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (
        public.is_approved_user() 
        AND (public.is_admin() OR NOT public.is_batch_15_user())
    );

-- 3. Update UPDATE policy on public.profiles: Approved non-Batch-15 users and admins can update
DROP POLICY IF EXISTS "Approved users can update any profile" ON public.profiles;

CREATE POLICY "Approved users can update any profile"
    ON public.profiles FOR UPDATE
    USING (
        public.is_approved_user() 
        AND (public.is_admin() OR NOT public.is_batch_15_user())
    )
    WITH CHECK (
        public.is_approved_user() 
        AND (public.is_admin() OR NOT public.is_batch_15_user())
    );
