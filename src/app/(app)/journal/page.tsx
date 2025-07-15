
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { generatePageStructuredData } from "@/components/structured-data";

// Lazy load the journal page client
const JournalPageClient = dynamic(() => import("@/components/journal/journal-page-client").then(mod => ({ default: mod.JournalPageClient })), {
  loading: () => <Skeleton className="h-[600px] w-full" />,
});

export const metadata: Metadata = {
  title: "Journal & Logs - Mindful Track | Mental Health Journaling",
  description: "Write detailed journal entries and track quick mood logs. Use CBT techniques, voice recognition, and structured prompts to improve mental wellness and self-awareness.",
  keywords: ["mental health journal", "mood logging", "CBT techniques", "self-reflection", "wellness tracking", "therapy journal"],
  openGraph: {
    title: "Journal & Logs - Mindful Track | Mental Health Journaling",
    description: "Write detailed journal entries and track quick mood logs. Use CBT techniques, voice recognition, and structured prompts to improve mental wellness and self-awareness.",
    url: "https://mindful-track.app/journal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Journal & Logs - Mindful Track | Mental Health Journaling",
    description: "Write detailed journal entries and track quick mood logs. Use CBT techniques, voice recognition, and structured prompts to improve mental wellness and self-awareness.",
  },
  alternates: {
    canonical: "https://mindful-track.app/journal",
  },
};

export default function JournalPage() {
  const structuredData = generatePageStructuredData({
    title: "Journal & Logs - Mental Health Journaling",
    description: "Write detailed journal entries and track quick mood logs. Use CBT techniques, voice recognition, and structured prompts to improve mental wellness and self-awareness.",
    url: "https://mindful-track.app/journal",
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
        <JournalPageClient />
      </Suspense>
    </>
  );
}
