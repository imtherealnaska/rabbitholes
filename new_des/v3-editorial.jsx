// V3 — Editorial mono. Wider column, drop cap, ornamental rules,
// ALL-CAPS small headers, marginalia date/folio, justified body.

const V3_FONT = "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace";

function V3Frame({ theme, route, setRoute, children }) {
  const dark = theme === "dark";
  const c = dark
    ? { bg: "#0e0d0b", fg: "#e8e2d4", muted: "#8a847a", rule: "#2a2622", codebg: "#1a1714", accent: "#e8e2d4" }
    : { bg: "#f4f1ea", fg: "#1a1814", muted: "#7a7368", rule: "#cbc4b3", codebg: "#e8e3d6", accent: "#1a1814" };
  return (
    <div style={{ background: c.bg, color: c.fg, fontFamily: V3_FONT, fontSize: 14, lineHeight: 1.7, minHeight: "100%" }}>
      <V3Header c={c} route={route} setRoute={setRoute} />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px 100px" }}>
        {children(c)}
      </div>
      <V3Footer c={c} />
    </div>
  );
}

function V3Header({ c, route, setRoute }) {
  const items = ["About", "Blog", "Projects", "Resume", "Contact"];
  return (
    <header style={{ borderBottom: `1px solid ${c.rule}`, padding: "20px 32px", marginBottom: 36 }}>
      <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <a onClick={() => setRoute("blog")} style={{ color: c.fg, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontSize: 12, cursor: "pointer", textDecoration: "none" }}>
          Rabbit·holes
        </a>
        <nav style={{ display: "flex", gap: 18, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase" }}>
          {items.map((x) => {
            const k = x.toLowerCase();
            const active = route === k || (k === "blog" && route === "post");
            return (
              <a key={x} onClick={() => setRoute(k)} style={{ color: c.fg, cursor: "pointer", textDecoration: "none", borderBottom: active ? `1px solid ${c.fg}` : "1px solid transparent", paddingBottom: 2 }}>
                {x}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function V3Footer({ c }) {
  return (
    <footer style={{ borderTop: `1px solid ${c.rule}`, padding: "24px 32px", marginTop: 60 }}>
      <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", justifyContent: "space-between", color: c.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>
        <span>© {new Date().getFullYear()} · rabbitholes</span>
        <span>—— set in mono ——</span>
        <span>RSS · github · mail</span>
      </div>
    </footer>
  );
}

function V3Tip({ c, title, text }) {
  return (
    <aside style={{ margin: "26px 0", padding: "16px 18px 14px", border: `1px solid ${c.rule}`, borderLeft: `3px solid ${c.fg}`, background: c.bg === "#0e0d0b" ? "rgba(255,255,255,.02)" : "rgba(0,0,0,.015)", position: "relative" }}>
      <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: c.muted, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11 }}>◐</span>
        <span>—— {title} ——</span>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.6 }}>{text}</div>
    </aside>
  );
}

function V3Warn({ c, title, text }) {
  const stripe = c.bg === "#0e0d0b" ? "rgba(255,180,80,.06)" : "rgba(160,90,20,.05)";
  const accent = c.bg === "#0e0d0b" ? "#d9a86a" : "#8a5a1c";
  return (
    <aside style={{ margin: "26px 0", padding: "16px 18px 14px", border: `1px dashed ${accent}`, background: stripe, position: "relative" }}>
      <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: accent, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11 }}>※</span>
        <span>—— {title} ——</span>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.6 }}>{text}</div>
    </aside>
  );
}

