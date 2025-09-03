
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10 px-4 flex flex-col items-center justify-center text-center">
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>Feature Not Available</CardTitle>
                <CardDescription>
                    The dashboard functionality requires a database connection, which has been removed from this version of the application.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground">
                    You can still explore other features of the site.
                </p>
                <Button asChild>
                    <Link href="/">Return to Homepage</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
