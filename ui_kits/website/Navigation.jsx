// Navigation.jsx — sticky top nav with logo, menu, CTA
const { useState } = React;

function NavLink({ children, hasMenu }) {
  return (
    <a href="#" className="nav-link">
      {children}
      {hasMenu && <span className="nav-caret">▾</span>}
    </a>
  );
}

export function Navigation() {
  return (
    <nav className="ra-nav">
      <div className="ra-nav-inner">
        <a href="#" className="ra-nav-logo">
          <img src="../../assets/logo-black-blue.svg" alt="Rittman Analytics" />
        </a>
        <div className="ra-nav-menu">
          <NavLink hasMenu>Services</NavLink>
          <NavLink hasMenu>Solutions</NavLink>
          <NavLink hasMenu>Partners</NavLink>
          <NavLink>Case Studies</NavLink>
          <NavLink hasMenu>Resources</NavLink>
          <NavLink>About</NavLink>
        </div>
        <div className="ra-nav-actions">
          <a href="#" className="ra-btn ra-btn-ghost">Sign in</a>
          <a href="#" className="ra-btn ra-btn-primary">Schedule a call</a>
        </div>
      </div>
    </nav>
  );
}

window.Navigation = Navigation;
