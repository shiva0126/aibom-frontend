import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import {
  LayoutDashboard, Server, FileText, GitBranch, Bot,
  Network, AlertTriangle, Route, Plug, BarChart2,
  Settings, ChevronDown, Scale, Webhook, Crosshair,
  type LucideIcon,
} from 'lucide-react';

const groups: { label?: string; items: { to: string; icon: LucideIcon; label: string }[] }[] = [
  {
    items: [
      { to: '/',  icon: LayoutDashboard, label: 'Overview' },
    ],
  },
  {
    label: 'Security',
    items: [
      { to: '/ai-systems',   icon: Server,        label: 'AI Systems'   },
      { to: '/aibom',        icon: FileText,      label: 'AI-BOM'       },
      { to: '/supply-chain', icon: GitBranch,     label: 'Supply Chain' },
      { to: '/findings',     icon: AlertTriangle, label: 'Findings'     },
      { to: '/attack-paths', icon: Route,         label: 'Attack Paths' },
      { to: '/atlas',        icon: Crosshair,     label: 'MITRE ATLAS'  },
      { to: '/compliance',   icon: Scale,         label: 'Compliance'   },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/agents', icon: Bot,     label: 'Agents & MCP' },
      { to: '/rag',    icon: Network, label: 'RAG Lineage'  },
    ],
  },
  {
    label: 'Platform',
    items: [
      { to: '/integrations', icon: Plug,      label: 'Integrations' },
      { to: '/webhooks',     icon: Webhook,   label: 'Webhooks'     },
      { to: '/reports',      icon: BarChart2, label: 'Reports'      },
    ],
  },
];

function NavItem({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <NavLink
      to={to}
      end={to === '/'}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        margin: '1px 8px',
        padding: '7px 10px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: isActive ? 600 : 400,
        color: isActive ? 'var(--accent)' : hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: isActive ? 'var(--accent-muted)' : hovered ? 'var(--bg-hover)' : 'transparent',
        boxShadow: isActive ? 'inset 2px 0 0 var(--accent)' : 'inset 2px 0 0 transparent',
        textDecoration: 'none',
        transition: 'all 0.12s ease',
        lineHeight: 1,
      })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={14}
            style={{
              color: isActive ? 'var(--accent)' : hovered ? 'var(--text-secondary)' : 'var(--text-muted)',
              flexShrink: 0,
              transition: 'color 0.12s ease',
            }}
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* ── Brand ── */}
      <div
        style={{
          padding: '18px 16px 16px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <Logo size={32} />
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  padding: '14px 18px 5px',
                }}
              >
                {group.label}
              </div>
            )}
            {group.items.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        ))}

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', margin: '10px 16px 4px' }} />

        {/* Settings */}
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </nav>

      {/* ── User Profile ── */}
      <UserProfile />
    </aside>
  );
}

function UserProfile() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        borderTop: '1px solid var(--border)',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        cursor: 'pointer',
        background: hovered ? 'var(--bg-hover)' : 'transparent',
        transition: 'background 0.12s ease',
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #5b7fff 0%, #7b6fff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          color: 'white',
          flexShrink: 0,
        }}
      >
        AM
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          Alex Morgan
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>Security Team</div>
      </div>
      <ChevronDown size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    </div>
  );
}
