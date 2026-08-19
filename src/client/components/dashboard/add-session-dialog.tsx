'use client';

import * as React from 'react';
import { Dialog } from '@/client/components/ui/dialog';
import { Button } from '@/client/components/ui/button';
import { Input } from '@/client/components/ui/input';
import { createSessionAction } from '@/server/actions/session.actions';
import { Loader2, AlertCircle } from 'lucide-react';

interface AddSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSessionDialog({ isOpen, onClose }: AddSessionDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await createSessionAction(formData);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to add batch/session.');
      } else {
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Academic Batch / Session"
      description="Create a new batch (e.g. CSE 19) for grouping student and alumni profiles."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Batch / Session Label <span className="text-destructive">*</span>
          </label>
          <Input
            name="label"
            placeholder="e.g. CSE 19"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Sort Order (Numeric) <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            name="sort_order"
            placeholder="e.g. 19"
            required
            defaultValue="19"
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Controls the ascending sequence in batch dropdowns.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[90px]">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Batch'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
