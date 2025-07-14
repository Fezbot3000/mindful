interface PageHeaderProps {
    title: string;
    description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div className="space-y-1.5">
            <h1 className="font-bold tracking-tight" style={{ fontSize: 'var(--text-2xl)' }}>{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
        </div>
    );
}
