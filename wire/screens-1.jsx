// Wire — screens (set A): Home, Project, Map
const D2 = window.WireData;
const React2 = window.React;
const { useState: useStateA } = React2;

// ===== HOME =====
function HomeScreen({ onJump }) {
  return (
    <div className="content">
      <h1 className="page-title">Today</h1>
      <p className="page-sub">Tuesday 26 May 2026 · five live engagements · three need your attention.</p>

      <div className="counters">
        <div className="counter"><div className="n">5</div><div className="l">Engagements active</div></div>
        <div className="counter"><div className="n">3</div><div className="l">Awaiting your review</div></div>
        <div className="counter"><div className="n">1</div><div className="l">Blocked</div></div>
        <div className="counter"><div className="n">12 <span className="alt">/ 38</span></div><div className="l">Steps running</div></div>
      </div>

      <div className="caps">Activity · ordered by urgency</div>
      <table className="tbl">
        <thead><tr>
          <th style={{width:60}}>Time</th>
          <th style={{width:110}}>Project</th>
          <th>Event</th>
          <th style={{width:160}}>Status</th>
          <th style={{width:80}}></th>
        </tr></thead>
        <tbody>
          {D2.ACTIVITY.map((a, i) => (
            <tr key={i} className="row-hover">
              <td className="tab muted">{a.time}</td>
              <td><strong>{a.project}</strong></td>
              <td>{a.event}</td>
              <td><Pill status={a.status} /></td>
              <td><button className="chip row-action">{a.action}</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="caps">Engagements</div>
      <table className="tbl">
        <thead><tr>
          <th>Client</th><th>Project</th><th style={{width:120}}>Phase</th>
          <th style={{width:120}}>Last activity</th><th style={{width:160}}>Status</th>
        </tr></thead>
        <tbody>
          {D2.ENGAGEMENTS.map(e => (
            <tr key={e.id} className="row-hover" onClick={() => onJump('project')}>
              <td className="name">{e.client}</td>
              <td>{e.project}</td>
              <td className="muted">{e.phase}</td>
              <td className="muted">{e.last}</td>
              <td><Pill status={e.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===== PROJECT VIEW =====
function ProjectScreen({ onJump }) {
  const [openPhase, setOpenPhase] = useStateA('design');
  const phases = [
    { key: 'requirements', label: 'Requirements', items: D2.DELIVERABLES.requirements },
    { key: 'design',       label: 'Design',       items: D2.DELIVERABLES.design },
    { key: 'build',        label: 'Build',        items: D2.DELIVERABLES.build },
    { key: 'review',       label: 'Review',       items: D2.DELIVERABLES.review }
  ];
  return (
    <div className="content" style={{padding:'0 32px 64px'}}>
      <div className="proj-head">
        <div className="row">
          <div>
            <div className="caps" style={{margin:0}}>Engagements › Carwow</div>
            <h1>Carwow · BigQuery + Looker migration</h1>
            <div className="meta">
              <Pill status="running" />
              <span>· Last run 2h ago</span>
              <span>·</span>
              <div className="avatar-stack">
                <Avatar id="mr" size={20} /><Avatar id="lb" size={20} /><Avatar id="ly" size={20} /><Avatar id="ac" size={20} />
              </div>
            </div>
          </div>
          <div className="actions">
            <button className="btn btn-ghost">Run autopilot</button>
            <button className="btn btn-primary">Continue session →</button>
          </div>
        </div>
      </div>

      <div className="metrics-row">
        <div className="metric"><div className="n">3 <span className="alt">/ 4</span></div><div className="l">Phase progress</div></div>
        <div className="metric"><div className="n">5 <span className="alt">/ 12</span></div><div className="l">Deliverables</div></div>
        <div className="metric"><div className="n">3</div><div className="l">Open reviews</div></div>
        <div className="metric"><div className="n">2d ago</div><div className="l">Last activity</div></div>
      </div>

      <div className="next-up">
        <div className="label">
          <span className="indi"></span>
          <strong>Next up</strong>
          <span className="what">Close Hightouch inventory blocker · Lewis to escalate to Becky</span>
        </div>
        <button className="btn btn-primary btn-sm">Continue →</button>
      </div>

      {phases.map(p => (
        <div key={p.key} style={{marginTop: 20}}>
          <div className="caps" style={{margin:0, padding:'12px 0', borderBottom:'1px solid var(--ra-line)', display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}
               onClick={() => setOpenPhase(openPhase === p.key ? null : p.key)}>
            <Icon name="chev" size={12} />
            <span>{p.label}</span>
            <span style={{marginLeft:'auto', color:'var(--ra-mute)', fontWeight:400, textTransform:'none', letterSpacing:0}}>
              {p.items.length} deliverables
            </span>
          </div>
          {openPhase === p.key && (
            <table className="tbl">
              <tbody>
                {p.items.map((d, i) => (
                  <tr key={i} className="row-hover" onClick={() => onJump && onJump('review')}>
                    <td style={{width:24}}><span className={`dot ${d.status}`}></span></td>
                    <td className="name">{d.name}</td>
                    <td className="muted" style={{width:120}}>{d.type}</td>
                    <td style={{width:60}}><Avatar id={d.owner} size={20} /></td>
                    <td className="muted tab" style={{width:100}}>{d.updated}</td>
                    <td style={{width:80}}><button className="chip row-action">Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}

// ===== MAP =====
function MapScreen() {
  return (
    <div className="content" style={{padding:'0 32px 64px'}}>
      <div className="proj-head">
        <div className="row">
          <div>
            <div className="caps" style={{margin:0}}>Engagements › Carwow</div>
            <h1>Engagement map</h1>
            <div className="meta"><Pill status="running" /><span>· 4 releases · 33 steps total</span></div>
          </div>
          <div className="actions">
            <div className="chip">List</div>
            <div className="chip" style={{background:'var(--ra-ink)', color:'#fff'}}>Map</div>
          </div>
        </div>
      </div>

      <div className="dag-canvas" style={{marginTop:24}}>
        <div className="dag-row">
          {D2.RELEASES.map((r, i) => (
            <React.Fragment key={r.id}>
              <div className={`dag-node ${r.status}`}>
                <div className="title">{r.name} <span className="chev">›</span></div>
                <div className="sub">{r.steps}</div>
              </div>
              {i < D2.RELEASES.length - 1 && <div className="dag-edge"></div>}
            </React.Fragment>
          ))}
        </div>
        <div className="dag-foot">
          <span>4 releases</span><span>· 33 steps</span><span>· 5 completed</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, ProjectScreen, MapScreen });
