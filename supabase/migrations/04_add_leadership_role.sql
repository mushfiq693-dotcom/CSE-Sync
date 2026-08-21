-- ==============================================================================
-- GSTU CSE Directory — Migration 04: Batch Leadership (CR & ACR)
-- ==============================================================================

-- 1. Add leadership_role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS leadership_role VARCHAR(10) DEFAULT NULL;

-- 2. Add check constraint for valid values ('CR', 'ACR' or NULL)
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS check_leadership_role;

ALTER TABLE public.profiles 
ADD CONSTRAINT check_leadership_role 
CHECK (leadership_role IN ('CR', 'ACR') OR leadership_role IS NULL);

-- 3. Unique Partial Index: Guarantees at most 1 CR and 1 ACR per batch (session_id)
CREATE UNIQUE INDEX IF NOT EXISTS unique_batch_leadership 
ON public.profiles (session_id, leadership_role) 
WHERE leadership_role IS NOT NULL;
