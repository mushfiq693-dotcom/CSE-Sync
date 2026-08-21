'use client';

import * as React from 'react';
import { Dialog } from '@/client/components/ui/dialog';
import { Button } from '@/client/components/ui/button';
import { Input } from '@/client/components/ui/input';
import { Avatar } from '@/client/components/ui/avatar';
import { createProfileAction, updateProfileAction, uploadAvatarAction } from '@/server/actions/profile.actions';
import type { ProfileRecord, SessionRecord } from '@/server/db/schema.types';
import { Loader2, AlertCircle, Upload, X, Link as LinkIcon } from 'lucide-react';

interface ProfileFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionRecord[];
  initialData?: ProfileRecord | null;
  defaultType?: 'student' | 'alumni';
  isAdmin?: boolean;
  onSuccess?: () => void;
}

export function ProfileFormDialog({
  isOpen,
  onClose,
  sessions,
  initialData,
  defaultType = 'student',
  isAdmin = false,
  onSuccess,
}: ProfileFormDialogProps) {
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Avatar upload & preview state
  const [avatarUrl, setAvatarUrl] = React.useState<string>(initialData?.avatar_url || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [avatarUploadError, setAvatarUploadError] = React.useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setAvatarUrl(initialData?.avatar_url || '');
    setAvatarUploadError(null);
    setErrorMessage(null);
  }, [initialData, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setAvatarUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadAvatarAction(formData);
      if (result.success && result.url) {
        setAvatarUrl(result.url);
      } else {
        setAvatarUploadError(result.error || 'Failed to upload photo.');
      }
    } catch (err: any) {
      setAvatarUploadError(err.message || 'Error uploading photo.');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set('avatar_url', avatarUrl.trim());

    try {
      let result;
      if (isEditing && initialData) {
        result = await updateProfileAction(initialData.id, null, formData);
      } else {
        result = await createProfileAction(null, formData);
      }

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to save profile. Please check your inputs.');
      } else {
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Profile: ${initialData?.full_name}` : `Add New ${defaultType === 'student' ? 'Student' : 'Alumni'}`}
      description={
        isEditing
          ? 'Shared edit access: You can update any information in this profile. The update history will reflect your name.'
          : 'Fill in the information below to add a new profile to the directory.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section 1: Basic Identity */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
            1. Basic Information
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                name="full_name"
                defaultValue={initialData?.full_name || ''}
                placeholder="e.g. Tanvir Ahmed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Student ID <span className="text-destructive">*</span>
              </label>
              <Input
                name="student_id"
                defaultValue={initialData?.student_id || ''}
                placeholder="e.g. 14CSE001"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Session / Batch <span className="text-destructive">*</span>
              </label>
              <select
                name="session_id"
                defaultValue={initialData?.session_id || (defaultType === 'student' ? sessions.find(s => s.sort_order >= 11)?.id : sessions[0]?.id) || ''}
                required
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-medium"
              >
                {sessions.some(s => s.sort_order >= 11 && s.sort_order <= 15) ? (
                  <>
                    <optgroup label="Active Batches (CSE 11 – CSE 15)">
                      {sessions.filter(s => s.sort_order >= 11 && s.sort_order <= 15).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label} (Active)
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Alumni Batches (CSE 01 – CSE 10)">
                      {sessions.filter(s => s.sort_order >= 1 && s.sort_order <= 10).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label} (Alumni)
                        </option>
                      ))}
                    </optgroup>
                  </>
                ) : (
                  sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Category Status <span className="text-destructive">*</span>
              </label>
              <select
                name="profile_type"
                defaultValue={initialData?.profile_type || defaultType}
                required
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring capitalize"
              >
                <option value="student">Current Student</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>

            {/* Admin-only Leadership & Academic Rank Controls */}
            {isAdmin && (
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/40 p-3 rounded-xl border border-border/80">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Batch Leadership (Admin Only)
                  </label>
                  <select
                    name="leadership_role"
                    defaultValue={initialData?.leadership_role || ''}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-medium"
                  >
                    <option value="">None (Standard Member)</option>
                    <option value="CR">👑 Class Representative (CR)</option>
                    <option value="ACR">🎖️ Assistant CR (ACR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Academic Merit Rank (Admin Only)
                  </label>
                  <select
                    name="academic_rank"
                    defaultValue={initialData?.academic_rank || ''}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-medium"
                  >
                    <option value="">None</option>
                    <option value="1st">🥇 1st Position</option>
                    <option value="2nd">🥈 2nd Position</option>
                    <option value="3rd">🥉 3rd Position</option>
                  </select>
                </div>

                <p className="sm:col-span-2 text-[11px] text-muted-foreground">
                  Leadership roles are pinned to top with ribbons. Academic rank assigns gold/silver/bronze merit badges.
                </p>
              </div>
            )}

            {/* Profile Picture Upload & Preview Component */}
            <div className="sm:col-span-2 pt-2 pb-1 border-t border-border/60">
              <label className="block text-xs font-semibold text-foreground mb-2">
                Profile Photo (Optional)
              </label>

              <div className="flex items-center gap-4 bg-muted/20 p-3 rounded-xl border border-border/80">
                {/* Circular Avatar Preview */}
                <Avatar
                  src={avatarUrl}
                  fallbackText="User"
                  size="lg"
                  className="border-2 border-primary/20 bg-card shrink-0 shadow-sm"
                />

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="avatar-file-input"
                    />

                    {/* Choose from device button */}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isUploadingAvatar}
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1.5 text-xs font-semibold shadow-sm"
                    >
                      {isUploadingAvatar ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Uploading Photo...
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" />
                          Upload from Device
                        </>
                      )}
                    </Button>

                    {/* Or paste link toggle */}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      {showUrlInput ? 'Hide URL Box' : 'Paste Image Link'}
                    </Button>

                    {/* Remove photo button */}
                    {avatarUrl && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setAvatarUrl('')}
                        className="gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Optional Direct URL Input Field */}
                  {showUrlInput && (
                    <div className="pt-1">
                      <Input
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  )}

                  {avatarUploadError && (
                    <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {avatarUploadError}
                    </p>
                  )}
                  
                  <p className="text-[11px] text-muted-foreground">
                    Upload image from device or paste a web link. Supported: JPG, PNG, WebP (Max 10MB).
                  </p>
                </div>
              </div>

              {/* Hidden input to pass value in form submission */}
              <input type="hidden" name="avatar_url" value={avatarUrl} />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
            2. Contact & Social Profiles (Optional)
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Phone Number</label>
              <Input
                name="phone"
                defaultValue={initialData?.phone || ''}
                placeholder="+8801..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">LinkedIn Profile URL</label>
              <Input
                name="linkedin_url"
                type="url"
                defaultValue={initialData?.linkedin_url || ''}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Facebook Profile URL</label>
              <Input
                name="facebook_url"
                type="url"
                defaultValue={initialData?.facebook_url || ''}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Instagram Profile URL</label>
              <Input
                name="instagram_url"
                type="url"
                defaultValue={initialData?.instagram_url || ''}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* Section 3: Career Information */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
            3. Career & Employment (Optional)
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Job Status</label>
              <select
                name="job_status"
                defaultValue={initialData?.job_status || 'unemployed'}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring capitalize"
              >
                <option value="employed">Employed</option>
                <option value="business_owner">Business Owner</option>
                <option value="unemployed">Unemployed</option>
                <option value="teaching">Teaching</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Current Workplace / Employer</label>
              <Input
                name="workplace"
                defaultValue={initialData?.workplace || ''}
                placeholder="e.g. Brain Station 23 / Google"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">Workplace Details / Designation</label>
              <Input
                name="workplace_details"
                defaultValue={initialData?.workplace_details || ''}
                placeholder="e.g. Senior Software Engineer, Dhaka"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Location & Education */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
            4. Location & Pre-University Education (Optional)
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Home District</label>
              <Input
                name="home_district"
                defaultValue={initialData?.home_district || ''}
                placeholder="e.g. Gopalganj"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Hometown / Origin</label>
              <Input
                name="hometown"
                defaultValue={initialData?.hometown || ''}
                placeholder="e.g. Tungipara"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Current City</label>
              <Input
                name="current_city"
                defaultValue={initialData?.current_city || ''}
                placeholder="e.g. Dhaka"
              />
            </div>
            <div className="sm:col-span-1.5">
              <label className="block text-xs font-semibold text-foreground mb-1">College (HSC)</label>
              <Input
                name="college"
                defaultValue={initialData?.college || ''}
                placeholder="e.g. Dhaka College"
              />
            </div>
            <div className="sm:col-span-1.5">
              <label className="block text-xs font-semibold text-foreground mb-1">School (SSC)</label>
              <Input
                name="school"
                defaultValue={initialData?.school || ''}
                placeholder="e.g. Gopalganj Govt. High School"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[100px] gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              isEditing ? 'Update Profile' : 'Create Profile'
            )}
          </Button>
        </div>

      </form>
    </Dialog>
  );
}
