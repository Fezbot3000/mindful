
"use client"

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || (!loading && user)) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    ); 
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Mindful Track Logo" width={28} height={28} />
          <h1 className="text-xl font-bold">Mindful Track</h1>
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
                Your Personal Space for <span className="text-primary">Mindful</span> Tracking
              </h2>
              <p className="mt-4 max-w-2xl mx-auto md:mx-0 text-lg text-muted-foreground">
                Gently track thoughts, fears, and compulsions. Build self-awareness and find patterns to support your mental health journey.
              </p>
              <div className="mt-8 flex justify-center md:justify-start gap-4">
                <Button asChild size="lg">
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <Image src="https://placehold.co/600x400.png" data-ai-hint="calm nature" alt="Calm illustration" width={600} height={400} className="rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </main>
       <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Mindful Track. All rights reserved.</p>
        <p className="mt-1">This is not a medical device. Consult with a healthcare professional for medical advice.</p>
      </footer>
    </div>
  );
}
