import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--marketing-surface))] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Transitus</CardTitle>
          <CardDescription>App launching soon. Check back for login access.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link to="/">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
