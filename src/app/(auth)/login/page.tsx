'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/client/components/ui/button';
import { Input } from '@/client/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/client/components/ui/card';
import { loginAction } from '@/server/actions/auth.actions';
import { Loader2, AlertCircle, Clock, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isPendingApproval, setIsPendingApproval] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setIsPendingApproval(false);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await loginAction(null, formData);

      if (!result.success) {
        if (result.isPending) {
          setIsPendingApproval(true);
        } else {
          setErrorMessage(result.error || 'Invalid credentials.');
        }
      } else {
        if (result.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/user');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while logging in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <Card className="border border-border/80 shadow-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold mb-2 shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-black text-foreground">Management Portal</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Sign in to manage student and alumni directory records.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Pending Approval Feedback Alert */}
            {isPendingApproval && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3 text-amber-900 dark:text-amber-200">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <strong className="font-bold text-amber-950 dark:text-amber-100">
                    Account Under Review
                  </strong>
                  <p className="leading-relaxed">
                    Your account is waiting for admin approval. Please check back later or contact a departmental administrator.
                  </p>
                </div>
              </div>
            )}

            {/* General Error Alert */}
            {errorMessage && !isPendingApproval && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-xs rounded-lg border border-destructive/20 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                placeholder="name@gstu.ac.bd"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full font-semibold shadow-sm">
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying Credentials...
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>

            <div className="text-center pt-2 text-xs text-muted-foreground">
              Don't have an approved account?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Apply for Registration
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
