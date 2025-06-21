import { ReactNode } from 'react';
import { DynamicOpsNavigation } from '../DynamicOpsNavigation';

interface OpsLayoutProps {
  children: ReactNode;
}

export function OpsLayout({ children }: OpsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DynamicOpsNavigation />
      <div className="flex-1">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}