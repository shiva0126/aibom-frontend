import { Search, Bell, Moon, Sun, Building2, ChevronDown, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header
      style={{
        height: 'var(--header-height)',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        gap: 16,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      {/* ── Search ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flex: 1,
          maxWidth: 360,
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '0 12px',
          height: 36,
          cursor: 'text',
          transition: 'border-color 0.15s ease',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
      >
        <Search size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1 }}>
          Search systems, findings, models…
        </span>
        <kbd
          style={{
            fontSize: 10,
            fontFamily: 'inherit',
            padding: '2px 5px',
            borderRadius: 4,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-strong)',
            color: 'var(--text-muted)',
            letterSpacing: '0.02em',
          }}
        >
          ⌘K
        </kbd>
      </div>

      {/* ── Right controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

        {/* Live indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            borderRadius: 20,
            background: 'var(--success-muted)',
            border: '1px solid var(--success-border)',
          }}
        >
          <span
            className="live-dot"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--success)',
              display: 'block',
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--success)' }}>Live</span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 2px' }} />

        {/* Org selector */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '5px 10px',
            borderRadius: 8,
            background: 'transparent',
            border: '1px solid transparent',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              background: 'var(--accent-muted)',
              border: '1px solid var(--accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Building2 size={10} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Acme Corp
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1 }}>Production</div>
          </div>
          <ChevronDown size={11} style={{ color: 'var(--text-muted)' }} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 2px' }} />

        {/* Theme toggle */}
        <HeaderIcon onClick={toggle} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </HeaderIcon>

        {/* Upgrade */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(91,127,255,0.15) 0%, rgba(123,111,255,0.15) 100%)',
            border: '1px solid var(--accent-border)',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--accent)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--accent-muted)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(91,127,255,0.15) 0%, rgba(123,111,255,0.15) 100%)')}
        >
          <Zap size={11} />
          Upgrade
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <HeaderIcon>
            <Bell size={14} />
          </HeaderIcon>
          <span
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--danger)',
              border: '1.5px solid var(--bg-surface)',
            }}
          />
        </div>

        {/* User avatar */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '4px 6px 4px 4px',
            borderRadius: 9,
            background: 'transparent',
            border: '1px solid transparent',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #5b7fff 0%, #7b6fff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
              color: 'white',
              flexShrink: 0,
            }}
          >
            AM
          </div>
          <ChevronDown size={11} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
    </header>
  );
}

function HeaderIcon({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: '1px solid transparent',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
        (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
      }}
    >
      {children}
    </button>
  );
}
