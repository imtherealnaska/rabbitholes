// app.jsx — design-canvas wrapper showing all 4 variations × 5 routes,
// plus a Tweaks panel for theme + font scale.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "fontScale": 1
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [tweakOn, setTweakOn] = React.useState(false);

  // Tweaks bridge
  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") setTweakOn(true);
      if (d.type === "__deactivate_edit_mode") setTweakOn(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const setKey = (k, v) => {
    setTweaks((t) => ({ ...t, [k]: v }));
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  };

  const theme = tweaks.theme || "light";
  const scale = tweaks.fontScale || 1;

  // Per-variation surface — 5 artboards each (post, blog, about, projects, contact)
  const surfaces = [
    { id: "v1", title: "V1 — Faithful", subtitle: "Mono, narrow column, hairline rules — matches the reference", Comp: window.V1 },
    { id: "v2", title: "V2 — Terminal / Dev-doc", subtitle: "Sticky TOC, prompt header, file-tree projects, reading-progress bar", Comp: window.V2 },
    { id: "v3", title: "V3 — Editorial Mono", subtitle: "Drop caps, ornamental rules, marginalia, longform feel", Comp: window.V3 },
    { id: "v4", title: "V4 — Brutalist Grid", subtitle: "Hard rules, oversized caps title, asymmetric cells, inverted accents", Comp: window.V4 },
  ];

  const ROUTES = [
    { id: "post", label: "Post" },
    { id: "blog", label: "Blog index" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  // Each artboard mounts a component instance forced to a particular route via key+ref hack.
  // Simpler: render the variation with a forced initial route by passing a `forceRoute` prop.
  return (
    <>
      <DesignCanvas>
        {surfaces.map((s) => (
          <DCSection key={s.id} id={s.id} title={s.title} subtitle={s.subtitle}>
            {ROUTES.map((r) => (
              <DCArtboard key={r.id} id={`${s.id}-${r.id}`} label={r.label} width={760} height={880}>
                <ForcedRoute Comp={s.Comp} route={r.id} theme={theme} scale={scale} />
              </DCArtboard>
            ))}
          </DCSection>
        ))}
      </DesignCanvas>
      {tweakOn && <TweaksPanel tweaks={tweaks} setKey={setKey} />}
    </>
  );
}

// Each variation accepts a `forceRoute` prop that pins its initial route.
// Inside an artboard, the user can still click around — useful in focus mode.
function ForcedRoute({ Comp, route, theme, scale }) {
  return (
    <div style={{ height: "100%", overflow: "auto", fontSize: `${scale}em` }}>
      <Comp theme={theme} forceRoute={route} />
    </div>
  );
}

function TweaksPanel({ tweaks, setKey }) {
  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 1000,
      background: "#1a1714", color: "#f4f1ea", padding: 16, borderRadius: 8,
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,.4)", width: 240, border: "1px solid #2a2622"
    }}>
      <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 13 }}>Tweaks</div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ color: "#8a847a", marginBottom: 6, fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Theme</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["light", "dark"].map((t) => (
            <button key={t} onClick={() => setKey("theme", t)}
              style={{ flex: 1, padding: "6px 10px", border: `1px solid ${tweaks.theme === t ? "#f4f1ea" : "#3a352e"}`,
                background: tweaks.theme === t ? "#f4f1ea" : "transparent",
                color: tweaks.theme === t ? "#1a1714" : "#f4f1ea",
                cursor: "pointer", fontFamily: "inherit", fontSize: 11, borderRadius: 4 }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 4 }}>
        <div style={{ color: "#8a847a", marginBottom: 6, fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Font scale · {tweaks.fontScale.toFixed(2)}×</div>
        <input type="range" min={0.85} max={1.3} step={0.05} value={tweaks.fontScale}
          onChange={(e) => setKey("fontScale", parseFloat(e.target.value))}
          style={{ width: "100%", accentColor: "#f4f1ea" }} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
