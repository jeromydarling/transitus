import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--marketing-surface))] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Transitus</CardTitle>
          <CardDescription>
            Transitus is currently invite-only. Contact us to join the charter cohort.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <Link to="/contact">
            <Button className="rounded-full bg-[hsl(var(--marketing-navy))] text-white">
              Contact us
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
