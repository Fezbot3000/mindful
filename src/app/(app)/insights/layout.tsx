
import { LogsProvider } from '@/hooks/use-logs';

export default function InsightsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <LogsProvider>{children}</LogsProvider>;
}
