import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* 메인 콘텐츠 */}
      {children}
    </div>
  );
}
