import { useState } from 'react';
import {
  Cloud, Check, Copy, ShieldCheck, Terminal, KeyRound, ChevronRight, CircleDashed,
} from 'lucide-react';
import PageShell from '../components/layout/PageShell';

const TENANT = (import.meta.env.VITE_TENANT_ID as string) ?? '10000000-0000-0000-0000-000000000001';
const API_URL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:8001';

/* ── connector catalog ─────────────────────────────────────── */
interface Connector {
  id: string; name: string; tag: string;
  status: 'available' | 'soon';
  services: string[];
}
const CONNECTORS: Connector[] = [
  { id: 'aws',   name: 'Amazon Web Services', tag: 'AWS', status: 'available',
    services: ['Bedrock', 'SageMaker', 'ECR', 'S3', 'IAM', 'Lambda', 'Secrets (metadata)', 'MCP discovery'] },
  { id: 'azure', name: 'Microsoft Azure',      tag: 'AZ',  status: 'soon',
    services: ['AI Foundry', 'ML', 'ACR', 'Key Vault (metadata)'] },
  { id: 'gcp',   name: 'Google Cloud',         tag: 'GCP', status: 'soon',
    services: ['Vertex AI', 'Artifact Registry', 'GCS'] },
];

/* read-only IAM policy the collector needs (metadata only — no GetSecretValue) */
const IAM_POLICY = `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AISPMCollectorReadOnly",
    "Effect": "Allow",
    "Action": [
      "bedrock:List*", "bedrock:Get*",
      "sagemaker:List*", "sagemaker:Describe*",
      "ecr:Describe*", "ecr:List*", "ecr:BatchGetImage",
      "s3:ListAllMyBuckets", "s3:GetBucketLocation", "s3:GetBucketTagging",
      "iam:ListRoles", "iam:GetRole", "iam:ListRolePolicies",
      "lambda:List*", "lambda:GetFunction*",
      "secretsmanager:ListSecrets"
    ],
    "Resource": "*"
  }]
}`;

const RUN_CMD = `docker run --rm \\
  -e AIBOM_TENANT_ID=${TENANT} \\
  -e AIBOM_API_ENDPOINT=${API_URL} \\
  -e AIBOM_HMAC_KEY=<your-ingest-key> \\
  -e AWS_REGION=us-east-1 \\
  -v $HOME/.aws:/root/.aws:ro \\
  ghcr.io/aispm/collector:latest`;

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1600); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500,
        padding: '4px 9px', borderRadius: 7, cursor: 'pointer',
        background: ok ? 'var(--success-muted)' : 'var(--bg-elevated)',
        border: `1px solid ${ok ? 'var(--success-border)' : 'var(--border)'}`,
        color: ok ? 'var(--success)' : 'var(--text-secondary)',
      }}>
      {ok ? <Check size={12} /> : <Copy size={12} />}{ok ? 'Copied' : 'Copy'}
    </button>
  );
}

function CodeBlock({ title, icon: Icon, code, lang }: { title: string; icon: typeof Terminal; code: string; lang?: string }) {
  return (
    <div style={{ borderRadius: 11, border: '1px solid var(--border)', background: 'var(--bg-surface)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 13px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Icon size={13} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
          {lang && <span style={{ fontSize: 9.5, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{lang}</span>}
        </div>
        <CopyBtn text={code} />
      </div>
      <pre style={{ margin: 0, padding: '13px 14px', overflowX: 'auto' }}>
        <code style={{ fontSize: 11.5, lineHeight: 1.65, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'pre' }}>
          {code}
        </code>
      </pre>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
          background: 'var(--accent-muted)', border: '1px solid var(--accent-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{n}</div>
        <div style={{ flex: 1, width: 1, background: 'var(--border)', marginTop: 4 }} />
      </div>
      <div style={{ flex: 1, paddingBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

export default function Integrations() {
  const [selected, setSelected] = useState('aws');
  const conn = CONNECTORS.find(c => c.id === selected)!;

  return (
    <PageShell
      title="Connectors"
      subtitle="Deploy read-only collectors to build your AI-BOM from live cloud evidence"
    >
      {/* Catalog */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {CONNECTORS.map(c => {
          const active = selected === c.id;
          const soon = c.status === 'soon';
          return (
            <div key={c.id}
              onClick={() => !soon && setSelected(c.id)}
              style={{
                borderRadius: 13, padding: '16px 18px',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                background: active ? 'var(--bg-selected)' : 'var(--bg-card)',
                cursor: soon ? 'default' : 'pointer', opacity: soon ? 0.62 : 1,
                boxShadow: active ? '0 0 0 1px var(--accent-border)' : 'none',
                transition: 'all 0.15s ease',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '-0.3px' }}>
                    {c.tag}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                </div>
                {soon
                  ? <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', gap: 4 }}><CircleDashed size={10} /> Soon</span>
                  : <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                      background: 'var(--success-muted)', border: '1px solid var(--success-border)', color: 'var(--success)' }}>
                      Available</span>}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {c.services.map(s => (
                  <span key={s} style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 5,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{s}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {conn.status === 'soon' ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          The {conn.name} collector is not yet available. AWS is live today.
        </div>
      ) : (
        <div style={{ borderRadius: 16, border: '1px solid var(--border)', background: 'var(--bg-card)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)',
            display: 'flex', alignItems: 'center', gap: 9 }}>
            <Cloud size={15} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Deploy the AWS collector</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
              Read-only · runs in your account · sends metadata only
            </span>
          </div>

          <div style={{ padding: '20px 22px' }}>
            <Step n={1} title="Grant a read-only IAM policy">
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
                Attach this policy to the role the collector runs as. It reads inventory and configuration
                only — notably <code style={{ color: 'var(--text-primary)' }}>secretsmanager:ListSecrets</code> (names, not values):
              </p>
              <CodeBlock title="aispm-collector-readonly.json" icon={ShieldCheck} code={IAM_POLICY} lang="json" />
            </Step>

            <Step n={2} title="Retrieve your ingest signing key">
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The collector HMAC-signs every batch. Fetch your tenant's ingest key from
                <span style={{ color: 'var(--text-primary)' }}> Settings → Ingest Keys</span> (or your secret
                store) and use it as <code style={{ color: 'var(--text-primary)' }}>AIBOM_HMAC_KEY</code> below.
                It is never displayed here.
              </p>
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                borderRadius: 9, background: 'var(--warning-muted)', border: '1px solid var(--warning-border)' }}>
                <KeyRound size={13} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--warning)' }}>
                  Keep the signing key secret — anyone with it can submit evidence for your tenant.
                </span>
              </div>
            </Step>

            <Step n={3} title="Run the collector">
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
                Your tenant ID and API endpoint are filled in. Replace{' '}
                <code style={{ color: 'var(--text-primary)' }}>&lt;your-ingest-key&gt;</code> with the key from step 2:
              </p>
              <CodeBlock title="Run with Docker" icon={Terminal} code={RUN_CMD} lang="bash" />
            </Step>

            <div style={{ display: 'flex', gap: 14, marginTop: 4, paddingLeft: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text-secondary)' }}>
                <ChevronRight size={14} style={{ color: 'var(--accent)' }} />
                The collector streams to <code style={{ color: 'var(--text-primary)' }}>{API_URL}/api/v1/ingest/batch</code>;
                new evidence appears under AI Systems within a minute.
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
