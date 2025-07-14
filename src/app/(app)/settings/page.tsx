import { PageHeader } from "@/components/page-header";
import { DataManagement } from "@/components/settings/data-management";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your application data and preferences."
      />
      <DataManagement />
    </div>
  );
}
