// Shared content + helpers for all variations.

const POST = {
  title: "Understanding Pinning in rust.",
  date: "2/8/2025",
  readTime: "8 min",
  toc: [
    { id: "intro", label: "The fundamental problem" },
    { id: "real-world", label: "Real-world examples" },
    { id: "deep-dive", label: "Deep dive" },
    { id: "gotchas", label: "Common gotchas" },
    { id: "notes", label: "Notes from the video" },
  ],
};

const POSTS = [
  { slug: "pinning-rust", title: "Understanding Pinning in rust.", date: "2025-02-08", tag: "rust", excerpt: "Why self-referential structs are tricky, and how Pin keeps them where they belong." },
  { slug: "lifetimes-vs-borrow", title: "Lifetimes are not the borrow checker.", date: "2025-01-22", tag: "rust", excerpt: "A small but useful distinction. Lifetimes are annotations; the borrow checker enforces." },
  { slug: "tokio-internals", title: "What runs in a Tokio worker?", date: "2024-12-14", tag: "async", excerpt: "Tracing a single .await through the runtime, one syscall at a time." },
  { slug: "linker-magic", title: "Reading rustc’s linker invocation.", date: "2024-11-30", tag: "build", excerpt: "There is no magic. Just a very long command line." },
  { slug: "wasm-debug", title: "Debugging wasm without losing your mind.", date: "2024-10-19", tag: "wasm", excerpt: "Source maps, panic hooks, and the print-to-console school of debugging." },
  { slug: "raii-everywhere", title: "RAII isn’t just for C++ programmers.", date: "2024-09-02", tag: "rust", excerpt: "Drop, defer, using, with: the same idea, four syntaxes." },
];

const PROJECTS = [
  { name: "kettle", desc: "A tiny job scheduler in 600 lines of Rust.", year: "2025", link: "github.com/r/kettle" },
  { name: "burrow", desc: "A terminal-first feed reader. RSS, Atom, JSONFeed.", year: "2024", link: "github.com/r/burrow" },
  { name: "stem", desc: "Static site generator with first-class footnotes.", year: "2024", link: "github.com/r/stem" },
  { name: "pinmap", desc: "Visualize Pin / Unpin relations in a Rust crate.", year: "2023", link: "github.com/r/pinmap" },
];

// The actual post body, broken into structured nodes so each variation
// can render it in its own visual language.
const POST_BODY = [
  { type: "p", text: "Start with the fundamental problem Pinning solves:" },
  { type: "ul", items: [
    "Why self-referential structs are tricky",
    "How async/await created a need for pinning",
    "Memory movement problems",
  ]},
  { type: "h2", id: "real-world", text: "Real-world examples" },
  { type: "ul", items: [
    "How Tokio uses Pin",
    "Common patterns in async code",
    "Where developers often get stuck",
  ]},
  { type: "h2", id: "deep-dive", text: "Deep dive" },
  { type: "ul", items: [
    ["Pin<&T>", " vs ", { code: "Pin<&mut T>" }],
    [{ code: "Unpin" }, " trait and when to use it"],
    "Safety guarantees",
    [{ code: "PhantomPinned" }, " marker"],
  ]},
  { type: "h2", id: "gotchas", text: "Common gotchas" },
  { type: "ul", items: [
    ["Why ", { code: "Box::pin" }, " exists"],
    "Stream implementations",
    "Stack pinning vs heap pinning",
  ]},
  { type: "h2", id: "notes", text: "Notes" },
  { type: "p", html: "The rest of the post is mostly notes from <a href='#'>Jon Gjengset’s video</a> on Pinning and other things I looked into." },
  { type: "ul", items: [
    ["When you place something in ", { code: "Pin" }, " you promise not to move it. It should have been named ", { code: "nail" }, " hahahah ."],
    ["As long as the type is ", { code: "Unpin" }, " nothing really matters."],
    ["Something about ", { code: "!Unpin" }],
    [{ em: "Why is moving something that is guaranteed to stay in place by Pin unsafe ?" }, " ", { code: "Pin" }, " is like a guarantee saying that the value under pin will not be moved from the memory location, and the code follows that will have taken this into account. But when there is a move , or a swap (as in the eg.) the value cannot be used after that."],
    ["And also ", { code: "Poll" }, " is an enum , ", { code: "Ready(val)" }, " if the task is finished and ", { code: "Pending" }, " if it is still going on ."],
    [{ code: "Box" }, " makes sure the value is in a stable position and ", { code: "Pin" }, " makes sure it cant be moved , unless it’s ", { code: "Unpin" }, "."],
  ]},
  { type: "code", lang: "rust", text:
`use std::pin::Pin;
use std::marker::PhantomPinned;

struct SelfRef {
    data: String,
    ptr: *const String,
    _pin: PhantomPinned,
}

impl SelfRef {
    fn new(data: &str) -> Pin<Box<Self>> {
        let mut boxed = Box::pin(SelfRef {
            data: data.into(),
            ptr: std::ptr::null(),
            _pin: PhantomPinned,
        });
        let ptr = &boxed.data as *const String;
        // SAFETY: not moving the value, only writing to a field.
        unsafe { boxed.as_mut().get_unchecked_mut().ptr = ptr; }
        boxed
    }
}` },
  { type: "p", text: "That’s the core idea. The interesting part is convincing yourself you can read .ptr safely afterwards — and that’s the whole reason !Unpin exists." },
];

