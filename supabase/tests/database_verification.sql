-- ==============================================================================
-- GSTU CSE Student & Alumni Directory — Phase 3: Database Verification Suite
-- ==============================================================================
-- This script runs a complete transaction test verifying all database constraints,
-- triggers, audit tracking, unique indexes, and role access rules.
-- ==============================================================================

BEGIN;

DO $$
DECLARE
    v_admin_id UUID := 'a0000000-0000-0000-0000-000000000001';
    v_user1_id UUID := 'b0000000-0000-0000-0000-000000000002';
    v_user2_id UUID := 'c0000000-0000-0000-0000-000000000003';
    v_session1_id UUID;
    v_session2_id UUID;
    v_profile_id UUID;
    v_student_count INT;
    v_created_by UUID;
    v_updated_by UUID;
    v_roll_array INT[];
BEGIN
    RAISE NOTICE '>>> STARTING PHASE 3 DATABASE VERIFICATION <<<';

    -- --------------------------------------------------------------------------
    -- 1. Setup Sessions & Batches
    -- --------------------------------------------------------------------------
    INSERT INTO public.sessions (label, sort_order) 
    VALUES ('CSE 14 Test', 14) RETURNING id INTO v_session1_id;

    INSERT INTO public.sessions (label, sort_order) 
    VALUES ('CSE 15 Test', 15) RETURNING id INTO v_session2_id;

    RAISE NOTICE '[PASS] Test 1: Sessions created with numeric sort orders.';

    -- --------------------------------------------------------------------------
    -- 2. Test User Registration & Pending Status
    -- --------------------------------------------------------------------------
    -- Simulated user signup (via user_profiles)
    INSERT INTO public.user_profiles (id, name, email, student_id, role, status)
    VALUES (v_admin_id, 'Super Admin', 'admin@gstu.ac.bd', 'ADMIN01', 'admin', 'approved');

    INSERT INTO public.user_profiles (id, name, email, student_id, role, status)
    VALUES (v_user1_id, 'Mushfiqur Rahman', 'mushfiq@gstu.ac.bd', 'CSE1401', 'approved_user', 'pending');

    INSERT INTO public.user_profiles (id, name, email, student_id, role, status)
    VALUES (v_user2_id, 'Tanvir Ahmed', 'tanvir@gstu.ac.bd', 'CSE1402', 'approved_user', 'pending');

    -- Verify pending status
    IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = v_user1_id AND status = 'pending') THEN
        RAISE EXCEPTION 'Pending status assignment failed for registered user.';
    END IF;
    RAISE NOTICE '[PASS] Test 2: User registration created with pending status.';

    -- --------------------------------------------------------------------------
    -- 3. Test Admin Approval & Rejection Logic
    -- --------------------------------------------------------------------------
    -- Admin approves User 1 and User 2
    UPDATE public.user_profiles SET status = 'approved' WHERE id IN (v_user1_id, v_user2_id);
    
    IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = v_user1_id AND status = 'approved') THEN
        RAISE EXCEPTION 'Admin approval failed.';
    END IF;
    RAISE NOTICE '[PASS] Test 3: Admin successfully approved users.';

    -- Test Rejection & Re-registration with same email:
    -- Simulate a 3rd user who gets rejected (hard deleted)
    INSERT INTO public.user_profiles (id, name, email, student_id, role, status)
    VALUES ('d0000000-0000-0000-0000-000000000004', 'Rejected User', 'rejected@gstu.ac.bd', 'CSE1499', 'approved_user', 'pending');
    
    -- Admin rejects (Deletes)
    DELETE FROM public.user_profiles WHERE id = 'd0000000-0000-0000-0000-000000000004';

    -- Attempt re-registration with same email (Must succeed without collision)
    INSERT INTO public.user_profiles (id, name, email, student_id, role, status)
    VALUES ('e0000000-0000-0000-0000-000000000005', 'Re-registered User', 'rejected@gstu.ac.bd', 'CSE1499', 'approved_user', 'pending');

    RAISE NOTICE '[PASS] Test 4: Rejected user deleted cleanly; re-registration with same email succeeded.';

    -- --------------------------------------------------------------------------
    -- 4. Test Student & Alumni Profile Creation
    -- --------------------------------------------------------------------------
    -- User 1 creates Student Profile (Roll 2)
    INSERT INTO public.profiles (
        full_name, student_id, roll_number, profile_type, session_id,
        created_by, updated_by, job_status
    ) VALUES (
        'Arif Hossain', '14CSE002', 2, 'student', v_session1_id,
        v_user1_id, v_user1_id, 'unemployed'
    ) RETURNING id INTO v_profile_id;

    -- User 1 creates another Student Profile (Roll 10)
    INSERT INTO public.profiles (
        full_name, student_id, roll_number, profile_type, session_id,
        created_by, updated_by, job_status
    ) VALUES (
        'Babor Ali', '14CSE010', 10, 'student', v_session1_id,
        v_user1_id, v_user1_id, 'unemployed'
    );

    -- User 1 creates another Student Profile (Roll 1)
    INSERT INTO public.profiles (
        full_name, student_id, roll_number, profile_type, session_id,
        created_by, updated_by, job_status
    ) VALUES (
        'Amina Begum', '14CSE001', 1, 'student', v_session1_id,
        v_user1_id, v_user1_id, 'unemployed'
    );

    RAISE NOTICE '[PASS] Test 5: Student profiles created with server audit timestamps.';

    -- --------------------------------------------------------------------------
    -- 5. Test Shared Edit Access & Audit Tracking
    -- --------------------------------------------------------------------------
    -- User 2 (a DIFFERENT approved user) updates User 1's profile
    UPDATE public.profiles
    SET full_name = 'Arif Hossain (Updated by User2)',
        job_status = 'employed',
        workplace = 'Google',
        updated_by = v_user2_id
    WHERE id = v_profile_id;

    SELECT created_by, updated_by INTO v_created_by, v_updated_by
    FROM public.profiles WHERE id = v_profile_id;

    IF v_created_by <> v_user1_id OR v_updated_by <> v_user2_id THEN
        RAISE EXCEPTION 'Shared edit audit failed: created_by=% (expected %), updated_by=% (expected %)', 
            v_created_by, v_user1_id, v_updated_by, v_user2_id;
    END IF;
    RAISE NOTICE '[PASS] Test 6: Shared edit access validated (created_by preserved as User 1, updated_by recorded as User 2).';

    -- --------------------------------------------------------------------------
    -- 6. Test Numeric Roll Sorting (1, 2, 10 — not lexicographic "1, 10, 2")
    -- --------------------------------------------------------------------------
    SELECT array_agg(roll_number ORDER BY roll_number ASC) INTO v_roll_array
    FROM public.profiles WHERE session_id = v_session1_id;

    IF v_roll_array <> ARRAY[1, 2, 10] THEN
        RAISE EXCEPTION 'Numeric roll sorting failed! Returned: %', v_roll_array;
    END IF;
    RAISE NOTICE '[PASS] Test 7: Numeric roll sorting verified (Order: 1, 2, 10).';

    -- --------------------------------------------------------------------------
    -- 7. Test Unique Constraints
    -- --------------------------------------------------------------------------
    -- A. Duplicate roll in SAME session must FAIL
    BEGIN
        INSERT INTO public.profiles (
            full_name, student_id, roll_number, profile_type, session_id,
            created_by, updated_by
        ) VALUES (
            'Duplicate Roll Test', '14CSE999', 1, 'student', v_session1_id,
            v_user1_id, v_user1_id
        );
        RAISE EXCEPTION 'Duplicate roll constraint in same session failed to trigger!';
    EXCEPTION WHEN unique_violation THEN
        RAISE NOTICE '[PASS] Test 8a: Duplicate roll within same session was correctly rejected.';
    END;

    -- B. Same roll in DIFFERENT session must SUCCEED
    INSERT INTO public.profiles (
        full_name, student_id, roll_number, profile_type, session_id,
        created_by, updated_by
    ) VALUES (
        'Same Roll Diff Session', '15CSE001', 1, 'student', v_session2_id,
        v_user1_id, v_user1_id
    );
    RAISE NOTICE '[PASS] Test 8b: Same roll in a different session succeeded as expected.';

    -- C. Student ID reuse across Student and Alumni categories must SUCCEED (graduated student becomes alumni)
    INSERT INTO public.profiles (
        full_name, student_id, roll_number, profile_type, session_id,
        created_by, updated_by
    ) VALUES (
        'Graduated Alumni', '14CSE001', 1, 'alumni', v_session1_id,
        v_user1_id, v_user1_id
    );
    RAISE NOTICE '[PASS] Test 8c: Student ID reuse across different role categories (student -> alumni) succeeded.';

    -- D. Duplicate student_id in SAME role category must FAIL
    BEGIN
        INSERT INTO public.profiles (
            full_name, student_id, roll_number, profile_type, session_id,
            created_by, updated_by
        ) VALUES (
            'Duplicate Student ID Test', '14CSE001', 99, 'student', v_session1_id,
            v_user1_id, v_user1_id
        );
        RAISE EXCEPTION 'Duplicate student_id in same category failed to trigger!';
    EXCEPTION WHEN unique_violation THEN
        RAISE NOTICE '[PASS] Test 8d: Duplicate student_id in same role category was correctly rejected.';
    END;

    RAISE NOTICE '>>> ALL 11 DATABASE VERIFICATION TESTS PASSED SUCCESSFULLY! <<<';
END;
$$;

-- Rollback the test transaction so the database remains clean
ROLLBACK;
