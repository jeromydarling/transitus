/**
 * Settings — User preferences, email integration, NRI configuration.
 */

import { useState } from 'react';
import { Settings, Mail, Globe, Bell, Shield, User, Palette, Brain, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getCurrentSeason } from '@/lib/transitionCalendar';

interface EmailConfig {
  connected: boolean;
  address?: string;
  provider?: 'gmail' | 'outlook' | 'other';
  nriAnalysis: boolean;
  autoDetectContacts: boolean;
  autoDetectCommitments: boolean;
  lastSync?: string;
}

function loadEmailConfig(): EmailConfig {
  try {
    return JSON.parse(localStorage.getItem('transitus_email_config') || 'null') || {
      connected: false, nriAnalysis: false, autoDetectContacts: false, autoDetectCommitments: false,
    };
  } catch {
    return { connected: false, nriAnalysis: false, autoDetectContacts: false, autoDetectCommitments: false };
  }
}

function saveEmailConfig(config: EmailConfig) {
  localStorage.setItem('transitus_email_config', JSON.stringify(config));
}

export default function AppSettings() {
  const [emailConfig, setEmailConfig] = useState<EmailConfig>(loadEmailConfig);
  const [emailInput, setEmailInput] = useState('');
  const [notifySignals, setNotifySignals] = useState(true);
  const [notifyCommitments, setNotifyCommitments] = useState(true);
  const [notifyQuiet, setNotifyQuiet] = useState(false);
  const [laymanMode, setLaymanMode] = useState(true);
  const season = getCurrentSeason();

  const connectEmail = () => {
    if (!emailInput.trim()) return;
    const provider = emailInput.includes('gmail') ? 'gmail' as const : emailInput.includes('outlook') ? 'outlook' as const : 'other' as const;
    const updated: EmailConfig = {
      connected: true,
      address: emailInput.trim(),
      provider,
      nriAnalysis: true,
      autoDetectContacts: true,
      autoDetectCommitments: true,
      lastSync: new Date().toISOString(),
    };
    setEmailConfig(updated);
    saveEmailConfig(updated);
    setEmailInput('');
    toast.success('Email connected. NRI will begin learning from your correspondence.');
  };

  const disconnectEmail = () => {
    const updated: EmailConfig = { connected: false, nriAnalysis: false, autoDetectContacts: false, autoDetectCommitments: false };
    setEmailConfig(updated);
    saveEmailConfig(updated);
    toast.success('Email disconnected.');
  };

  const updateEmailSetting = (key: keyof EmailConfig, value: boolean) => {
    const updated = { ...emailConfig, [key]: value };
    setEmailConfig(updated);
    saveEmailConfig(updated);
  };

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-4 w-4 text-[hsl(16_65%_48%)]" />
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">Settings</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-[hsl(20_25%_12%)] mb-8">Preferences</h1>

        <div className="space-y-6">

          {/* ── Email Integration ── */}
          <section className="rounded-xl bg-white border border-[hsl(30_18%_82%)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[hsl(30_18%_82%/0.5)] flex items-center gap-3">
              <Mail className="h-5 w-5 text-[hsl(16_65%_48%)]" />
              <div>
                <h2 className="text-sm font-semibold text-[hsl(20_25%_12%)]">Email Integration</h2>
                <p className="text-xs text-[hsl(20_25%_12%/0.5)]">Connect your email so NRI can learn from your correspondence</p>
              </div>
            </div>
            <div className="px-5 py-4 space-y-4">
              {emailConfig.connected ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[hsl(152_40%_28%)]" />
                      <span className="text-sm text-[hsl(20_25%_12%)]">{emailConfig.address}</span>
                      <Badge variant="outline" className="text-[10px]">{emailConfig.provider}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={disconnectEmail} className="text-xs text-[hsl(0_50%_45%)]">Disconnect</Button>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[hsl(30_18%_82%/0.5)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[hsl(20_25%_12%)]">NRI email analysis</p>
                        <p className="text-xs text-[hsl(20_25%_12%/0.45)]">NRI reads sent emails to detect stakeholder mentions, commitments, and follow-ups</p>
                      </div>
                      <Switch checked={emailConfig.nriAnalysis} onCheckedChange={v => updateEmailSetting('nriAnalysis', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[hsl(20_25%_12%)]">Auto-detect new contacts</p>
                        <p className="text-xs text-[hsl(20_25%_12%/0.45)]">Suggest new stakeholders from email signatures and recipients</p>
                      </div>
                      <Switch checked={emailConfig.autoDetectContacts} onCheckedChange={v => updateEmailSetting('autoDetectContacts', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[hsl(20_25%_12%)]">Auto-detect commitments</p>
                        <p className="text-xs text-[hsl(20_25%_12%/0.45)]">Flag emails containing promises, deadlines, or agreement language</p>
                      </div>
                      <Switch checked={emailConfig.autoDetectCommitments} onCheckedChange={v => updateEmailSetting('autoDetectCommitments', v)} />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-[hsl(198_55%_42%/0.06)] border border-[hsl(198_55%_42%/0.15)]">
                    <AlertCircle className="h-4 w-4 text-[hsl(198_55%_42%)] mt-0.5 shrink-0" />
                    <p className="text-xs text-[hsl(20_25%_12%/0.55)]">
                      NRI processes emails locally and never stores full message content. Only detected entities (names, commitments, follow-ups) are saved as suggestions for your review. You approve every suggestion before it enters your data.
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-[hsl(20_25%_12%/0.6)]">
                    When connected, NRI will analyze your sent emails to detect stakeholder mentions, emerging commitments, and follow-up actions. Every suggestion requires your approval before it enters Transitus.
                  </p>
                  <div className="flex gap-2">
                    <Input value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="your@email.com" className="flex-1" />
                    <Button onClick={connectEmail} disabled={!emailInput.includes('@')} className="rounded-full bg-[hsl(16_65%_48%)] text-white hover:bg-[hsl(16_65%_48%/0.85)]">
                      Connect
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── Notifications ── */}
          <section className="rounded-xl bg-white border border-[hsl(30_18%_82%)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[hsl(30_18%_82%/0.5)] flex items-center gap-3">
              <Bell className="h-5 w-5 text-[hsl(16_65%_48%)]" />
              <h2 className="text-sm font-semibold text-[hsl(20_25%_12%)]">Notifications</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                { label: 'New signals in your places', checked: notifySignals, set: setNotifySignals },
                { label: 'Commitments approaching renewal', checked: notifyCommitments, set: setNotifyCommitments },
                { label: 'Stakeholders needing reconnection', checked: notifyQuiet, set: setNotifyQuiet },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-[hsl(20_25%_12%)]">{item.label}</span>
                  <Switch checked={item.checked} onCheckedChange={item.set} />
                </div>
              ))}
            </div>
          </section>

          {/* ── Data Display ── */}
          <section className="rounded-xl bg-white border border-[hsl(30_18%_82%)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[hsl(30_18%_82%/0.5)] flex items-center gap-3">
              <Palette className="h-5 w-5 text-[hsl(16_65%_48%)]" />
              <h2 className="text-sm font-semibold text-[hsl(20_25%_12%)]">Data Display</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(20_25%_12%)]">Plain language mode</p>
                  <p className="text-xs text-[hsl(20_25%_12%/0.45)]">Show environmental data in human-readable terms instead of technical percentiles</p>
                </div>
                <Switch checked={laymanMode} onCheckedChange={setLaymanMode} />
              </div>
            </div>
          </section>

          {/* ── NRI ── */}
          <section className="rounded-xl bg-white border border-[hsl(30_18%_82%)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[hsl(30_18%_82%/0.5)] flex items-center gap-3">
              <Brain className="h-5 w-5 text-[hsl(16_65%_48%)]" />
              <h2 className="text-sm font-semibold text-[hsl(20_25%_12%)]">NRI Companion</h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="p-3 rounded-lg bg-[hsl(38_30%_95%)]">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: season.color }}>Current Season: {season.label}</p>
                <p className="text-xs text-[hsl(20_25%_12%/0.55)] italic">{season.posture}</p>
                <p className="text-xs text-[hsl(20_25%_12%/0.45)] mt-1">NRI adapts its tone and suggestions to match the season. During {season.label}, NRI will be {season.nriTone}.</p>
              </div>
            </div>
          </section>

          {/* ── Privacy ── */}
          <section className="rounded-xl bg-white border border-[hsl(30_18%_82%)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[hsl(30_18%_82%/0.5)] flex items-center gap-3">
              <Shield className="h-5 w-5 text-[hsl(16_65%_48%)]" />
              <h2 className="text-sm font-semibold text-[hsl(20_25%_12%)]">Privacy & Data</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-xs text-[hsl(20_25%_12%/0.55)]">
                All data is stored locally in your browser until Supabase integration is complete. Community stories respect consent levels. NRI processes data locally and never sends personal information to external services without your explicit approval.
              </p>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => { localStorage.removeItem('transitus_data'); window.location.reload(); }}>
                Reset all data to defaults
              </Button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
