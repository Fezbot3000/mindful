import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { generatePageStructuredData } from "@/components/structured-data";

// Lazy load the data management component
const DataManagement = dynamic(() => import("@/components/settings/data-management").then(mod => ({ default: mod.DataManagement })), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

export const metadata: Metadata = {
  title: "Settings - Mindful Track | Data Management & Privacy",
  description: "Manage your mental health data, export backups, and control your privacy settings. Secure data management for your wellness journey.",
  keywords: ["data management", "privacy settings", "data export", "backup", "mental health data", "user preferences"],
  openGraph: {
    title: "Settings - Mindful Track | Data Management & Privacy",
    description: "Manage your mental health data, export backups, and control your privacy settings. Secure data management for your wellness journey.",
    url: "https://mindful-track.app/settings",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Settings - Mindful Track | Data Management & Privacy",
    description: "Manage your mental health data, export backups, and control your privacy settings. Secure data management for your wellness journey.",
  },
  alternates: {
    canonical: "https://mindful-track.app/settings",
  },
};

export default function SettingsPage() {
  const structuredData = generatePageStructuredData({
    title: "Settings - Data Management & Privacy",
    description: "Manage your mental health data, export backups, and control your privacy settings. Secure data management for your wellness journey.",
    url: "https://mindful-track.app/settings",
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
        <PageHeader
          title="Settings"
          description="Manage your application data and preferences."
        />
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <DataManagement />
        </Suspense>
      </div>
    </>
  );
}
