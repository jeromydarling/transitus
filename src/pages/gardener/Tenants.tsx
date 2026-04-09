/**
 * Gardener Tenants — Tenant management page (multi-tenant placeholder).
 */

import { Building2, Users, MapPin, Clock, Database } from 'lucide-react';

interface MockTenant {
  id: string;
  name: string;
  memberCount: number;
  placeCount: number;
  lastActive: string;
  status: 'active' | 'onboarding';
}

const MOCK_TENANTS: MockTenant[] = [
  {
    id: 't-1',
    name: 'Southeast Chicago Coalition',
    memberCount: 24,
    placeCount: 8,
    lastActive: '2026-04-08',
    status: 'active',
  },
  {
    id: 't-2',
    name: 'East Boston GreenRoots',
    memberCount: 16,
    placeCount: 5,
    lastActive: '2026-04-07',
    status: 'active',
  },
  {
    id: 't-3',
    name: 'Little Village LVEJO',
    memberCount: 31,
    placeCount: 12,
    lastActive: '2026-04-09',
    status: 'active',
  },
];

export default function GardenerTenants() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-[hsl(16_65%_48%)]" />
          <h2 className="font-serif text-2xl text-[hsl(20_25%_12%)]">Tenants</h2>
        </div>
        <p className="text-sm text-[hsl(20_25%_12%/0.5)]">
          Multi-tenant organization management.
        </p>
      </div>

      {/* Coming with Supabase notice */}
      <div className="bg-[hsl(38_80%_55%/0.08)] border border-[hsl(38_80%_55%/0.2)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-[hsl(38_80%_50%)]" />
          <h3 className="text-sm font-semibold text-[hsl(20_25%_12%)]">Coming with Supabase</h3>
        </div>
        <p className="text-sm text-[hsl(20_25%_12%/0.6)] leading-relaxed">
          Full multi-tenant support will be available once the Supabase backend is wired.
          Below is a preview of the tenant management interface with mock data.
          Each tenant will have its own isolated data, user management, and billing context.
        </p>
      </div>

      {/* Tenant list */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xs font-semibold text-[hsl(20_25%_12%)] uppercase tracking-wider">
            Organizations ({MOCK_TENANTS.length})
          </h3>
        </div>

        {MOCK_TENANTS.map(tenant => (
          <div
            key={tenant.id}
            className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5 hover:border-[hsl(16_65%_48%/0.3)] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-base font-semibold text-[hsl(20_25%_12%)]">{tenant.name}</h4>
                <span
                  className="inline-block mt-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: tenant.status === 'active' ? 'hsl(152 40% 28% / 0.1)' : 'hsl(38 80% 55% / 0.1)',
                    color: tenant.status === 'active' ? 'hsl(152 40% 28%)' : 'hsl(38 80% 50%)',
                  }}
                >
                  {tenant.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[hsl(20_25%_12%/0.35)]" />
                <div>
                  <p className="text-sm font-medium text-[hsl(20_25%_12%)]">{tenant.memberCount}</p>
                  <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider">Members</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[hsl(20_25%_12%/0.35)]" />
                <div>
                  <p className="text-sm font-medium text-[hsl(20_25%_12%)]">{tenant.placeCount}</p>
                  <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider">Places</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[hsl(20_25%_12%/0.35)]" />
                <div>
                  <p className="text-sm font-medium text-[hsl(20_25%_12%)]">
                    {new Date(tenant.lastActive).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider">Last Active</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
