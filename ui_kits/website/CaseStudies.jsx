// CaseStudies.jsx — three feature cards using real customer photography.
// Each photo arrives pre-composed: a real lifestyle/product image clipped to a
// brand-colored geometric shape (chevron, diamond, scallop). The card frames
// the photo cleanly, then states the metric, sector and outcome below.

function CaseCard({ image, alt, accent, client, sector, metric, metricLabel, headline, blurb }) {
  return (
    <article className="ra-case">
      <div className="ra-case-photo-wrap">
        <img className="ra-case-photo" src={image} alt={alt} />
      </div>
      <div className="ra-case-body">
        <div className="ra-case-id">
          <div className="ra-case-client">{client}</div>
          <div className="ra-case-sector">{sector}</div>
        </div>
        <div className="ra-case-metricwrap">
          <div className="ra-case-metric" style={{ color: accent }}>{metric}</div>
          <div className="ra-case-metric-label">{metricLabel}</div>
        </div>
        <h3>{headline}</h3>
        <p>{blurb}</p>
        <a href="#" className="ra-link" style={{ color: accent }}>Read the case study ›</a>
      </div>
    </article>
  );
}

export function CaseStudies() {
  return (
    <section className="ra-section ra-section-alt">
      <div className="ra-container">
        <header className="ra-section-head">
          <div className="ra-eyebrow">Selected work</div>
          <h2>Outcomes, not deliverables.</h2>
        </header>
        <div className="ra-case-grid">
          <CaseCard
            image="case-images/pleo.png"
            alt="Pleo card displayed on a phone"
            accent="#E5829A"
            client="Pleo"
            sector="Spend management · Copenhagen"
            metric="60%"
            metricLabel="time-to-insight cut"
            headline="A trusted semantic model for finance and growth"
            blurb="Modern dbt + BigQuery foundation, embedded analyst training, and a metric layer the whole team can self-serve from."
          />
          <CaseCard
            image="case-images/barkbox.png"
            alt="BarkBox subscription box with toys"
            accent="#4FC3D9"
            client="BarkBox"
            sector="Subscription pet retail · NYC"
            metric="3×"
            metricLabel="reporting velocity"
            headline="Replatformed onto Looker with dbt-led modelling"
            blurb="Marketing and product self-serve the metrics that matter — funnel, retention, MRR — without a daily ticket queue."
          />
          <CaseCard
            image="case-images/florence.png"
            alt="Healthcare workers illustrated in 3D"
            accent="#9C7BFF"
            client="Florence"
            sector="Healthcare workforce · London"
            metric="14d"
            metricLabel="kickoff to first dashboard"
            headline="Two-week sprint on Cube + dbt, then trained the team"
            blurb="Got Florence's leadership a real funnel view fast — then handed the keys over so they could iterate without us in the loop."
          />
        </div>
      </div>
    </section>
  );
}

window.CaseStudies = CaseStudies;
