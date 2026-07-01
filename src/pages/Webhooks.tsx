import { useState, useRef } from 'react';
import {
  Webhook, Plus, Trash2, CheckCircle2, Clock, Globe,
  Key, Tag, Copy, Check, AlertTriangle, Rss,
} from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import { useWebhooks } from '../api/hooks';
import { api } from '../api/client';
import type { Webhook as WebhookType } from '../api/client';

const ALL_EVENT_TYPES = [
  'finding.created',
  'finding.severity_changed',
  'snapshot.completed',
  'attack_path.detected',
  'supply_chain.vulnerability',
  'compliance.score_changed',
];

const EVENT_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  'finding.created':           { color: 'var(--danger)',  bg: 'var(--danger-muted)',  border: 'var(--danger-border)'  },
  'finding.severity_changed':  { color: 'var(--orange)',  bg: 'var(--orange-muted)',  border: 'var(--orange-border)'  },
  'snapshot.completed':        { color: 'var(--success)', bg: 'var(--success-muted)', border: 'var(--success-border)' },
  'attack_path.detected':      { color: 'var(--danger)',  bg: 'var(--danger-muted)',  border: 'var(--danger-border)'  },
  'supply_chain.vulnerability':{ color: 'var(--warning)', bg: 'var(--warning-muted)', border: 'var(--warning-border)' },
  'compliance.score_changed':  { color: 'var(--accent)',  bg: 'var(--accent-muted)',  border: 'var(--accent-border)'  },
};

function EventPill({ type }: { type: string }) {
  const c = EVENT_COLORS[type] ?? { color: 'var(--text-secondary)', bg: 'var(--bg-elevated)', border: 'var(--border)' };
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 5,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap',
    }}>
      {type}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button onClick={handle} title="Copy" style={{
      background: 'none', border: 'none', cursor: 'pointer',
      color: copied ? 'var(--success)' : 'var(--text-muted)', padding: 2,
      display: 'flex', alignItems: 'center',
    }}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

function WebhookCard({ webhook, onDelete }: { webhook: WebhookType; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      timeoutRef.current = window.setTimeout(() => setConfirming(false), 3000);
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onDelete();
  };

  const createdDate = webhook.created_at
    ? new Date(webhook.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <div style={{
      borderRadius: 14,
      border: '1px solid var(--border)',
      background: 'var(--bg-card)',
      overflow: 'hidden',
      transition: 'border-color 0.15s ease',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--success-muted)', border: '1px solid var(--success-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Webhook size={13} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{webhook.name}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Created {createdDate}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 5,
            background: 'var(--success-muted)', color: 'var(--success)', border: '1px solid var(--success-border)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
            Active
          </span>
          <button
            onClick={handleDelete}
            style={{
              padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
              background: confirming ? 'var(--danger-muted)' : 'var(--bg-card)',
              border: `1px solid ${confirming ? 'var(--danger-border)' : 'var(--border)'}`,
              color: confirming ? 'var(--danger)' : 'var(--text-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              transition: 'all 0.15s ease',
            }}
          >
            <Trash2 size={11} />
            {confirming ? 'Confirm?' : 'Remove'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 16px' }}>
        {/* URL */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 10px', borderRadius: 8,
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          marginBottom: 10,
        }}>
          <Globe size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
            {webhook.url}
          </span>
          <CopyButton text={webhook.url} />
        </div>

        {/* Event types */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Tag size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          {webhook.event_types.length === 0 ? (
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>All events</span>
          ) : (
            webhook.event_types.map(et => <EventPill key={et} type={et} />)
          )}
        </div>
      </div>

      {/* HMAC info bar */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-elevated)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <Key size={10} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          X-AIBOM-Signature: sha256=hmac({'{timestamp}.{body}'})
        </span>
      </div>
    </div>
  );
}

/* ─── Create form ─────────────────────────────────────────── */
const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 8,
  fontSize: 12,
  background: 'var(--bg-input)',
  border: '1px solid var(--border-input)',
  color: 'var(--text-primary)',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s ease',
  boxSizing: 'border-box' as const,
};

function CreateForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [events, setEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const toggle = (et: string) =>
    setEvents(prev => prev.includes(et) ? prev.filter(e => e !== et) : [...prev, et]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim() || !secret.trim()) {
      setError('Name, URL, and secret are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.createWebhook({ name: name.trim(), url: url.trim(), secret: secret.trim(), event_types: events });
      setSuccess(true);
      setName(''); setUrl(''); setSecret(''); setEvents([]);
      setTimeout(() => { setSuccess(false); onCreated(); }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create webhook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>
          Name
        </label>
        <input
          style={inputStyle}
          placeholder="e.g. Slack Alerts"
          value={name}
          onChange={e => setName(e.target.value)}
          onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border-input)')}
        />
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>
          Endpoint URL
        </label>
        <input
          style={inputStyle}
          placeholder="https://hooks.example.com/aibom"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border-input)')}
        />
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>
          Signing Secret
          <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6 }}>
            (used for HMAC-SHA256)
          </span>
        </label>
        <input
          style={inputStyle}
          type="password"
          placeholder="whsec_..."
          value={secret}
          onChange={e => setSecret(e.target.value)}
          onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border-input)')}
        />
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
          Event Types
          <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 6 }}>
            (leave blank = receive all)
          </span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {ALL_EVENT_TYPES.map(et => {
            const active = events.includes(et);
            const c = EVENT_COLORS[et] ?? { color: 'var(--text-secondary)', bg: 'var(--bg-elevated)', border: 'var(--border)' };
            return (
              <label key={et} style={{
                display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer',
                padding: '7px 10px', borderRadius: 8,
                background: active ? c.bg : 'var(--bg-elevated)',
                border: `1px solid ${active ? c.border : 'var(--border)'}`,
                transition: 'all 0.12s ease',
              }}>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggle(et)}
                  style={{ accentColor: c.color, flexShrink: 0 }}
                />
                <span style={{ fontSize: 11, fontWeight: active ? 600 : 400, color: active ? c.color : 'var(--text-secondary)' }}>
                  {et}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '9px 12px', borderRadius: 8,
          background: 'var(--danger-muted)', border: '1px solid var(--danger-border)',
        }}>
          <AlertTriangle size={12} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'var(--danger)' }}>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || success}
        style={{
          padding: '10px 16px',
          borderRadius: 9, fontSize: 13, fontWeight: 700,
          background: success ? 'var(--success)' : 'var(--accent)',
          color: 'white', border: 'none', cursor: loading ? 'wait' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          opacity: loading ? 0.7 : 1,
          transition: 'background 0.25s ease, opacity 0.15s ease',
          boxShadow: success ? '0 0 0 1px rgba(30,199,106,0.4), 0 4px 14px rgba(30,199,106,0.25)' : '0 0 0 1px rgba(91,127,255,0.4), 0 4px 14px rgba(91,127,255,0.25)',
        }}
      >
        {success ? (
          <><CheckCircle2 size={14} /> Created!</>
        ) : loading ? (
          <><Clock size={14} /> Creating…</>
        ) : (
          <><Plus size={14} /> Create Webhook</>
        )}
      </button>
    </form>
  );
}

