// Wire — screens (set B): Review, Portal, Wizard, Editor
const D3 = window.WireData;
const { useState: useStateB } = window.React;

// ===== REVIEW =====
function ReviewScreen() {
  return (
    <>
      <div className="topbar">
        <div className="crumb">
          <span>Carwow</span><span className="chev">›</span>
          <span>Deliverables</span><span className="chev">›</span>
          <span className="here">Conformed dimensions <em style={{color:'var(--ra-mute)',fontStyle:'normal',marginLeft:6}}>v2 ⌄</em></span>
        </div>
        <div style={{flex:1}}></div>
        <Pill status="review" />
        <button className="btn btn-ghost btn-sm">Request changes</button>
        <button className="btn btn-primary btn-sm">Approve</button>
      </div>
      <div className="review-layout">
        <div className="review-doc">
          <div className="doc-meta">v2 · Updated by Mark Rittman · 26 May, 09:14</div>
          <h1>Conformed dimensions</h1>
          <p>Discovery sprint deliverable defining the canonical, cross-domain dimensions that every gold-layer fact will join to in the rebuilt warehouse.</p>

          <h2>1 · Dimensions in scope</h2>
          <p>Six conformed dimensions, agreed in the SMC and GYC workshops on 19 May. Each dimension has one canonical definition; domain-specific extensions are permitted but live in domain schemas, not the conformed layer.</p>
          <p><span className="comment-dot"></span><span className="commented">User · email and HubSpot ID; deduplicated via a Looker block on the application user table.</span></p>
          <p>Vehicle · standardised on the manufacturer SKU and trim string. Stub records permitted for pre-config enquiries.</p>
          <p>Dealer · dealer ID plus the parent group rollup. Date · UTC, calendar + fiscal. Country · ISO-3166. Channel · the 7-tag taxonomy Roman's team agreed.</p>

          <h2>2 · Resolution rules</h2>
          <p>Where the same logical entity appears under different surrogate keys across source systems, resolution rules live in the conformed layer — not in fact tables. Documented per dimension in the appendix.</p>

          <h2>3 · Open items</h2>
          <p><span className="comment-dot"></span><span className="commented">GYC join key — see the GYC entity-relationship document. Not solvable in Phase 1; Phase 2 design problem.</span></p>
        </div>

        <div className="review-conv">
          <div className="conv-label">Conversation · 4 comments</div>
          <div className="thread">
            <div className="comment">
              <Avatar id="lb" size={24} />
              <div className="body">
                <div className="head"><span className="name">Lewis Baker</span><span className="time">3h ago</span></div>
                <div className="text">For the User dimension — should we capture the cross-domain identity resolution rules here, or defer to the conformed layer doc?</div>
              </div>
            </div>
            <div className="comment indented">
              <Avatar id="mr" size={24} />
              <div className="body">
                <div className="head"><span className="name">Mark Rittman</span><span className="time">2h ago</span></div>
                <div className="quoted">"cross-domain identity resolution rules"</div>
                <div className="text">Defer. This doc is the surface; the resolution rules live in the conformed schema definition with the surrogate-key mapping. Will add a forward link.</div>
              </div>
            </div>
            <div className="comment">
              <Avatar id="ac" size={24} />
              <div className="body">
                <div className="head"><span className="name">Alex Caldwell</span><span className="time">1h ago</span></div>
                <div className="text">GYC item flagged — agreed Phase 2. Linking the entity-relationship doc once Olivier's draft is in.</div>
              </div>
            </div>
            <div className="comment">
              <Avatar id="ly" size={24} />
              <div className="body">
                <div className="head"><span className="name">Lydia Blackley</span><span className="time">38m ago</span></div>
                <div className="text">Ready for Becky's review once these two threads close.</div>
              </div>
            </div>
          </div>
          <div className="conv-input">Comment <span style={{color:'var(--ra-mute)'}}>· ⌘↵</span></div>
        </div>
      </div>
    </>
  );
}

// ===== PORTAL =====
function PortalScreen() {
  return (
    <div className="portal" style={{background:'var(--ra-paper)', minHeight:'100vh'}}>
      <div className="portal-head">
        <img src="../assets/logo-black-blue.svg" alt="Rittman Analytics" />
        <div className="who">Prepared for Becky Allsop, Carwow<br/>26 May 2026 · v2</div>
      </div>
      <div className="portal-doc">
        <h1>Discovery sprint review · Carwow</h1>
        <div className="doc-meta">A walk-through of what the team designed in week one, the open questions still to close, and the recommended path into Phase 2.</div>

        <h2>What we designed</h2>
        <p>The new gold layer is structured around seventeen business domains, with six conformed dimensions binding them together. Each domain owns its own facts; conformed dimensions are owned centrally so the same Looker model can answer questions across SMC, GYC and OEM without dimension drift.</p>

        <h2>Where we landed</h2>
        <p>Five domains have been audited in depth this sprint: SMC Commercial, SMC Operations, GYC, Marketing and OEM. The remaining twelve will be audited in priority order in the first six weeks of Phase 2.</p>
        <p>The single hardest design problem — GetYourCar's configuration-to-enquiry join — has been articulated, investigated, and documented as a Phase 2 model proposal. We do not believe it is solvable inside the existing source data, and we have laid out the source-system change that would resolve it.</p>

        <h2>Recommended next step</h2>
        <p>Sign the Phase 2 SOW on Friday 29 May and start the build engagement Monday 1 June. The Tableau switch-off in August is the binding constraint; everything in this plan is scheduled backwards from that date.</p>
      </div>
      <div className="portal-foot">Prepared by Rittman Analytics · Questions to mark.rittman@rittmananalytics.com</div>
      <div className="portal-bar">
        <input placeholder="Your name" />
        <button className="btn btn-ghost btn-sm">Add comment</button>
        <button className="btn btn-primary btn-sm">Approve</button>
      </div>
    </div>
  );
}

