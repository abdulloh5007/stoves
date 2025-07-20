import type { ReactNode } from 'react';

// This layout isolates the login page from the main admin layout to prevent redirect loops.
export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