// Render a small inline rich-text array (string | {code} | {em}) into JSX.
function renderInline(node, codeClass = "code-inline") {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map((n, i) => <React.Fragment key={i}>{renderInline(n, codeClass)}</React.Fragment>);
  if (node.code) return <code className={codeClass}>{node.code}</code>;
  if (node.em) return <em>{node.em}</em>;
  return null;
}

// Lightweight Rust-ish syntax highlighter — keyword/string/comment/number.
// Returns an array of <span> nodes. No regex backrefs, just a tokenizer.
function highlightRust(src) {
  const KW = new Set(["fn","let","mut","use","pub","struct","impl","self","Self","as","unsafe","return","if","else","for","in","while","loop","match","ref","move","static","const","crate","mod","trait","where","type","enum","async","await"]);
  const out = [];
  let i = 0, buf = "";
  const flush = () => { if (buf) { out.push({ t: "text", v: buf }); buf = ""; } };
  while (i < src.length) {
    const c = src[i];
    // line comment
    if (c === "/" && src[i+1] === "/") {
      flush();
      let j = i;
      while (j < src.length && src[j] !== "\n") j++;
      out.push({ t: "comment", v: src.slice(i, j) });
      i = j;
      continue;
    }
    // string
    if (c === '"') {
      flush();
      let j = i + 1;
      while (j < src.length && src[j] !== '"') { if (src[j] === "\\") j++; j++; }
      out.push({ t: "string", v: src.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    // number
    if (/[0-9]/.test(c) && !/[A-Za-z_]/.test(src[i-1] || "")) {
      flush();
      let j = i;
      while (j < src.length && /[0-9_\.]/.test(src[j])) j++;
      out.push({ t: "num", v: src.slice(i, j) });
      i = j;
      continue;
    }
    // word
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      if (KW.has(word)) { flush(); out.push({ t: "kw", v: word }); }
      else if (/^[A-Z]/.test(word)) { flush(); out.push({ t: "type", v: word }); }
      else buf += word;
      i = j;
      continue;
    }
    buf += c;
    i++;
  }
  flush();
  return out;
}

function CodeBlock({ src, theme = "light", lang = "rust" }) {
  const tokens = highlightRust(src);
  const colors = theme === "dark"
    ? { bg: "#0e0e0e", fg: "#d4d4d4", kw: "#c586c0", str: "#ce9178", com: "#6a9955", num: "#b5cea8", type: "#4ec9b0", border: "#1f1f1f", chrome: "#161616", chromefg: "#7a7a7a" }
    : { bg: "#fafaf8", fg: "#1a1a1a", kw: "#7c3aed", str: "#a16207", com: "#6b7280", num: "#0e7490", type: "#0f766e", border: "#e5e3dc", chrome: "#f1efe8", chromefg: "#7a7568" };
  const colorOf = (t) => ({ kw: colors.kw, string: colors.str, comment: colors.com, num: colors.num, type: colors.type }[t] || colors.fg);
  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 4, overflow: "hidden", margin: "20px 0" }}>
      <div style={{ background: colors.chrome, color: colors.chromefg, padding: "6px 12px", fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
        <span>{lang}</span>
        <span style={{ opacity: 0.6 }}>// pin.rs</span>
      </div>
      <pre style={{ margin: 0, padding: "14px 16px", background: colors.bg, color: colors.fg, fontSize: 13, lineHeight: 1.55, overflow: "auto", fontFamily: "var(--mono, 'JetBrains Mono'), monospace" }}>
        <code>
          {tokens.map((tok, i) => <span key={i} style={{ color: colorOf(tok.t) }}>{tok.v}</span>)}
        </code>
      </pre>
    </div>
  );
}

Object.assign(window, { POST, POSTS, PROJECTS, POST_BODY, renderInline, CodeBlock, highlightRust });