function V3Rabbithole({ c, to, title, blurb }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      onClick={() => alert(`would navigate to: /blog/${to}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block", margin: "32px 0", padding: "18px 22px",
        border: `1px solid ${c.fg}`, color: c.fg, textDecoration: "none", cursor: "pointer",
        background: hover ? c.fg : "transparent",
        transition: "background .15s, color .15s",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: hover ? c.bg : c.muted, marginBottom: 6 }}>
            ⌬ Get into this rabbithole
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: hover ? c.bg : c.fg, letterSpacing: -0.2 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: hover ? c.bg : c.muted, lineHeight: 1.5 }}>
            {blurb}
          </div>
        </div>
        <div style={{ flexShrink: 0, fontSize: 28, fontWeight: 400, color: hover ? c.bg : c.fg, transform: hover ? "translateX(4px)" : "translateX(0)", transition: "transform .15s" }}>
          ↘
        </div>
      </div>
    </a>
  );
}

function V3Ornament({ c, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, color: c.muted, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", margin: "32px 0 18px" }}>
      <span style={{ flex: 1, height: 1, background: c.rule }} />
      <span>◆ {label} ◆</span>
      <span style={{ flex: 1, height: 1, background: c.rule }} />
    </div>
  );
}

function V3Post({ c }) {
  return (
    <article>
      <div style={{ textAlign: "center", color: c.muted, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>
        Vol. III · No. 02 — February MMXXV
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 700, margin: "0 0 14px", letterSpacing: -0.5, textAlign: "center", lineHeight: 1.15 }}>
        {POST.title}
      </h1>
      <div style={{ textAlign: "center", color: c.muted, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 30 }}>
        {POST.date} · {POST.readTime} · filed under rust
      </div>
      <V3Image c={c} />
      <div style={{ position: "relative" }}>
        <V3Body c={c} />
      </div>
      <V3Ornament c={c} label="end" />
    </article>
  );
}

function V3Image({ c }) {
  return (
    <figure style={{ margin: "0 0 36px" }}>
      <div style={{ aspectRatio: "16/10", background:
        `repeating-linear-gradient(90deg, ${c.codebg}, ${c.codebg} 18px, ${c.bg} 18px, ${c.bg} 36px)`,
        border: `1px solid ${c.rule}`, display: "flex", alignItems: "center", justifyContent: "center", color: c.muted, fontSize: 11, letterSpacing: 1 }}>
        [ TITLE IMAGE ]
      </div>
      <figcaption style={{ color: c.muted, fontSize: 11, marginTop: 8, textAlign: "center", letterSpacing: 1 }}>
        Fig. 1 — A self-referential graph in the wild.
      </figcaption>
    </figure>
  );
}

function V3Body({ c }) {
  let firstP = true;
  return (
    <div>
      {POST_BODY.map((node, i) => {
        if (node.type === "p") {
          const isFirst = firstP;
          firstP = false;
          if (node.html) {
            return <p key={i} style={{ margin: "0 0 18px" }} dangerouslySetInnerHTML={{ __html: node.html.replace(/<a /g, `<a style="color:${c.fg};text-decoration:underline;text-underline-offset:3px" `) }} />;
          }
          if (isFirst) {
            const t = node.text;
            const first = t.charAt(0);
            const rest = t.slice(1);
            return (
              <p key={i} style={{ margin: "0 0 18px" }}>
                <span style={{ float: "left", fontSize: 64, lineHeight: 0.85, fontWeight: 700, paddingRight: 10, paddingTop: 6, color: c.fg }}>{first}</span>
                {rest}
              </p>
            );
          }
          return <p key={i} style={{ margin: "0 0 18px" }}>{node.text}</p>;
        }
        if (node.type === "h2") {
          return (
            <h2 key={i} id={node.id} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", margin: "36px 0 14px", borderBottom: `1px solid ${c.rule}`, paddingBottom: 8 }}>
              §{i.toString().padStart(2, "0")} · {node.text}
            </h2>
          );
        }
        if (node.type === "ul") {
          return (
            <ul key={i} style={{ margin: "0 0 18px", paddingLeft: 0, listStyle: "none" }}>
              {node.items.map((item, j) => (
                <li key={j} style={{ marginBottom: 8, paddingLeft: 22, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: c.muted, fontVariantNumeric: "tabular-nums" }}>{(j+1).toString().padStart(2, "0")}</span>
                  {typeof item === "string" ? item : renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }
        if (node.type === "code") return <CodeBlock key={i} src={node.text} theme={c.bg === "#0e0d0b" ? "dark" : "light"} lang={node.lang} />;
        if (node.type === "tip") return <V3Tip key={i} c={c} title={node.title} text={node.text} />;
        if (node.type === "warn") return <V3Warn key={i} c={c} title={node.title} text={node.text} />;
        if (node.type === "rabbithole") return <V3Rabbithole key={i} c={c} to={node.to} title={node.title} blurb={node.blurb} />;
        return null;
      })}
      <style>{`article code { background: ${c.codebg}; padding: 1px 5px; border-radius: 2px; font-size: 13px; font-family: ${V3_FONT}; }`}</style>
    </div>
  );
}

function V3Blog({ c, setRoute }) {
  const grouped = {};
  POSTS.forEach((p) => { const y = p.date.slice(0, 4); (grouped[y] ||= []).push(p); });
  const years = Object.keys(grouped).sort().reverse();
  return (
    <div>
      <div style={{ textAlign: "center", color: c.muted, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
        The Index
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 700, textAlign: "center", margin: "0 0 30px", letterSpacing: -0.5 }}>Writing</h1>
      <V3Ornament c={c} label="essays & notes" />
      {years.map((y) => (
        <div key={y} style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: c.muted, textTransform: "uppercase", marginBottom: 12 }}>— {y} —</div>
          {grouped[y].map((p) => (
            <a key={p.slug} onClick={() => setRoute("post")} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, padding: "12px 0", borderBottom: `1px dashed ${c.rule}`, color: c.fg, textDecoration: "none", cursor: "pointer", alignItems: "baseline" }}>
              <span><span style={{ borderBottom: `1px solid ${c.fg}` }}>{p.title}</span> <span style={{ color: c.muted, fontSize: 12 }}>— {p.excerpt}</span></span>
              <span style={{ color: c.muted, fontSize: 11, letterSpacing: 1 }}>{fmtDate(p.date)}</span>
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}

function V3About({ c }) {
  return (
    <div>
      <div style={{ textAlign: "center", color: c.muted, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Colophon</div>
      <h1 style={{ fontSize: 34, fontWeight: 700, textAlign: "center", margin: "0 0 30px", letterSpacing: -0.5 }}>About</h1>
      <V3Ornament c={c} label="who" />
      <p style={{ margin: "0 0 18px" }}>
        <span style={{ float: "left", fontSize: 64, lineHeight: 0.85, fontWeight: 700, paddingRight: 10, paddingTop: 6 }}>R</span>
        abbitholes is a writing project about the long way around getting something to compile. Mostly Rust. Sometimes Zig. Occasionally a 4,000-word aside on how a linker works.
      </p>
      <p style={{ margin: "0 0 18px" }}>The author is a software engineer who keeps notes in public. The notes are not always finished. That is on purpose.</p>
      <V3Ornament c={c} label="setting" />
      <p style={{ margin: "0 0 18px" }}>This site is set in <em>Geist Mono</em> at 14px, on a paper-toned background of #f4f1ea. There are no trackers and no analytics. There is one RSS feed and it lives at <a style={{ color: c.fg, borderBottom: `1px solid ${c.fg}` }}>/feed.xml</a>.</p>
    </div>
  );
}

function V3Projects({ c }) {
  return (
    <div>
      <div style={{ textAlign: "center", color: c.muted, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Catalogue</div>
      <h1 style={{ fontSize: 34, fontWeight: 700, textAlign: "center", margin: "0 0 30px", letterSpacing: -0.5 }}>Projects</h1>
      <V3Ornament c={c} label="things i've built" />
      {PROJECTS.map((p, i) => (
        <div key={p.name} style={{ padding: "18px 0", borderBottom: `1px dashed ${c.rule}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>№ {String(i+1).padStart(2, "0")} · {p.name}</span>
            <span style={{ color: c.muted, fontSize: 11, letterSpacing: 1 }}>— {p.year} —</span>
          </div>
          <div style={{ marginBottom: 4 }}>{p.desc}</div>
          <a style={{ color: c.muted, fontSize: 12, borderBottom: `1px solid ${c.muted}` }}>{p.link}</a>
        </div>
      ))}
    </div>
  );
}

