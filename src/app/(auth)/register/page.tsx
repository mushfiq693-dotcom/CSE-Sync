'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/client/components/ui/button';
import { Input } from '@/client/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/client/components/ui/card';
import { registerAction } from '@/server/actions/auth.actions';
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await registerAction(null, formData);
      if (!result.success) {
        setErrorMessage(result.error || 'Registration failed. Please check your information.');
      } else {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <Card className="border border-border/80 shadow-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold mb-2">
            CSE
          </div>
          <CardTitle className="text-2xl font-black text-foreground">Member Registration</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Apply for departmental directory access to add and maintain profiles.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">Registration Successful</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed">
                  Your account is waiting for admin approval. Once approved, you can sign in to the portal.
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-xs rounded-lg border border-destructive/20 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Input
                  name="name"
                  placeholder="e.g. Mushfiqur Rahman"
                  required
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  University / Personal Email <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="name@gstu.ac.bd or name@gmail.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Student ID <span className="text-destructive">*</span>
                </label>
                <Input
                  name="student_id"
                  placeholder="e.g. 14CSE001"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Password <span className="text-destructive">*</span>
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              <div className="p-3 bg-muted/40 rounded-lg text-[11px] text-muted-foreground flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  All registrations require departmental verification before sign-in access is granted.
                </span>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full font-semibold shadow-sm">
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting Application...
                  </span>
                ) : (
                  'Submit Registration'
                )}
              </Button>

              <div className="text-center pt-2 text-xs text-muted-foreground">
                Already registered?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
