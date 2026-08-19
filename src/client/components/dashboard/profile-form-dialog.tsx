'use client';

import * as React from 'react';
import { Dialog } from '@/client/components/ui/dialog';
import { Button } from '@/client/components/ui/button';
import { Input } from '@/client/components/ui/input';
import { createProfileAction, updateProfileAction } from '@/server/actions/profile.actions';
import type { ProfileRecord, SessionRecord } from '@/server/db/schema.types';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProfileFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionRecord[];
  initialData?: ProfileRecord | null;
  defaultType?: 'student' | 'alumni';
  onSuccess?: () => void;
}

export function ProfileFormDialog({
  isOpen,
  onClose,
  sessions,
  initialData,
  defaultType = 'student',
  onSuccess,
}: ProfileFormDialogProps) {
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);

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
                Roll Number <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                name="roll_number"
                defaultValue={initialData?.roll_number || ''}
                placeholder="e.g. 1"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Session / Batch <span className="text-destructive">*</span>
              </label>
              <select
                name="session_id"
                defaultValue={initialData?.session_id || sessions[0]?.id || ''}
                required
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
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

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Profile Picture URL (Optional)
              </label>
              <Input
                name="avatar_url"
                type="url"
                defaultValue={initialData?.avatar_url || ''}
                placeholder="https://..."
              />
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
