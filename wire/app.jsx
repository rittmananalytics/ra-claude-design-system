// Wire — App shell + routing
const { useState: useStateApp, useEffect: useEffectApp } = window.React;

function App() {
  const [route, setRoute] = useStateApp('home');
  const [cmd, setCmd] = useStateApp(false);
  const [assistant, setAssistant] = useStateApp(false);

  useEffectApp(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmd(c => !c); }
      if (e.key === 'Escape') { setCmd(false); setAssistant(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fullBleedRoutes = { review: true, portal: true, wizard: true, editor: true };
  const hideSidebar = route === 'portal';

  const screen = (
    route === 'home'    ? <HomeScreen onJump={setRoute} /> :
    route === 'project' ? <ProjectScreen onJump={setRoute} /> :
    route === 'map'     ? <MapScreen /> :
    route === 'review'  ? <ReviewScreen /> :
    route === 'portal'  ? <PortalScreen /> :
    route === 'wizard'  ? <WizardScreen onJump={setRoute} /> :
    route === 'editor'  ? <EditorScreen /> :
    <HomeScreen onJump={setRoute} />
  );

  const crumbs = {
    home:    ['Home'],
    project: ['Engagements', 'Carwow'],
    map:     ['Engagements', 'Carwow', 'Map'],
    wizard:  ['New project'],
    editor:  []  // editor renders its own topbar
  };

  const topbarActions = {
    home:    null,
    project: <button className="btn btn-primary btn-sm">Continue session →</button>,
    map:     null,
    wizard:  null
  };

  if (hideSidebar) {
    return (
      <>
        {screen}
        {cmd && <CommandPalette onClose={() => setCmd(false)} onJump={setRoute} />}
      </>
    );
  }

  // Editor + review render their own topbar inside the screen
  const screenHasOwnTopbar = route === 'editor' || route === 'review';

  return (
    <div className="app">
      <Sidebar route={route} onNav={setRoute} />
      <div className="main">
        {!screenHasOwnTopbar && (
          <TopBar
            crumb={crumbs[route] || ['Home']}
            action={topbarActions[route]}
            onCmd={() => setCmd(true)}
          />
        )}
        {screen}
      </div>
      {cmd && <CommandPalette onClose={() => setCmd(false)} onJump={setRoute} />}
      {!hideSidebar && route !== 'wizard' && route !== 'editor' && (
        <>
          {!assistant && <AssistantFAB onClick={() => setAssistant(true)} />}
          <AssistantOverlay open={assistant} onClose={() => setAssistant(false)} />
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
