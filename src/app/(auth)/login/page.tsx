'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/client/components/ui/button';
import { Input } from '@/client/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/client/components/ui/card';
import { loginAction } from '@/server/actions/auth.actions';
import { Loader2, AlertCircle, Clock, Lock, Sparkles, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [demoLoadingRole, setDemoLoadingRole] = React.useState<'admin' | 'user' | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isPendingApproval, setIsPendingApproval] = React.useState(false);

  const executeLogin = async (targetEmail: string, targetPass: string, roleType?: 'admin' | 'user') => {
    setIsSubmitting(true);
    if (roleType) setDemoLoadingRole(roleType);
    setErrorMessage(null);
    setIsPendingApproval(false);

    const formData = new FormData();
    formData.append('email', targetEmail);
    formData.append('password', targetPass);

    try {
      const result = await loginAction(null, formData);

      if (!result.success) {
        if (result.isPending) {
          setIsPendingApproval(true);
        } else {
          setErrorMessage(result.error || 'Invalid credentials. Please verify your email and password.');
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
      setDemoLoadingRole(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string, role: 'admin' | 'user') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    executeLogin(demoEmail, demoPass, role);
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

        <CardContent className="space-y-5">
          {/* Quick Demo Access for Recruiters & Reviewers */}
          <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Recruiter / Quick Demo Access
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">1-Click</span>
            </div>
            
            <p className="text-[11px] text-muted-foreground leading-snug">
              Reviewing this project for hiring or evaluation? Click a role below to explore the dashboard instantly:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleQuickDemo('admin@demo.com', 'demo123456', 'admin')}
                className="h-auto py-2 px-2.5 flex flex-col items-start gap-0.5 border-primary/30 hover:border-primary hover:bg-primary/10 text-left"
              >
                <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  {demoLoadingRole === 'admin' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Demo Admin'
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">Full approval & CRUD</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleQuickDemo('user@demo.com', 'demo123456', 'user')}
                className="h-auto py-2 px-2.5 flex flex-col items-start gap-0.5 border-primary/30 hover:border-primary hover:bg-primary/10 text-left"
              >
                <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  {demoLoadingRole === 'user' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Demo Contributor'
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">Collaborative editor</span>
              </Button>
            </div>
          </div>

          <div className="relative flex py-0.5 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-2 text-[10px] uppercase font-semibold text-muted-foreground">Or sign in manually</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gstu.ac.bd or admin@demo.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full font-semibold shadow-sm">
              {isSubmitting && !demoLoadingRole ? (
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
