import type { ReactNode } from 'react';

// This layout is only for the login page, to prevent redirect loops.
export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
