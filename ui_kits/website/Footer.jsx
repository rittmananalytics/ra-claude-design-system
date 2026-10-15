// FinalCTA.jsx + Footer.jsx
function FinalCTA() {
  return (
    <section className="ra-finalcta">
      <div className="ra-container ra-finalcta-inner">
        <h2>Ready to confront the hard truths?</h2>
        <p>Book a 30-minute discovery call. We'll listen, ask the awkward questions, and tell you what we'd do.</p>
        <a href="#" className="ra-btn ra-btn-primary ra-btn-lg">Schedule a Discovery Call</a>
      </div>
    </section>
  );
}

export function Footer() {
  const groups = [
    { h: "Services",     items: ["Data Platform Development", "Data Team Enablement", "Embedded Analytics", "Expert Services"] },
    { h: "Solutions",    items: ["E-commerce & Retail", "FinTech", "EdTech", "Generative AI"] },
    { h: "Partners",     items: ["dbt Labs", "Looker", "Cube", "Fivetran", "Embeddable", "Dagster"] },
    { h: "Resources",    items: ["Blog", "Drill to Detail Podcast", "Case Studies", "Contact"] },
  ];
  return (
    <footer className="ra-footer">
      <div className="ra-container ra-footer-grid">
        <div className="ra-footer-brand">
          <img src="../../assets/logo-black-blue.svg" alt="Rittman Analytics" />
          <p>A boutique data analytics consultancy. Helping ambitious businesses scale and modernise their analytics capabilities since 2015.</p>
        </div>
        {groups.map(g => (
          <div key={g.h} className="ra-footer-col">
            <h4>{g.h}</h4>
            <ul>{g.items.map(i => <li key={i}><a href="#">{i}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="ra-footer-base">
        <span>© 2026 Rittman Analytics Ltd</span>
        <span>Registered in England</span>
        <span>contact@rittmananalytics.com</span>
      </div>
    </footer>
  );
}

window.FinalCTA = FinalCTA;
window.Footer = Footer;