function V3Contact({ c }) {
  return (
    <div>
      <div style={{ textAlign: "center", color: c.muted, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Correspondence</div>
      <h1 style={{ fontSize: 34, fontWeight: 700, textAlign: "center", margin: "0 0 30px", letterSpacing: -0.5 }}>Contact</h1>
      <V3Ornament c={c} label="how to reach" />
      <table style={{ margin: "0 auto", borderCollapse: "collapse", fontSize: 14 }}>
        <tbody>
          {[["Email", "r@rabbitholes.dev"], ["GitHub", "github.com/rabbitholes"], ["Mastodon", "@r@hachyderm.io"], ["RSS", "/feed.xml"]].map(([k, v]) => (
            <tr key={k}><td style={{ padding: "8px 24px 8px 0", color: c.muted, textTransform: "uppercase", letterSpacing: 2, fontSize: 11 }}>{k}</td><td style={{ padding: "8px 0", borderBottom: `1px dashed ${c.rule}` }}>{v}</td></tr>
          ))}
        </tbody>
      </table>
      <p style={{ textAlign: "center", color: c.muted, marginTop: 28, fontSize: 12 }}>I reply to most things. Eventually.</p>
    </div>
  );
}

function V3({ theme, forceRoute }) {
  const [route, setRoute] = React.useState(forceRoute || "post");
  const inner = (c) => {
    if (route === "post") return <V3Post c={c} />;
    if (route === "blog") return <V3Blog c={c} setRoute={setRoute} />;
    if (route === "about") return <V3About c={c} />;
    if (route === "projects") return <V3Projects c={c} />;
    if (route === "contact" || route === "resume") return <V3Contact c={c} />;
    return <V3Post c={c} />;
  };
  return <V3Frame theme={theme} route={route} setRoute={setRoute}>{inner}</V3Frame>;
}

Object.assign(window, { V3 });
