// Hero.jsx — centered headline, lede, CTA, partner logos strip
export function Hero() {
  const partners = ["ROUVY", "Rixo", "Pleo", "Conversion", "Osprey", "Florence"];
  return (
    <section className="ra-hero">
      <div className="ra-container">
        <h1 className="ra-display">
          Your Company Scaled.<br />
          Your Data Platform Didn't.
        </h1>
        <p className="ra-lede">
          You've built a successful business, but your data infrastructure is showing the strain.
          Your talented data team is bogged down in technical debt and firefighting, not innovation.
        </p>
        <p className="ra-supporting">
          We are your long-term strategic partner in data transformation. We go beyond implementation
          to provide the architecture, processes and hands-on enablement that turns your data
          function into a strategic asset.
        </p>
        <a href="#" className="ra-btn ra-btn-primary ra-btn-lg">Schedule a Discovery Call</a>
        <div className="ra-partners">
          <div className="ra-partners-label">Trusted by ambitious data teams at:</div>
          <div className="ra-partners-row">
            {partners.map(p => (
              <div key={p} className="ra-partner-logo">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
