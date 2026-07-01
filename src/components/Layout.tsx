import { Outlet } from 'react-router-dom';
import Header from './Header';

/**
 * Shared page shell — global header on top, routed page content in the middle,
 * one shared footer at the bottom (so it isn't duplicated per page as more
 * showcases are added). The `.showcase` container centers + width-caps content.
 */
export default function Layout() {
  return (
    <>
      <Header />
      <div className="showcase">
        <Outlet />
        <footer className="footer">
          <span>An isolated feature showcase, extracted from a larger project.</span>
          <a href="https://github.com/jonathanlu419-a11y/finance-portfolio-manager"
            target="_blank" rel="noreferrer">
            finance-portfolio-manager →
          </a>
        </footer>
      </div>
    </>
  );
}
