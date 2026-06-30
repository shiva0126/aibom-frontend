import type { ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  padding?: boolean;
  hover?: boolean;
}

export default function Card({ children, className = '', style, padding = true, hover = false }: Props) {
  return (
    <div
      className={className}
      style={{
        borderRadius: 12,
        padding: padding ? '16px' : undefined,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        transition: hover ? 'border-color 0.15s ease, box-shadow 0.15s ease' : undefined,
        ...style,
      }}
      onMouseEnter={hover ? (e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      } : undefined}
    >
      {children}
    </div>
  );
}
