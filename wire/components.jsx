// Wire — shared components
const { useState, useEffect, useRef } = React;
const D = window.WireData;

// Lucide-style icons inline
function Icon({ name, size = 16 }) {
  const paths = {
    home:     'M3 12l9-9 9 9M5 10v10h14V10',
    bolt:     'M13 2L3 14h9l-1 8 10-12h-9z',
    folder:   'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    map:      'M9 6l-6 2v14l6-2 6 2 6-2V6l-6 2zM9 6v14M15 8v14',
    review:   'M3 7h18M3 12h18M3 17h12',
    settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
    plus:     'M12 5v14M5 12h14',
    play:     'M5 3l14 9-14 9V3z',
    chev:     'M9 18l6-6-6-6',
    mic:      'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8',
    file:     'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
    video:    'M23 7l-7 5 7 5V7zM1 5h15v14H1z',
    check:    'M20 6L9 17l-5-5',
    spark:    'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1',
    list:     'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    split:    'M3 3l18 18M21 3v6h-6M3 21v-6h6',
    db:       'M12 4c-4.97 0-9 1.79-9 4v8c0 2.21 4.03 4 9 4s9-1.79 9-4V8c0-2.21-4.03-4-9-4zM3 8c0 2.21 4.03 4 9 4s9-1.79 9-4M3 12c0 2.21 4.03 4 9 4s9-1.79 9-4',
    chart:    'M3 3v18h18M7 14l4-4 4 4 5-5',
    code:     'M16 18l6-6-6-6M8 6l-6 6 6 6',
    send:     'M22 2L11 13M22 2l-7 20-4-9-9-4z',
    bell:     'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
    pen:      'M12 19l7-7 3 3-7 7H12v-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z',
    chat:     'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z',
    x:        'M18 6L6 18M6 6l12 12'
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}

function Avatar({ id, size = 24 }) {
  const t = D.teamById(id);
  const cls = size === 32 ? 'avatar avatar-lg' : size === 20 ? 'avatar avatar-sm' : 'avatar';
  return <span className={cls}><img src={t.img} alt={t.name} /></span>;
}

function Pill({ status }) {
  const label = D.STATUSES[status]?.label || status;
  return <span className={`pill ${status}`}><span className={`dot ${status}`}></span>{label}</span>;
}

function Sidebar({ route, onNav }) {
  const items = [
    { key: 'home',     label: 'Home',         icon: 'home',   count: '3' },
    { key: 'project',  label: 'Carwow',       icon: 'folder' },
    { key: 'map',      label: 'Engagement map', icon: 'map' },
    { key: 'review',   label: 'Reviews',      icon: 'review', count: '3' },
    { key: 'editor',   label: 'Release flow', icon: 'bolt' }
  ];
  const second = [
    { key: 'wizard',   label: 'New project',  icon: 'plus' },
    { key: 'portal',   label: 'Portal preview', icon: 'send' }
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="../assets/logo-black-blue.svg" alt="Rittman Analytics" />
      </div>
      <div className="sidebar-section">
        <div className="sidebar-section-label">Workspace</div>
        {items.map(it => (
          <div key={it.key} className={'nav-item' + (route === it.key ? ' active' : '')} onClick={() => onNav(it.key)}>
            <Icon name={it.icon} />
            <span>{it.label}</span>
            {it.count && <span className="count">{it.count}</span>}
          </div>
        ))}
      </div>
      <div className="sidebar-section">
        <div className="sidebar-section-label">Tools</div>
        {second.map(it => (
          <div key={it.key} className={'nav-item' + (route === it.key ? ' active' : '')} onClick={() => onNav(it.key)}>
            <Icon name={it.icon} />
            <span>{it.label}</span>
          </div>
        ))}
      </div>
      <div className="sidebar-foot">
        <Avatar id="mr" size={32} />
        <div className="who">Mark Rittman<small>Rittman Analytics</small></div>
      </div>
    </aside>
  );
}

function TopBar({ crumb, action, onCmd }) {
  return (
    <div className="topbar">
      <div className="crumb">
        {crumb.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="chev">›</span>}
            <span className={i === crumb.length - 1 ? 'here' : ''}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="cmd-trigger" onClick={onCmd}>
        <Icon name="spark" size={14} />
        <span>Search or run a step…</span>
        <span className="kbd">⌘K</span>
      </div>
      <div className="topbar-action">{action}</div>
    </div>
  );
}

function CommandPalette({ onClose, onJump }) {
  const [q, setQ] = useState('');
  const items = [
    { group:'Jump to', nm:'Carwow',     dc:'project',  to:'project' },
    { group:'Jump to', nm:'Home',       dc:'route',    to:'home' },
    { group:'Jump to', nm:'New project',dc:'wizard',   to:'wizard' },
    { group:'Jump to', nm:'Engagement map',dc:'map',   to:'map' },
    { group:'Action',  nm:'Add release',            dc:'⌘R' },
    { group:'Action',  nm:'Run autopilot · Carwow', dc:'⌘↵' },
    { group:'Action',  nm:'Open assistant',         dc:'⌘.' }
  ];
  const filtered = q ? items.filter(i => i.nm.toLowerCase().includes(q.toLowerCase())) : items;
  const groups = [...new Set(filtered.map(i => i.group))];
  return (
    <>
      <div className="cmdk-scrim" onClick={onClose} />
      <div className="cmdk">
        <input autoFocus value={q} onChange={e => setQ(e.target.value)}
               placeholder="Type a command, or search…"
               onKeyDown={e => e.key === 'Escape' && onClose()} />
        <div className="results">
          {groups.map(g => (
            <div key={g}>
              <div className="cmdk-group">{g}</div>
              {filtered.filter(i => i.group === g).map((i, idx) => (
                <div key={idx} className="cmdk-item" onClick={() => { if (i.to) onJump(i.to); onClose(); }}>
                  <span className="nm">{i.nm}</span>
                  <span className="dc">{i.dc}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AssistantOverlay({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="assistant-panel">
      <div className="assistant-head">
        <span className="title">Wire assistant</span>
        <button className="assistant-close" onClick={onClose}><Icon name="x" /></button>
      </div>
      <div className="assistant-ctx">
        <span>Context:</span>
        <span className="src-chip">Carwow · Discovery brief</span>
        <span className="src-chip">Fathom · Workshop notes</span>
      </div>
      <div className="assistant-thread">
        <div className="assistant-msg user">What's blocking the Hightouch inventory work?</div>
        <div className="assistant-msg bot">
          <div className="who">Wire</div>
          Jairo Reyes (Hightouch owner) hasn't delivered the 544-sync inventory yet — it was a Day 1 ask. Lewis flagged this needs escalation to Becky by Wednesday AM if not received.
        </div>
        <div className="assistant-msg user">Draft an escalation message I can send to Becky.</div>
        <div className="assistant-msg bot">
          <div className="who">Wire · draft</div>
          "Becky — quick flag. We were expecting the Hightouch sync inventory from Jairo on Monday so we could classify the 544 syncs in parallel with the workshops. Without it OQ-12 stays open and we delay Phase 1 sequencing decisions. Can we get either the inventory by EOD tomorrow, or a sync between Jairo and Lewis to walk through it together?"
        </div>
      </div>
      <div className="assistant-input">
        <textarea placeholder="Ask Wire about this project…" />
      </div>
    </div>
  );
}

function AssistantFAB({ onClick }) {
  return (
    <button className="assistant-fab" onClick={onClick} aria-label="Open assistant">
      <Icon name="chat" size={20} />
    </button>
  );
}

Object.assign(window, { Icon, Avatar, Pill, Sidebar, TopBar, CommandPalette, AssistantOverlay, AssistantFAB });
