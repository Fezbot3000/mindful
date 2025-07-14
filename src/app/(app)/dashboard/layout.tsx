
import { LogsProvider } from '@/hooks/use-logs';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <LogsProvider>{children}</LogsProvider>;
}
