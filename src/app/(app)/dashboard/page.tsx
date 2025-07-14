import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { generatePageStructuredData } from "@/components/structured-data";

// Lazy load the dashboard client page
const DashboardClientPage = dynamic(() => import("@/components/dashboard/dashboard-client-page").then(mod => ({ default: mod.DashboardClientPage })), {
  loading: () => <Skeleton className="h-[600px] w-full" />,
});

export const metadata: Metadata = {
  title: "Dashboard - Mindful Track | Mental Health Overview",
  description: "View your mental health progress, recent logs, and insights. Track your mood, triggers, and wellness journey with comprehensive analytics and visualizations.",
  keywords: ["mental health dashboard", "mood tracking", "wellness analytics", "progress tracking", "mental health insights"],
  openGraph: {
    title: "Dashboard - Mindful Track | Mental Health Overview",
    description: "View your mental health progress, recent logs, and insights. Track your mood, triggers, and wellness journey with comprehensive analytics and visualizations.",
    url: "https://mindful-track.app/dashboard",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard - Mindful Track | Mental Health Overview",
    description: "View your mental health progress, recent logs, and insights. Track your mood, triggers, and wellness journey with comprehensive analytics and visualizations.",
  },
  alternates: {
    canonical: "https://mindful-track.app/dashboard",
  },
};

export default function DashboardPage() {
  const structuredData = generatePageStructuredData({
    title: "Dashboard - Mental Health Overview",
    description: "View your mental health progress, recent logs, and insights. Track your mood, triggers, and wellness journey with comprehensive analytics and visualizations.",
    url: "https://mindful-track.app/dashboard",
    type: "WebPage",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <DashboardClientPage />
      </Suspense>
    </>
  );
}
