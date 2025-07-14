import { AuthForm } from "@/components/auth-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Mindful Track | Access Your Mental Health Journey",
  description: "Sign in to your Mindful Track account to access your mental health dashboard, journal entries, mood tracking, and wellness insights.",
  keywords: ["login", "sign in", "mental health app", "wellness tracker", "mood tracking login"],
  openGraph: {
    title: "Login - Mindful Track | Access Your Mental Health Journey",
    description: "Sign in to your Mindful Track account to access your mental health dashboard, journal entries, mood tracking, and wellness insights.",
    url: "https://mindful-track.app/login",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login - Mindful Track | Access Your Mental Health Journey",
    description: "Sign in to your Mindful Track account to access your mental health dashboard, journal entries, mood tracking, and wellness insights.",
  },
  alternates: {
    canonical: "https://mindful-track.app/login",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
