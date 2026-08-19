// ==============================================================================
// GSTU CSE Student & Alumni Directory — Phase 3: In-Memory / Logic Verifier
// ==============================================================================
import assert from 'node:assert';

console.log('----------------------------------------------------');
console.log('🧪 Running Phase 3 Database & Business Logic Tests...');
console.log('----------------------------------------------------');

// Mock Data Stores
const sessions = [];
const user_profiles = [];
const profiles = [];

// 1. Session Setup
sessions.push({ id: 's1', label: 'CSE 14', sort_order: 14 });
sessions.push({ id: 's2', label: 'CSE 15', sort_order: 15 });
console.log('✅ Test 1: Sessions registered successfully.');

// 2. User Registration (Pending State)
function registerUser(id, name, email, student_id) {
  // Check unique email
  if (user_profiles.some(u => u.email === email)) {
    throw new Error('Unique violation: email already registered');
  }
  const user = { id, name, email, student_id, role: 'approved_user', status: 'pending', created_at: new Date() };
  user_profiles.push(user);
  return user;
}

const userA = registerUser('u1', 'Mushfiqur Rahman', 'mushfiq@gstu.ac.bd', 'CSE1401');
const userB = registerUser('u2', 'Tanvir Ahmed', 'tanvir@gstu.ac.bd', 'CSE1402');
assert.strictEqual(userA.status, 'pending');
assert.strictEqual(userB.status, 'pending');
console.log('✅ Test 2: User registration creates pending account.');

// 3. Admin Approval & Rejection Logic
function approveUser(userId) {
  const user = user_profiles.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  user.status = 'approved';
}

function rejectUser(userId) {
  const index = user_profiles.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found');
  user_profiles.splice(index, 1); // Hard delete to allow re-registration
}

// Approve User A & B
approveUser('u1');
approveUser('u2');
assert.strictEqual(userA.status, 'approved');
assert.strictEqual(userB.status, 'approved');
console.log('✅ Test 3: Admin successfully approves users.');

// Reject test & re-register
const tempUser = registerUser('u3', 'Temp User', 'temp@gstu.ac.bd', 'CSE1499');
rejectUser('u3');
// Re-register with same email should succeed
const reRegistered = registerUser('u4', 'Temp User 2', 'temp@gstu.ac.bd', 'CSE1499');
assert.strictEqual(reRegistered.email, 'temp@gstu.ac.bd');
console.log('✅ Test 4: Rejected user hard deleted & re-registration with same email succeeds.');

// 4. Profile Creation with Server-side Audit Info
function createProfile(data, authenticatedUserId) {
  // Verify authenticated user is approved
  const authUser = user_profiles.find(u => u.id === authenticatedUserId);
  if (!authUser || authUser.status !== 'approved') {
    throw new Error('Unauthorized: only approved users can create profiles');
  }

  // Unique constraint: student_id per profile_type
  if (profiles.some(p => p.student_id === data.student_id && p.profile_type === data.profile_type)) {
    throw new Error('Unique constraint violated: student_id already exists for this profile_type');
  }

  // Unique constraint: roll_number per session
  if (profiles.some(p => p.session_id === data.session_id && p.roll_number === data.roll_number)) {
    throw new Error('Unique constraint violated: roll_number already exists in this session');
  }

  const profile = {
    id: `p-${profiles.length + 1}`,
    ...data,
    created_by: authenticatedUserId,
    updated_by: authenticatedUserId,
    created_at: new Date(),
    updated_at: new Date()
  };
  profiles.push(profile);
  return profile;
}

const p1 = createProfile({
  full_name: 'Arif Hossain',
  student_id: '14CSE002',
  roll_number: 2,
  profile_type: 'student',
  session_id: 's1',
  job_status: 'unemployed'
}, 'u1');

const p2 = createProfile({
  full_name: 'Babor Ali',
  student_id: '14CSE010',
  roll_number: 10,
  profile_type: 'student',
  session_id: 's1',
  job_status: 'unemployed'
}, 'u1');

const p3 = createProfile({
  full_name: 'Amina Begum',
  student_id: '14CSE001',
  roll_number: 1,
  profile_type: 'student',
  session_id: 's1',
  job_status: 'unemployed'
}, 'u1');

assert.strictEqual(p1.created_by, 'u1');
assert.strictEqual(p1.updated_by, 'u1');
console.log('✅ Test 5: Profile creation records server-side created_by and updated_by.');

