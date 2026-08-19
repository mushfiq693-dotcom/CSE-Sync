-- ==============================================================================
-- GSTU CSE Student & Alumni Directory — Migration 03: Triggers & Storage Setup
-- ==============================================================================

-- 1. Timestamp Auto-updater Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 2. Auth User Registration Trigger
-- Automatically creates a pending record in public.user_profiles upon Supabase sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, name, email, student_id, role, status)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Unknown User'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'student_id', 'N/A'),
        'approved_user',
        'pending'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_registration();

-- 3. Storage Bucket Configuration for Profile Pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profile-pictures',
    'profile-pictures',
    true,
    2097152, -- 2MB max file size
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 4. Storage Bucket Policies (storage.objects)
-- Public read access for profile pictures
CREATE POLICY "Public Read Profile Pictures"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-pictures');

-- Approved Users can upload profile pictures
CREATE POLICY "Approved Users Upload Profile Pictures"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'profile-pictures'
        AND public.is_approved_user()
    );

-- Approved Users can update their uploaded profile pictures
CREATE POLICY "Approved Users Update Profile Pictures"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'profile-pictures'
        AND public.is_approved_user()
    );

-- Admins can delete profile pictures
CREATE POLICY "Admins Delete Profile Pictures"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'profile-pictures'
        AND public.is_admin()
    );
