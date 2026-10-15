// Methodology.jsx — three indigo medallions with steps
function MedSearch() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.6" y2="16.6"></line>
    </svg>
  );
}
function MedBook() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5z"></path>
      <path d="M4 4.5v15A2.5 2.5 0 0 1 6.5 22H20"></path>
    </svg>
  );
}
function MedUsers() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

function MethodStep({ Icon, n, title, body }) {
  return (
    <div className="ra-method-step">
      <div className="ra-method-medallion"><Icon /></div>
      <div className="ra-eyebrow">Step 0{n}</div>
      <h3>{n}. {title}</h3>
      <p>{body}</p>
    </div>
  );
}

export function Methodology() {
  return (
    <section className="ra-section">
      <div className="ra-container">
        <header className="ra-section-head">
          <h2>It's Never Just a Technical Problem.</h2>
          <p className="ra-lede">
            Traditional data consulting fails when it ignores the human element. Our proven
            three-step methodology ensures lasting success by addressing your technology,
            processes and people in tandem.
          </p>
        </header>
        <div className="ra-method-grid">
          <MethodStep Icon={MedSearch} n="1" title="Confront the Hard Truths" body="We start with a diagnostic deep dive to uncover the foundational, often uncomfortable, truths that are the real source of friction and inefficiency." />
          <MethodStep Icon={MedBook}   n="2" title="Create the Change"        body="We architect and build a scalable, sustainable data foundation — from a modern data warehouse to a unified development workflow — that directly solves the core issues." />
          <MethodStep Icon={MedUsers}  n="3" title="Manage the Change"        body="We embed with your team to foster new behaviours, overhaul rituals and cultivate a culture of ownership that ensures the transformation is permanent." />
        </div>
        <div className="ra-section-cta">
          <a href="#" className="ra-btn ra-btn-secondary">Learn More About Our Approach</a>
        </div>
      </div>
    </section>
  );
}

window.Methodology = Methodology;