// ===== WIZARD =====
function WizardScreen({ onJump }) {
  const [type, setType] = useStateB('Full platform');
  const types = [
    { name: 'Discovery',     dc: '2–4 week scoping engagement' },
    { name: 'Full platform', dc: 'Build the modern data stack end-to-end' },
    { name: 'Dashboards',    dc: 'Looker / Power BI build only' },
    { name: 'Data model',    dc: 'dbt / semantic-layer engagement' },
    { name: 'SoP discovery', dc: 'Standard ops process audit' },
    { name: 'Custom',        dc: 'Define the scope manually' }
  ];
  return (
    <div className="wizard">
      <h1>New project</h1>
      <p className="sub">Wire creates the engagement, configures sources, and seeds the first release.</p>

      <div className="field">
        <label>Client</label>
        <input type="text" placeholder="Search HubSpot…" defaultValue="Carwow" />
      </div>
      <div className="field">
        <label>Project name</label>
        <input type="text" defaultValue="Carwow · BigQuery + Looker migration" />
        <div className="hint">Auto-suggested from the client name and project type. Press Tab to accept.</div>
      </div>
      <div className="field">
        <label>Project type</label>
        <div className="opt-list">
          {types.map(t => (
            <div key={t.name} className={'opt-row' + (type === t.name ? ' selected' : '')} onClick={() => setType(t.name)}>
              <div><div className="nm">{t.name}</div><div className="dc">{t.dc}</div></div>
              <div className="radio"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="field">
        <label>Sources</label>
        <div className="collapse-row"><span className="nm">+ Add source</span><span className="dc" style={{color:'var(--ra-mute)'}}>Fathom · Drive · Jira · BigQuery · Looker</span></div>
      </div>
      <div className="field">
        <label>Team</label>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <Avatar id="mr" size={24} /><Avatar id="lb" size={24} /><Avatar id="ly" size={24} /><Avatar id="ac" size={24} />
          <span className="chip" style={{marginLeft:8}}>+ Add</span>
        </div>
      </div>

      <div className="wizard-foot">
        <button className="btn btn-text" onClick={() => onJump('home')}>Cancel</button>
        <button className="btn btn-primary" onClick={() => onJump('project')}>Create project →</button>
      </div>
    </div>
  );
}

// ===== EDITOR =====
function EditorScreen() {
  const [selected, setSelected] = useStateB('Conformed dimensions');
  const phases = Object.entries(D3.EDITOR_STEPS);
  return (
    <>
      <div className="topbar">
        <div className="crumb">
          <span>Carwow</span><span className="chev">›</span>
          <span>Releases</span><span className="chev">›</span>
          <span className="here">Discovery sprint</span>
        </div>
        <div style={{flex:1}}></div>
        <div className="chip">Flow</div>
        <div className="chip" style={{background:'var(--ra-paper-3)', color:'var(--ra-mute-strong)'}}>List</div>
        <button className="btn btn-primary btn-sm">Run release</button>
      </div>
      <div className="editor">
        <div className="editor-lib">
          <input placeholder="Search steps…" />
          {Object.entries(D3.LIB).map(([section, items]) => (
            <div key={section}>
              <div className="lib-section">{section}</div>
              {items.map(it => (
                <div key={it.nm} className="lib-item">
                  <Icon name={it.ic} size={14} />{it.nm}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="editor-canvas">
          {phases.map(([phase, steps]) => (
            <div key={phase} className="editor-phase">
              <div className="caps-label">{phase}</div>
              <div className="step-row">
                {steps.map((s, i) => (
                  <React.Fragment key={i}>
                    <div className={`step ${s.status}` + (s.name === selected ? ' selected' : '')}
                         onClick={() => setSelected(s.name)}>
                      {s.status === 'running' && <span className="pill running pill-above">Running</span>}
                      {s.status === 'review' && <span className="pill review pill-above">Review</span>}
                      <div className="nm">{s.name}</div>
                      <div className="cmd">{s.cmd}</div>
                    </div>
                    {i < steps.length - 1 && <div className="step-conn"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="editor-inspector">
          <h3>{selected}</h3>
          <div className="cmd">/wire:analyse</div>
          <div className="inspector-section">
            <h4>Inputs</h4>
            <div className="v">SMC Commercial transcript · Domain audit notes (Day 1)</div>
          </div>
          <div className="inspector-section">
            <h4>Last run</h4>
            <div className="v">26 May, 09:18 · <span className="mono">2m 14s</span></div>
          </div>
          <div className="inspector-section">
            <h4>Downstream</h4>
            <div className="v">GYC entity model · BQ transfer plan</div>
          </div>
          <div className="inspector-section">
            <h4>Logs</h4>
            <a>Open in panel ↓</a>
          </div>
        </div>
      </div>
      <div className="editor-statusbar">
        <span>6 steps</span><span>2 done</span><span>1 review</span><span>3 idle</span>
        <span style={{marginLeft:'auto'}}>Last run 09:18</span>
      </div>
    </>
  );
}

Object.assign(window, { ReviewScreen, PortalScreen, WizardScreen, EditorScreen });
