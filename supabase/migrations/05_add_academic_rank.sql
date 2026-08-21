-- ==============================================================================
-- GSTU CSE Directory — Migration 05: Academic Merit Ranking (1st, 2nd, 3rd)
-- ==============================================================================

-- 1. Add academic_rank column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS academic_rank VARCHAR(10) DEFAULT NULL;

-- 2. Add check constraint for valid values ('1st', '2nd', '3rd' or NULL)
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS check_academic_rank;

ALTER TABLE public.profiles 
ADD CONSTRAINT check_academic_rank 
CHECK (academic_rank IN ('1st', '2nd', '3rd') OR academic_rank IS NULL);

-- 3. Unique Partial Index: Guarantees at most 1 first, 1 second, and 1 third per batch (session_id)
CREATE UNIQUE INDEX IF NOT EXISTS unique_batch_academic_rank 
ON public.profiles (session_id, academic_rank) 
WHERE academic_rank IS NOT NULL;
