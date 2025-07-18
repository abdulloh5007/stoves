import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your App!</CardTitle>
          <CardDescription>
            This is the starting point for your new application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>You can start editing this page in `src/app/page.tsx`.</p>
        </CardContent>
      </Card>
    </div>
  );
}
