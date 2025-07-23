import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <Image src="/favicon-32x32.png" alt="Mindful Track Logo" width={32} height={32} />
            <span className="text-2xl font-bold">Mindful Track</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
