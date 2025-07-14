
"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { MainNav } from "./main-nav";

export function MobileNav() {
    const isMobile = useIsMobile();

    if (!isMobile) {
        return null;
    }

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50 flex items-center" style={{ height: 'var(--component-xl)' }}>
            <MainNav isMobile={true} />
        </div>
    )
}
