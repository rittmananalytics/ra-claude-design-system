// ChallengeCards.jsx — the 2x2 "What's your main data challenge?" grid
const { useState: useStateChallenge } = React;

function ChallengeCard({ tile, active, onClick }) {
  return (
    <div
      className={"ra-challenge " + (active ? "is-active" : "")}
      onClick={onClick}
    >
      <div className="ra-challenge-img">
        <img src={tile.img} alt={tile.title} />
      </div>
      <div className="ra-challenge-body">
        <h3>{tile.title}</h3>
        <p>{tile.desc}</p>
        <a href="#" className="ra-link" onClick={e => e.stopPropagation()}>Read More ›</a>
      </div>
    </div>
  );
}

export function ChallengeCards() {
  const [selected, setSelected] = useStateChallenge("build");
  const tiles = [
    { id: "build",     title: "Building our Data Analytics Platform",   desc: "We're growing fast and need to build a scalable data foundation and enable our data team.",                                          img: "images/challenge-build.png" },
    { id: "modernise", title: "Modernising our Data Team and Platform", desc: "We have a data team but we need to modernise our technology, skills and ways of working.",                                          img: "images/challenge-modernise.png" },
    { id: "embed",     title: "Embedding Analytics in our Product",     desc: "We're a SaaS vendor and want to build powerful, customer-facing analytics built on a rich semantic model into our application.", img: "images/challenge-embed.png" },
    { id: "solve",     title: "BI, DW & AI Expert Services",            desc: "We're looking for help with Looker, dbt, Cube, BigQuery, event tracking or other modern data stack tools.",                       img: "images/challenge-solve.png" },
  ];
  return (
    <section className="ra-section ra-section-alt">
      <div className="ra-container">
        <header className="ra-section-head">
          <h2>What's your Main Data Challenge?</h2>
          <p className="ra-lede">
            Every organisation's data journey is unique. Select the scenario that best describes
            your current needs to see how we can help.
          </p>
        </header>
        <div className="ra-challenge-grid">
          {tiles.map(t => (
            <ChallengeCard
              key={t.id}
              tile={t}
              active={selected === t.id}
              onClick={() => setSelected(t.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

window.ChallengeCards = ChallengeCards;
