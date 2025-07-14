import { Metadata } from "next";

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

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Journal & Logs - Mental Health Journaling",
    description: "Write detailed journal entries and track quick mood logs. Use CBT techniques, voice recognition, and structured prompts to improve mental wellness and self-awareness.",
    url: "https://mindful-track.app/journal",
    isPartOf: {
      "@type": "WebSite",
      name: "Mindful Track",
      url: "https://mindful-track.app",
    },
    about: {
      "@type": "Thing",
      name: "Mental Health Journaling",
      description: "Therapeutic journaling techniques for mental wellness",
    },
    audience: {
      "@type": "Audience",
      audienceType: "People interested in mental health and wellness",
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Journal & Logs Feature",
      description: "Digital journaling tool with CBT techniques and mood tracking",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://mindful-track.app",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Journal & Logs",
          item: "https://mindful-track.app/journal",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {children}
    </>
  );
} 