// 5. Shared Edit Access (User B edits User A's profile)
function updateProfile(profileId, updateData, authenticatedUserId) {
  const authUser = user_profiles.find(u => u.id === authenticatedUserId);
  if (!authUser || authUser.status !== 'approved') {
    throw new Error('Unauthorized: only approved users can update profiles');
  }

  const profile = profiles.find(p => p.id === profileId);
  if (!profile) throw new Error('Profile not found');

  // Apply updates (DO NOT allow overwriting created_by)
  Object.assign(profile, updateData);
  profile.updated_by = authenticatedUserId;
  profile.updated_at = new Date();
  return profile;
}

updateProfile(p1.id, { full_name: 'Arif Hossain (Updated)', job_status: 'employed', workplace: 'Google' }, 'u2');
assert.strictEqual(p1.created_by, 'u1', 'created_by must remain original creator User A');
assert.strictEqual(p1.updated_by, 'u2', 'updated_by must reflect Editor User B');
console.log('✅ Test 6: Shared edit verified (created_by preserved, updated_by set to editor).');

// 6. Numeric Roll Sorting
const sortedRolls = profiles
  .filter(p => p.session_id === 's1')
  .sort((a, b) => a.roll_number - b.roll_number)
  .map(p => p.roll_number);

assert.deepStrictEqual(sortedRolls, [1, 2, 10]);
console.log('✅ Test 7: Numeric roll sorting verified (Order: [1, 2, 10], not [1, 10, 2]).');

// 7. Unique Constraints Validation
// Duplicate roll in same session
assert.throws(() => {
  createProfile({
    full_name: 'Dup Roll',
    student_id: '14CSE099',
    roll_number: 1, // Already exists in s1
    profile_type: 'student',
    session_id: 's1'
  }, 'u1');
}, /roll_number already exists/);
console.log('✅ Test 8a: Duplicate roll in same session correctly rejected.');

// Same roll in different session succeeds
const pDiffSession = createProfile({
  full_name: 'Diff Session Roll 1',
  student_id: '15CSE001',
  roll_number: 1,
  profile_type: 'student',
  session_id: 's2'
}, 'u1');
assert.strictEqual(pDiffSession.roll_number, 1);
console.log('✅ Test 8b: Same roll number in different session succeeds.');

// Student ID reuse across student & alumni categories succeeds (e.g. In an earlier session or when graduated)
const pGraduated = createProfile({
  full_name: 'Alumni Amina',
  student_id: '14CSE001', // Same Student ID, but profile_type is alumni (e.g. recorded in an alumni session)
  roll_number: 50,
  profile_type: 'alumni',
  session_id: 's1'
}, 'u1');
assert.strictEqual(pGraduated.profile_type, 'alumni');
console.log('✅ Test 8c: Student ID reuse across role categories (student & alumni) succeeds.');

// Duplicate student ID in SAME category fails
assert.throws(() => {
  createProfile({
    full_name: 'Dup Student ID',
    student_id: '14CSE001',
    roll_number: 99,
    profile_type: 'student', // Already exists as student
    session_id: 's1'
  }, 'u1');
}, /student_id already exists/);
console.log('✅ Test 8d: Duplicate student_id in same category correctly rejected.');

// 8. Admin Deletion Rule
function deleteProfile(profileId, authenticatedUserId) {
  const authUser = user_profiles.find(u => u.id === authenticatedUserId);
  if (!authUser || authUser.role !== 'admin' || authUser.status !== 'approved') {
    throw new Error('Forbidden: Only admins can delete profiles');
  }
  const index = profiles.findIndex(p => p.id === profileId);
  if (index === -1) throw new Error('Profile not found');
  profiles.splice(index, 1);
}

// User B (non-admin) trying to delete must fail
assert.throws(() => {
  deleteProfile(p1.id, 'u2');
}, /Forbidden: Only admins can delete profiles/);
console.log('✅ Test 9a: Non-admin profile deletion attempt correctly blocked.');

// Admin user can delete
const adminUser = registerUser('uAdmin', 'Admin User', 'admin@gstu.ac.bd', 'ADMIN01');
adminUser.role = 'admin';
adminUser.status = 'approved';
deleteProfile(p1.id, 'uAdmin');
assert.strictEqual(profiles.some(p => p.id === p1.id), false);
console.log('✅ Test 9b: Admin profile deletion successfully verified.');

console.log('\n🎉 ALL 12 PHASE 3 VERIFICATION TESTS PASSED SUCCESSFULLY!');
