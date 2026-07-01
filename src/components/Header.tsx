import { NavLink } from 'react-router-dom';

/**
 * Global site header — sticky, translucent dark bar in the spirit of Apple's
 * global nav: wordmark left, understated tracked nav links right, subtle bottom
 * border, no shadow. Uses the existing theme vars (not Apple's colors).
 */
const NAV: { to: string; label: string }[] = [
  { to: '/quick-add', label: 'Quick Add' },
  { to: '/csv-import', label: 'CSV Import' },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <NavLink to="/quick-add" className="site-wordmark" aria-label="DoubleEntry — home">
          <span className="site-wordmark-glyph" aria-hidden="true" />
          <span className="site-wordmark-text">DoubleEntry</span>
        </NavLink>

        <nav className="site-nav" aria-label="Primary">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
