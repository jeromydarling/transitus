import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--marketing-surface))] p-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-5xl text-[hsl(var(--marketing-navy))] mb-4">404</h1>
        <p className="text-[hsl(var(--marketing-navy)/0.7)] mb-2">
          The page <code className="text-sm bg-muted px-1.5 py-0.5 rounded">{location.pathname}</code> was not found.
        </p>
        <p className="text-sm text-[hsl(var(--marketing-navy)/0.5)] mb-8">
          It may have been moved or doesn't exist yet.
        </p>
        <Link to="/">
          <Button variant="outline" className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
