interface PageHeaderProps {
    title: string;
    description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
        </div>
    );
}
