'use client';

// Этот макет предназначен только для страницы входа.
// Он не содержит никакой логики проверки аутентификации,
// чтобы избежать бесконечного цикла перенаправлений.
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
