
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
  const { auth } = getFirebaseApp() || {};

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
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!data.consent) {
            toast({ variant: "destructive", title: "Consent Required", description: "You must agree to the terms to sign up." });
            setLoading(false);
            return;
        }
        await createUserWithEmailAndPassword(auth, data.email, data.password);
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Authentication Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
        toast({ variant: "destructive", title: "Configuration Error", description: "Firebase is not configured correctly. Check your .env.local file." });
        return;
    }
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Google Sign-In Error", description: error.message });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>{mode === 'login' ? 'Welcome Back' : 'Create an Account'}</CardTitle>
            <CardDescription>
                {mode === 'login' ? 'Log in to continue to Mindful Track.' : 'Enter your details to get started.'}
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" {...form.register("email")} />
                    {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...form.register("password")} />
                     {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
                </div>
                {mode === 'signup' && (
                    <div className="items-top flex space-x-2">
                         <Checkbox id="consent" {...form.register("consent")} />
                        <div className="grid gap-1.5 leading-none">
                            <label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                I agree that my data is stored securely and for my personal use only.
                            </label>
                        </div>
                    </div>
                )}
                <Button type="submit" className="w-full" disabled={loading || !auth}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mode === 'login' ? 'Log In' : 'Sign Up'}
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
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={googleLoading || !auth}>
                {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 72.2C322 108.9 287.6 96 248 96c-88.8 0-160.1 71.9-160.1 160.1s71.3 160.1 160.1 160.1c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                }
                Google
            </Button>
        </CardContent>
        <CardFooter className="text-sm text-center block">
             {mode === 'login' ? (
                <p>Don't have an account? <Link href="/signup" className="underline">Sign up</Link></p>
             ) : (
                <p>Already have an account? <Link href="/login" className="underline">Log in</Link></p>
             )}
             {!auth && <p className="text-destructive mt-2 text-xs">Firebase is not configured. Please check environment variables.</p>}
        </CardFooter>
    </Card>
  );
}
