import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { generatePageStructuredData } from "@/components/structured-data";

// Lazy load the tool components
const BreathingExercise = dynamic(() => import("@/components/tools/breathing-exercise").then(mod => ({ default: mod.BreathingExercise })), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

const GroundingExercise = dynamic(() => import("@/components/tools/grounding-exercise").then(mod => ({ default: mod.GroundingExercise })), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

const MuscleRelaxation = dynamic(() => import("@/components/tools/muscle-relaxation").then(mod => ({ default: mod.MuscleRelaxation })), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

const AffirmationGenerator = dynamic(() => import("@/components/tools/affirmation-generator").then(mod => ({ default: mod.AffirmationGenerator })), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

export const metadata: Metadata = {
  title: "Mindfulness Tools - Mindful Track | Breathing Exercises & Meditation",
  description: "Practice guided breathing exercises and mindfulness techniques. Reduce stress, improve focus, and enhance mental wellness with interactive meditation tools.",
  keywords: ["mindfulness tools", "breathing exercises", "meditation", "stress relief", "anxiety management", "mental wellness tools"],
  openGraph: {
    title: "Mindfulness Tools - Mindful Track | Breathing Exercises & Meditation",
    description: "Practice guided breathing exercises and mindfulness techniques. Reduce stress, improve focus, and enhance mental wellness with interactive meditation tools.",
    url: "https://mindful-track.app/tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindfulness Tools - Mindful Track | Breathing Exercises & Meditation",
    description: "Practice guided breathing exercises and mindfulness techniques. Reduce stress, improve focus, and enhance mental wellness with interactive meditation tools.",
  },
  alternates: {
    canonical: "https://mindful-track.app/tools",
  },
};

export default function ToolsPage() {
  const structuredData = generatePageStructuredData({
    title: "Mindfulness Tools - Breathing Exercises & Meditation",
    description: "Practice guided breathing exercises and mindfulness techniques. Reduce stress, improve focus, and enhance mental wellness with interactive meditation tools.",
    url: "https://mindful-track.app/tools",
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
      <div className="space-y-6 min-h-0">
        <PageHeader
          title="Mindfulness Toolkit"
          description="Evidence-based tools to help you stay grounded and manage stress."
        />
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <BreathingExercise />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <GroundingExercise />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <MuscleRelaxation />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <AffirmationGenerator />
          </Suspense>
        </div>
      </div>
    </>
  );
}
