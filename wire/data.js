// Wire — shared data + helpers
window.WireData = (function(){

  const STATUSES = {
    success: { label: 'Done',     dot: 'success' },
    running: { label: 'Running',  dot: 'running' },
    review:  { label: 'Awaiting review', dot: 'review' },
    blocked: { label: 'Blocked',  dot: 'blocked' },
    idle:    { label: 'Idle',     dot: 'idle' }
  };

  const TEAM = [
    { id:'mr', name:'Mark Rittman',    role:'CEO',           img:'../assets/team/mark-rittman.png' },
    { id:'lb', name:'Lewis Baker',     role:'COO/CRO',       img:'../assets/team/lewis-baker.png' },
    { id:'ly', name:'Lydia Blackley',  role:'Head of Delivery', img:'../assets/team/lydia-blackley.png' },
    { id:'ac', name:'Alex Caldwell',   role:'Solutions',     img:'../assets/team/alex-caldwell.png' },
    { id:'tg', name:'Tim Griew',       role:'Senior Consultant', img:'../assets/team/tim-griew.png' },
    { id:'ss', name:'Saverro Suseno',  role:'Senior Consultant', img:'../assets/team/saverro-suseno.png' },
    { id:'od', name:'Olivier Dupuis',  role:'Senior Consultant', img:'../assets/team/olivier-dupuis.png' },
    { id:'ji', name:'Jordan Ilyat',    role:'Senior Consultant', img:'../assets/team/jordan-ilyat.png' }
  ];

  const ENGAGEMENTS = [
    { id:'carwow',   client:'Carwow',   project:'BigQuery + Looker Migration',  phase:'Discovery',   last:'2h ago',  status:'running', priority: 4 },
    { id:'booksy',   client:'Booksy',   project:'Innovation Day · Looker rebuild', phase:'Design',   last:'Yesterday', status:'review', priority: 3 },
    { id:'pleo',     client:'Pleo',     project:'Semantic layer v2',             phase:'Build',       last:'3h ago',  status:'running', priority: 4 },
    { id:'rouvy',    client:'ROUVY',    project:'Marketing attribution',         phase:'Review',      last:'1h ago',  status:'review', priority: 3 },
    { id:'florence', client:'Florence', project:'Recruitment funnel dashboard',  phase:'Build',       last:'Friday',  status:'blocked', priority: 5 }
  ];

  const ACTIVITY = [
    { time:'09:42', project:'Carwow',  event:'Hightouch inventory not delivered — Day 2',        status:'blocked', action:'Escalate' },
    { time:'09:18', project:'ROUVY',   event:'Attribution model v3 awaiting your review',         status:'review',  action:'Review' },
    { time:'08:55', project:'Booksy',  event:'LookML design draft awaiting your review',           status:'review',  action:'Review' },
    { time:'08:30', project:'Pleo',    event:'Discovery interview transcript awaiting review',     status:'review',  action:'Review' },
    { time:'08:02', project:'Carwow',  event:'Domain workshop · SMC Commercial scheduled 13:30',   status:'running', action:'Open' },
    { time:'07:48', project:'Pleo',    event:'Run pleo_semantic_layer.deploy completed',           status:'success', action:'View'  },
    { time:'07:30', project:'Florence',event:'Run florence_funnel.deploy started',                 status:'running', action:'View'  },
    { time:'Yest',  project:'ROUVY',   event:'Stakeholder approved attribution v2',                status:'success', action:'View'  }
  ];

  const DELIVERABLES = {
    requirements: [
      { name:'Stakeholder map',           type:'Document', owner:'lb', updated:'Wed', status:'success' },
      { name:'OQ register · 12 questions',type:'Sheet',    owner:'mr', updated:'Tue', status:'success' },
      { name:'Discovery brief',           type:'Document', owner:'ly', updated:'Mon', status:'success' }
    ],
    design: [
      { name:'73-folder gold-layer triage', type:'Document', owner:'lb', updated:'2h ago', status:'running' },
      { name:'Conformed dimensions',        type:'Document', owner:'mr', updated:'3h ago', status:'running' },
      { name:'Hightouch sync inventory',    type:'Sheet',    owner:'ly', updated:'Day 1', status:'blocked' },
      { name:'GYC entity-relationship doc', type:'Document', owner:'ac', updated:'—',     status:'idle' }
    ],
    build: [
      { name:'New gold layer · entity model spec', type:'Document', owner:'ac', updated:'—', status:'idle' },
      { name:'BQ migration validation framework',  type:'Spec',     owner:'tg', updated:'—', status:'idle' }
    ],
    review: [
      { name:'Plan review · Fri 29 May', type:'Meeting', owner:'mr', updated:'Pending', status:'idle' },
      { name:'Phase 2 SOW pack',         type:'Document', owner:'lb', updated:'Pending', status:'idle' }
    ]
  };

  const RELEASES = [
    { id:'r1', name:'Discovery sprint',  steps:'8 steps · Discovery',      status:'running' },
    { id:'r2', name:'Lift-and-shift v1', steps:'6 steps · Phase 1',        status:'review' },
    { id:'r3', name:'Looker on as-is',   steps:'5 steps · Phase 1',        status:'idle' },
    { id:'r4', name:'New gold layer',    steps:'14 steps · Phase 2',       status:'idle' }
  ];

  const EDITOR_STEPS = {
    INPUT: [
      { name:'SMC Commercial interview', cmd:'/wire:interview', status:'success' },
      { name:'Gold-layer triage',        cmd:'/wire:audit',     status:'success' }
    ],
    ANALYSIS: [
      { name:'Conformed dimensions',     cmd:'/wire:analyse',   status:'running' },
      { name:'GYC entity model',         cmd:'/wire:analyse',   status:'review' }
    ],
    BUILD: [
      { name:'BQ transfer plan',         cmd:'/wire:plan',      status:'idle' },
      { name:'dbt syntax converter',     cmd:'/wire:convert',   status:'idle' }
    ],
    REVIEW: [
      { name:'Plan review · 29 May',     cmd:'/wire:review',    status:'idle' }
    ]
  };

  const LIB = {
    INPUT:    [ {nm:'Interview', ic:'mic'}, {nm:'Document', ic:'file'}, {nm:'Recording', ic:'video'}, {nm:'Ticket',     ic:'check'} ],
    ANALYSIS: [ {nm:'Analyse',   ic:'spark'},{nm:'Summarise',ic:'list'}, {nm:'Compare',  ic:'split'}, {nm:'Validate',   ic:'check'} ],
    BUILD:    [ {nm:'Data model',ic:'db'},   {nm:'Dashboard',ic:'chart'},{nm:'LookML',    ic:'code'}, {nm:'dbt model',  ic:'code'} ],
    REVIEW:   [ {nm:'Approve',   ic:'check'},{nm:'Publish',   ic:'send'} ,{nm:'Notify',    ic:'bell'}, {nm:'Sign-off',   ic:'pen'}  ]
  };

  // Sort activity: blocked > review > running > success
  const order = { blocked: 0, review: 1, running: 2, success: 3, idle: 4 };
  const ACTIVITY_SORTED = [...ACTIVITY].sort((a, b) => order[a.status] - order[b.status]);

  function teamById(id){ return TEAM.find(t => t.id === id) || TEAM[0]; }

  return { STATUSES, TEAM, ENGAGEMENTS, ACTIVITY: ACTIVITY_SORTED, DELIVERABLES, RELEASES, EDITOR_STEPS, LIB, teamById };
})();
