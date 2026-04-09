/**
 * DemoGate — Contact form that grants access to the demo app.
 * Collects name, email, org. On submit, redirects to /app?demo=true.
 * Static form — Lovable will wire the actual submission.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DemoGate() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    // Store demo info in localStorage for now
    localStorage.setItem('transitus_demo_user', JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      org: org.trim(),
      timestamp: new Date().toISOString(),
    }));

    setSubmitted(true);

    // Redirect to app with demo flag after brief animation
    setTimeout(() => {
      navigate('/app?demo=true');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(38_30%_95%)] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(152 45% 18%)' }}>
            <Globe className="h-5 w-5" style={{ color: 'hsl(38 80% 55%)' }} />
          </div>
          <span className="font-serif text-2xl tracking-tight text-[hsl(20_25%_12%)]">Transitus</span>
        </div>

        {!submitted ? (
          <div className="rounded-2xl bg-white border border-[hsl(30_18%_82%)] shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="font-serif text-xl text-[hsl(20_25%_12%)] mb-2">See Transitus in action</h1>
              <p className="text-sm text-[hsl(20_25%_12%/0.55)]">
                Enter your details to explore the full demo with real environmental justice data from Chicago and Boston.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-[hsl(20_25%_12%/0.7)]">Your name</Label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Maria Santos"
                  required
                  className="mt-1 rounded-lg"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-[hsl(20_25%_12%/0.7)]">Work email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="maria@setaskforce.org"
                  required
                  className="mt-1 rounded-lg"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-[hsl(20_25%_12%/0.7)]">Organization <span className="text-[hsl(20_25%_12%/0.3)]">(optional)</span></Label>
                <Input
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  placeholder="Southeast Environmental Task Force"
                  className="mt-1 rounded-lg"
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-full h-11 bg-[hsl(16_65%_48%)] text-white hover:bg-[hsl(16_65%_48%/0.85)] text-sm font-medium mt-2"
              >
                Enter the demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="text-[10px] text-[hsl(20_25%_12%/0.35)] text-center mt-4">
              No credit card required. Demo includes real environmental data for 3 U.S. communities.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-[hsl(30_18%_82%)] shadow-lg p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[hsl(152_40%_28%/0.1)] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-7 w-7 text-[hsl(152_40%_28%)]" />
            </div>
            <h2 className="font-serif text-xl text-[hsl(20_25%_12%)] mb-2">Welcome, {name.split(' ')[0]}.</h2>
            <p className="text-sm text-[hsl(20_25%_12%/0.55)]">Loading your stewardship workspace...</p>
          </div>
        )}
      </div>
    </div>
  );
}
