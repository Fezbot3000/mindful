import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { generatePageStructuredData } from "@/components/structured-data";

// Lazy load the insights page client
const InsightsPageClient = dynamic(() => import("@/components/insights/insights-page-client").then(mod => ({ default: mod.InsightsPageClient })), {
  loading: () => <Skeleton className="h-[600px] w-full" />,
});

export const metadata: Metadata = {
  title: "Insights & Analytics - Mindful Track | Mental Health Analytics",
  description: "Analyze your mental health patterns and trends. View data visualizations, export data, and discover patterns in your mood tracking and journaling data.",
  keywords: ["mental health analytics", "mood patterns", "wellness insights", "data analysis", "health data visualization", "therapy insights"],
  openGraph: {
    title: "Insights & Analytics - Mindful Track | Mental Health Analytics",
    description: "Analyze your mental health patterns and trends. View data visualizations, export data, and discover patterns in your mood tracking and journaling data.",
    url: "https://mindful-track.app/insights",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights & Analytics - Mindful Track | Mental Health Analytics",
    description: "Analyze your mental health patterns and trends. View data visualizations, export data, and discover patterns in your mood tracking and journaling data.",
  },
  alternates: {
    canonical: "https://mindful-track.app/insights",
  },
};

export default function InsightsPage() {
  const structuredData = generatePageStructuredData({
    title: "Insights & Analytics - Mental Health Analytics",
    description: "Analyze your mental health patterns and trends. View data visualizations, export data, and discover patterns in your mood tracking and journaling data.",
    url: "https://mindful-track.app/insights",
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
      <div className="space-y-6">
        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <InsightsPageClient />
        </Suspense>
      </div>
    </>
  );
}