/* ─── Main page ───────────────────────────────────────────── */
export default function Webhooks() {
  const { data: webhooks, loading, refetch } = useWebhooks();

  const handleDelete = async (id: string) => {
    try {
      await api.deleteWebhook(id);
      refetch();
    } catch {
      // ignore — user sees stale UI; next refetch corrects it
    }
  };

  const active = webhooks ?? [];

  return (
    <PageShell
      title="Webhooks"
      subtitle="Real-time event delivery with HMAC-SHA256 signatures"
      actions={
        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px', borderRadius: 8,
          background: active.length > 0 ? 'var(--success-muted)' : 'var(--bg-elevated)',
          border: `1px solid ${active.length > 0 ? 'var(--success-border)' : 'var(--border)'}`,
        }}>
          <Rss size={12} style={{ color: active.length > 0 ? 'var(--success)' : 'var(--text-muted)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: active.length > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
            {active.length} active
          </span>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Create panel */}
        <div style={{
          borderRadius: 16, border: '1px solid var(--border)',
          background: 'var(--bg-card)', overflow: 'hidden',
          position: 'sticky', top: 20,
        }}>
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Plus size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>New Webhook</span>
          </div>
          <div style={{ padding: 18 }}>
            <CreateForm onCreated={refetch} />
          </div>

          {/* Signature docs */}
          <div style={{
            margin: '0 18px 18px',
            padding: '12px 14px', borderRadius: 10,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Verifying signatures
            </div>
            <pre style={{
              fontSize: 10, color: 'var(--text-secondary)', margin: 0,
              fontFamily: 'monospace', lineHeight: 1.6, whiteSpace: 'pre-wrap',
            }}>{`// Verify in your endpoint:
const sig = headers['x-aibom-signature'];
const ts  = headers['x-aibom-timestamp'];
const expected = 'sha256=' + hmac(
  secret, ts + '.' + rawBody
);
if (sig !== expected) reject(401);`}</pre>
          </div>
        </div>

        {/* Webhooks list */}
        <div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[0, 1].map(i => (
                <div key={i} style={{
                  height: 160, borderRadius: 14,
                  background: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-hover) 50%, var(--bg-elevated) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.4s infinite',
                }} />
              ))}
            </div>
          ) : active.length === 0 ? (
            <div style={{
              padding: '60px 0', textAlign: 'center',
              borderRadius: 16, border: '1px solid var(--border)',
              background: 'var(--bg-card)',
            }}>
              <Webhook size={32} style={{ color: 'var(--text-muted)', marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>No webhooks yet</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Create your first webhook to receive real-time event notifications.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {active.map(w => (
                <WebhookCard key={w.id} webhook={w} onDelete={() => handleDelete(w.id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </PageShell>
  );
}
