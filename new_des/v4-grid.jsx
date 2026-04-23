// V4 — Brutalist grid. Hard rules between cells, oversized title, sidebar
// metadata, asymmetric column. Image bleeds into a labeled cell.

const V4_FONT = "'Space Mono', 'JetBrains Mono', ui-monospace, monospace";

function V4Frame({ theme, route, setRoute, children }) {
  const dark = theme === "dark";
  const c = dark
    ? { bg: "#000000", fg: "#ffffff", muted: "#888", rule: "#333", panel: "#0a0a0a", invertbg: "#fff", invertfg: "#000" }
    : { bg: "#ffffff", fg: "#000000", muted: "#666", rule: "#000", panel: "#f3f3f3", invertbg: "#000", invertfg: "#fff" };
  return (
    <div style={{ background: c.bg, color: c.fg, fontFamily: V4_FONT, fontSize: 13, lineHeight: 1.5, minHeight: "100%", border: `1px solid ${c.rule}` }}>
      <V4Header c={c} route={route} setRoute={setRoute} />
      <div>{children(c)}</div>
    </div>
  );
}

function V4Header({ c, route, setRoute }) {
  const items = [["About", "about"], ["Blog", "blog"], ["Projects", "projects"], ["Resume", "resume"], ["Contact", "contact"]];
  return (
    <header style={{ display: "grid", gridTemplateColumns: "1fr auto", borderBottom: `1px solid ${c.rule}` }}>
      <div onClick={() => setRoute("blog")} style={{ padding: "14px 18px", borderRight: `1px solid ${c.rule}`, cursor: "pointer", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
        ▮ Rabbitholes
      </div>
      <nav style={{ display: "flex" }}>
        {items.map(([label, k], i) => {
          const active = route === k || (k === "blog" && route === "post");
          return (
            <a key={k} onClick={() => setRoute(k)} style={{ padding: "14px 18px", borderLeft: i === 0 ? "none" : `1px solid ${c.rule}`, cursor: "pointer", textDecoration: "none", color: active ? c.invertfg : c.fg, background: active ? c.invertbg : "transparent", textTransform: "uppercase", fontSize: 11, letterSpacing: 1 }}>
              {label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}

function V4Post({ c }) {
  return (
    <article>
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 120px", borderBottom: `1px solid ${c.rule}` }}>
        <div style={{ padding: "14px 16px", borderRight: `1px solid ${c.rule}`, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: c.muted }}>
          № 042<br/>2025·02·08
        </div>
        <div style={{ padding: "20px 24px", fontWeight: 700, fontSize: 36, letterSpacing: -1, lineHeight: 1.05, textTransform: "uppercase" }}>
          {POST.title}
        </div>
        <div style={{ padding: "14px 16px", borderLeft: `1px solid ${c.rule}`, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: c.muted, textAlign: "right" }}>
          {POST.readTime}<br/>rust
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", borderBottom: `1px solid ${c.rule}` }}>
        <div style={{ padding: "20px", borderRight: `1px solid ${c.rule}`, fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5 }}>
          <div style={{ color: c.muted, marginBottom: 12 }}>—— Index</div>
          {POST.toc.map((t, i) => (
            <a key={t.id} href={`#${t.id}`} style={{ display: "block", color: c.fg, padding: "4px 0", textDecoration: "none" }}>
              {String(i+1).padStart(2, "0")} / {t.label}
            </a>
          ))}
          <div style={{ color: c.muted, marginTop: 24, fontSize: 9, lineHeight: 1.6 }}>
            Filed under<br/>RUST · ASYNC · NOTES
          </div>
        </div>
        <div style={{ background:
          `repeating-linear-gradient(0deg, ${c.panel}, ${c.panel} 16px, ${c.bg} 16px, ${c.bg} 32px)`,
          minHeight: 320, position: "relative" }}>
          <div style={{ position: "absolute", top: 12, left: 14, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: c.muted }}>FIG. 01 — TITLE IMAGE</div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: c.muted, fontSize: 11 }}>[ image goes here ]</div>
        </div>
      </div>

      <div style={{ padding: "32px 24px", maxWidth: 720 }}>
        <V4Body c={c} />
      </div>
      <div style={{ borderTop: `1px solid ${c.rule}`, padding: "14px 18px", display: "flex", justifyContent: "space-between", color: c.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5 }}>
        <span>← prev / lifetimes are not the borrow checker</span>
        <span>next / tokio internals →</span>
      </div>
    </article>
  );
}

function V4Body({ c }) {
  return (
    <div>
      {POST_BODY.map((node, i) => {
        if (node.type === "p") {
          return node.html
            ? <p key={i} style={{ margin: "0 0 16px" }} dangerouslySetInnerHTML={{ __html: node.html.replace(/<a /g, `<a style="color:${c.fg};text-decoration:none;border-bottom:2px solid ${c.fg}" `) }} />
            : <p key={i} style={{ margin: "0 0 16px" }}>{node.text}</p>;
        }
        if (node.type === "h2") {
          return (
            <h2 key={i} id={node.id} style={{ display: "inline-block", background: c.invertbg, color: c.invertfg, padding: "4px 10px", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "30px 0 14px" }}>
              {String(i).padStart(2, "0")} / {node.text}
            </h2>
          );
        }
        if (node.type === "ul") {
          return (
            <ul key={i} style={{ margin: "0 0 16px", paddingLeft: 0, listStyle: "none", borderTop: `1px solid ${c.rule}` }}>
              {node.items.map((item, j) => (
                <li key={j} style={{ padding: "8px 0", borderBottom: `1px solid ${c.rule}`, display: "grid", gridTemplateColumns: "30px 1fr", gap: 10 }}>
                  <span style={{ color: c.muted, fontVariantNumeric: "tabular-nums" }}>{String(j+1).padStart(2, "0")}</span>
                  <span>{typeof item === "string" ? item : renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (node.type === "code") return <CodeBlock key={i} src={node.text} theme={c.bg === "#000000" ? "dark" : "light"} lang={node.lang} />;
        return null;
      })}
      <style>{`article code { background: ${c.invertbg}; color: ${c.invertfg}; padding: 1px 6px; font-size: 12px; font-family: ${V4_FONT}; }`}</style>
    </div>
  );
}

function V4Blog({ c, setRoute }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: `1px solid ${c.rule}` }}>
        <div style={{ padding: "20px 24px", fontSize: 48, fontWeight: 700, letterSpacing: -1, textTransform: "uppercase", lineHeight: 1, gridColumn: "1 / -1" }}>Writing<span style={{ color: c.muted, fontSize: 14, marginLeft: 12 }}>/ {POSTS.length} posts</span></div>
      </div>
      {POSTS.map((p, i) => (
        <a key={p.slug} onClick={() => setRoute("post")} style={{ display: "grid", gridTemplateColumns: "120px 1fr 100px", borderBottom: `1px solid ${c.rule}`, color: c.fg, textDecoration: "none", cursor: "pointer" }}>
          <div style={{ padding: "16px 20px", borderRight: `1px solid ${c.rule}`, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: c.muted, fontVariantNumeric: "tabular-nums" }}>
            № {String(i+1).padStart(3, "0")}<br/>{fmtDate(p.date)}
          </div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ fontWeight: 700, fontSize: 18, textTransform: "uppercase", letterSpacing: -0.3 }}>{p.title}</div>
            <div style={{ color: c.muted, fontSize: 12, marginTop: 4 }}>{p.excerpt}</div>
          </div>
          <div style={{ padding: "16px 20px", borderLeft: `1px solid ${c.rule}`, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: c.muted, textAlign: "right" }}>
            [{p.tag}]
          </div>
        </a>
      ))}
    </div>
  );
}

function V4About({ c }) {
  return (
    <div>
      <div style={{ padding: "30px 24px", fontSize: 56, fontWeight: 700, letterSpacing: -1.5, textTransform: "uppercase", lineHeight: 1, borderBottom: `1px solid ${c.rule}` }}>About</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
        <div style={{ padding: "20px", borderRight: `1px solid ${c.rule}`, background:
          `repeating-linear-gradient(45deg, ${c.panel}, ${c.panel} 14px, ${c.bg} 14px, ${c.bg} 28px)`,
          minHeight: 280, display: "flex", alignItems: "flex-end", color: c.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5 }}>
          [ Portrait ]
        </div>
        <div style={{ padding: "24px" }}>
          <p style={{ margin: "0 0 14px" }}>Software engineer. Notes-in-public type. I build small things in Rust, write about systems work, and sometimes go sideways into a 4,000-word essay about a linker.</p>
          <p style={{ margin: "0 0 14px" }}>This site is mostly notes for myself. If they help anyone else, that's a nice bonus.</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: `1px solid ${c.rule}` }}>
        {[["Currently", "kettle, a tiny job scheduler"], ["Reading", "TAOCP vol. 4A. slowly."], ["Learning", "bouldering. slower."]].map(([k, v], i) => (
          <div key={k} style={{ padding: "20px", borderRight: i < 2 ? `1px solid ${c.rule}` : "none" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: c.muted, marginBottom: 6 }}>{k}</div>
            <div style={{ fontSize: 14 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function V4Projects({ c }) {
  return (
    <div>
      <div style={{ padding: "30px 24px", fontSize: 56, fontWeight: 700, letterSpacing: -1.5, textTransform: "uppercase", lineHeight: 1, borderBottom: `1px solid ${c.rule}` }}>Projects</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {PROJECTS.map((p, i) => (
          <div key={p.name} style={{ padding: "22px 24px", borderRight: i % 2 === 0 ? `1px solid ${c.rule}` : "none", borderBottom: `1px solid ${c.rule}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 22, textTransform: "uppercase", letterSpacing: -0.5 }}>{p.name}</span>
              <span style={{ color: c.muted, fontSize: 11, letterSpacing: 1 }}>{p.year}</span>
            </div>
            <div style={{ marginBottom: 10 }}>{p.desc}</div>
            <a style={{ color: c.fg, fontSize: 11, borderBottom: `2px solid ${c.fg}`, textTransform: "uppercase", letterSpacing: 1 }}>↗ {p.link}</a>
          </div>
        ))}
      </div>
    </div>
  );
}

function V4Contact({ c }) {
  return (
    <div>
      <div style={{ padding: "30px 24px", fontSize: 56, fontWeight: 700, letterSpacing: -1.5, textTransform: "uppercase", lineHeight: 1, borderBottom: `1px solid ${c.rule}` }}>Contact</div>
      {[["EMAIL", "r@rabbitholes.dev"], ["GITHUB", "github.com/rabbitholes"], ["MASTODON", "@r@hachyderm.io"], ["RSS", "/feed.xml"]].map(([k, v]) => (
        <div key={k} style={{ display: "grid", gridTemplateColumns: "150px 1fr", borderBottom: `1px solid ${c.rule}` }}>
          <div style={{ padding: "18px 20px", borderRight: `1px solid ${c.rule}`, fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: c.muted }}>{k}</div>
          <div style={{ padding: "18px 20px", fontSize: 16 }}>{v}</div>
        </div>
      ))}
      <div style={{ padding: "20px 24px", color: c.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 2 }}>—— I reply to most things. Eventually.</div>
    </div>
  );
}

function V4({ theme, forceRoute }) {
  const [route, setRoute] = React.useState(forceRoute || "post");
  const inner = (c) => {
    if (route === "post") return <V4Post c={c} />;
    if (route === "blog") return <V4Blog c={c} setRoute={setRoute} />;
    if (route === "about") return <V4About c={c} />;
    if (route === "projects") return <V4Projects c={c} />;
    if (route === "contact" || route === "resume") return <V4Contact c={c} />;
    return <V4Post c={c} />;
  };
  return <V4Frame theme={theme} route={route} setRoute={setRoute}>{inner}</V4Frame>;
}

Object.assign(window, { V4 });
