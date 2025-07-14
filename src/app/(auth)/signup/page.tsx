import { AuthForm } from "@/components/auth-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Mindful Track | Start Your Mental Health Journey",
  description: "Create your free Mindful Track account to begin tracking your mental health, journaling, and building self-awareness with our wellness tools.",
  keywords: ["sign up", "create account", "mental health app", "wellness tracker", "free mental health tools"],
  openGraph: {
    title: "Sign Up - Mindful Track | Start Your Mental Health Journey",
    description: "Create your free Mindful Track account to begin tracking your mental health, journaling, and building self-awareness with our wellness tools.",
    url: "https://mindful-track.app/signup",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up - Mindful Track | Start Your Mental Health Journey",
    description: "Create your free Mindful Track account to begin tracking your mental health, journaling, and building self-awareness with our wellness tools.",
  },
  alternates: {
    canonical: "https://mindful-track.app/signup",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
