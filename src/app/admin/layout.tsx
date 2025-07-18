// This file can be used to protect the admin routes
// We will add authentication logic here in the next steps.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
