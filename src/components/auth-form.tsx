
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { sanitizeInput, sanitizeErrorMessage, authRateLimiter, secureLog } from "@/lib/security";
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  consent: z.boolean().optional(),
});

type AuthFormValues = z.infer<typeof formSchema>;

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const firebaseServices = getFirebaseApp();
  const auth = firebaseServices?.auth;

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      consent: false,
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    if (!auth) {
        toast({ variant: "destructive", title: "Configuration Error", description: "Firebase is not configured correctly. Check your .env.local file." });
        return;
    }

    // Rate limiting check
    const userIdentifier = data.email || 'anonymous';
    if (!authRateLimiter.isAllowed(userIdentifier)) {
      const remainingAttempts = authRateLimiter.getRemainingAttempts(userIdentifier);
      toast({ 
        variant: "destructive", 
        title: "Too Many Attempts", 
        description: `Too many failed attempts. Please try again later. (${remainingAttempts} attempts remaining)` 
      });
      return;
    }

    // Sanitize inputs
    const sanitizedData = {
      email: sanitizeInput(data.email),
      password: data.password, // Don't sanitize password as it may contain special characters
      consent: data.consent
    };

    setLoading(true);
    try {
      if (mode === "signup") {
        if (!sanitizedData.consent) {
            toast({ variant: "destructive", title: "Consent Required", description: "You must agree to the terms to sign up." });
            setLoading(false);
            return;
        }
        await createUserWithEmailAndPassword(auth, sanitizedData.email, sanitizedData.password);
        secureLog('info', 'User signup successful', { email: sanitizedData.email });
      } else {
        await signInWithEmailAndPassword(auth, sanitizedData.email, sanitizedData.password);
        secureLog('info', 'User login successful', { email: sanitizedData.email });
      }
      
      // Reset rate limiter on successful auth
      authRateLimiter.reset(userIdentifier);
      router.push("/dashboard/");
    } catch (error: any) {
      secureLog('error', 'Authentication failed', { 
        email: sanitizedData.email, 
        mode,
        error: error.code || error.message 
      });
      
      const friendlyMessage = sanitizeErrorMessage(error);
      toast({ variant: "destructive", title: "Authentication Error", description: friendlyMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
        toast({ variant: "destructive", title: "Configuration Error", description: "Firebase is not configured correctly. Check your .env.local file." });
        return;
    }

    // Rate limiting check for Google sign-in
    const userIdentifier = 'google_signin';
    if (!authRateLimiter.isAllowed(userIdentifier)) {
      const remainingAttempts = authRateLimiter.getRemainingAttempts(userIdentifier);
      toast({ 
        variant: "destructive", 
        title: "Too Many Attempts", 
        description: `Too many failed attempts. Please try again later. (${remainingAttempts} attempts remaining)` 
      });
      return;
    }

    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      secureLog('info', 'Google sign-in successful', { 
        email: result.user?.email || 'unknown' 
      });
      
      // Reset rate limiter on successful auth
      authRateLimiter.reset(userIdentifier);
      router.push("/dashboard/");
    } catch (error: any) {
      secureLog('error', 'Google sign-in failed', { 
        error: error.code || error.message 
      });
      
      const friendlyMessage = sanitizeErrorMessage(error);
      toast({ variant: "destructive", title: "Google Sign-In Error", description: friendlyMessage });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? 'Enter your credentials to access your account' 
            : 'Sign up to start your mindfulness journey'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" {...form.register("email")} />
            {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...form.register("password")} />
            {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
          </div>
          {mode === 'signup' && (
            <div className="items-top flex space-x-2">
              <Checkbox id="consent" {...form.register("consent")} />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I agree to the <a href="#" className="text-primary underline">Terms of Service</a> and <a href="#" className="text-primary underline">Privacy Policy</a>
                </Label>
                {form.formState.errors.consent && <p className="text-sm text-destructive">{form.formState.errors.consent.message}</p>}
              </div>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading || googleLoading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn} disabled={loading || googleLoading}>
          {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
          }
          Continue with Google
        </Button>
      </CardContent>
      <CardFooter className="text-sm text-center block">
        {mode === 'login' ? (
          <p>Don't have an account? <Link href="/signup" className="text-primary underline">Sign up</Link></p>
        ) : (
          <p>Already have an account? <Link href="/login" className="text-primary underline">Sign in</Link></p>
        )}
        {!auth && <p className="text-destructive mt-token-2 text-xs">Firebase is not configured. Please check environment variables.</p>}
      </CardFooter>
    </Card>
  );
}
