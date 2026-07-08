import React from "react";

/* ── Icons (Lucide-style, stroke = currentColor) ───────────────────────── */
const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
const Icon = ({ size = 24, children, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...S} {...p}>{children}</svg>
);
const CameraIcon = (p) => (
  <Icon {...p}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" /><circle cx="12" cy="13" r="3.5" /></Icon>
);
const PinIcon = (p) => (
  <Icon {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></Icon>
);
const UsersIcon = (p) => (
  <Icon {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></Icon>
);
const ShareIcon = (p) => (
  <Icon {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51 6.83 3.98M15.41 6.51 8.59 10.49" /></Icon>
);
const MicIcon = (p) => (
  <Icon {...p}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" /></Icon>
);
const MapIcon = (p) => (
  <Icon {...p}><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15M15 6v15" /></Icon>
);
const CheckSquareIcon = (p) => (
  <Icon {...p}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Icon>
);
const CheckIcon = (p) => (<Icon {...p}><path d="M20 6 9 17l-5-5" /></Icon>);
const ImageIcon = (p) => (
  <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L7 19" /></Icon>
);
const MenuIcon = (p) => (<Icon {...p}><path d="M3 6h18M3 12h18M3 18h18" /></Icon>);
const AppleLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M16.5 1.5c.1 1-.3 2-1 2.8-.7.8-1.8 1.4-2.8 1.3-.1-1 .4-2 1-2.7.7-.8 1.9-1.4 2.8-1.4ZM20 17.3c-.5 1.2-.8 1.7-1.5 2.7-1 1.4-2.3 3.1-4 3.1-1.5 0-1.9-1-3.9-1-2 0-2.4 1-3.9 1-1.7 0-2.9-1.6-3.9-2.9C.1 17.4-.4 12.8 1.3 10c1-1.6 2.6-2.6 4.1-2.6 1.6 0 2.6 1 3.9 1 1.3 0 2-1 3.9-1 1.4 0 2.9.8 4 2.1-3.5 1.9-2.9 6.9 1 7.8Z" /></svg>
);
const PlayLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="#34A853" d="M3.6 21c.3.2.7.2 1.1 0l9-5.2-2.5-2.5L3.6 21Z" /><path fill="#FBBC04" d="m17 11.3-2.8-1.6-2.7 2.7 2.7 2.7L17 13.5c.8-.5.8-1.7 0-2.2Z" /><path fill="#4285F4" d="M3.4 3c-.1.2-.2.5-.2.8v16.4c0 .3.1.6.2.8l8.4-9-8.4-9Z" /><path fill="#EA4335" d="M3.6 3c.3-.2.7-.2 1.1 0l7.6 4.4-2.5 2.5L3.6 3Z" /></svg>
);

/* ── Data ──────────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: PinIcon, title: "GPS-tagged photo grouping", body: "Every photo is stamped with its location and automatically grouped into the right project the moment it's taken — no manual sorting back at the truck." },
  { icon: UsersIcon, title: "Workgroups with lead visibility", body: "Inspectors capture their own sites while the lead account sees everything — every inspector, every location — in one consolidated view." },
  { icon: ShareIcon, title: "Flexible photo sharing", body: "Share with the whole workgroup, hand-pick specific inspectors, or generate a public link for clients and contractors — you decide the audience." },
  { icon: MicIcon, title: "Voice & text notes + AI reports", body: "Add a voice or text note to any photo. SnapSite's AI drafts a clean inspection report from your notes — but nothing saves until the inspector reviews and approves it." },
  { icon: MapIcon, title: "Interactive map view", body: "See all active projects as pins on a map. Tap any pin to jump straight into that site's photos, notes, and status." },
  { icon: CheckSquareIcon, title: "Complete & approval workflow", body: "An inspector marks a project done; the lead approves a one-tap close-out that archives the photos to your destination and clears it off the active list." },
];

const STEPS = [
  { n: 1, title: "Snap on site", body: "Tap the camera. Photos are GPS-tagged and dropped into the matching project automatically." },
  { n: 2, title: "Annotate & draft", body: "Add voice or text notes. AI drafts the report; the inspector reviews and approves before anything is saved." },
  { n: 3, title: "Share & review", body: "Share with the workgroup, specific inspectors, or a public link. The lead tracks every site from the map." },
  { n: 4, title: "Close it out", body: "Inspector marks it done, lead approves the one-tap close-out, and photos archive to your destination." },
];

const STATS = [
  ["500+", "Inspection teams"], ["1.2M+", "Photos archived"],
  ["40k+", "Projects closed out"], ["90%", "Less time filing"],
];

const PLANS = [
  { name: "Inspector", price: "$0", per: " / mo", note: "For solo field inspectors getting organized.", cta: "Get started", primary: false,
    features: ["GPS-tagged photo grouping", "Voice & text notes", "Up to 3 active projects", "Public link sharing"] },
  { name: "Team", price: "$29", per: " / inspector / mo", note: "For workgroups that need lead oversight.", cta: "Start free trial", primary: true, popular: true,
    features: ["Everything in Inspector", "Workgroups + lead visibility", "AI-assisted report drafting", "Approval & close-out workflow", "Unlimited active projects"] },
  { name: "Enterprise", price: "Custom", per: "", note: "For organizations with many crews.", cta: "Contact sales", primary: false,
    features: ["Everything in Team", "Custom archive destinations", "SSO & admin controls", "Dedicated support & SLA"] },
];

const TESTIMONIALS = [
  { initials: "DM", quote: "We used to lose an hour a day sorting photos by job. Now they're filed by location before I'm back in the truck. The close-out approval is a game-changer for our leads.", name: "Darnell Mills", role: "Utility Inspector, GridLine Services" },
  { initials: "RC", quote: "The AI report draft saves me from typing on a phone in the rain — but it still waits for my approval, so nothing wrong ever gets logged. That balance is exactly right.", name: "Rosa Castillo", role: "Lead Inspector, Meridian Construction" },
  { initials: "TN", quote: "As the workgroup lead I can finally see every site my crew is on from one map. One tap closes a project and archives everything. Audits take minutes now.", name: "Tom Nguyen", role: "Operations Lead, Summit Utilities" },
];

const PINS = ["pin", "pin2", "pin3"];
const photoTiles = (n) => Array.from({ length: n }, (_, i) => <div key={i} className={PINS[i % 3]} />);

/* ── Component ─────────────────────────────────────────────────────────── */
export default function SnapSite() {
  return (
    <>
      <style>{CSS}</style>

      <header>
        <div className="wrap nav">
          <a href="#top" className="brand" aria-label="SnapSite home">
            <span className="brand-mark" aria-hidden="true"><CameraIcon size={20} /></span>
            SnapSite
          </a>
          <nav className="nav-links" aria-label="Primary">
            <a className="link" href="#features">Features</a>
            <a className="link" href="#how">How it works</a>
            <a className="link" href="#preview">Preview</a>
            <a className="link" href="#pricing">Pricing</a>
            <a className="btn btn-primary" href="#download">Get the app</a>
          </nav>
          <button className="menu-btn" aria-label="Open menu"><MenuIcon size={26} /></button>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero" style={{ padding: 0 }}>
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow"><PinIcon size={14} strokeWidth={2.5} /> Built for field inspection teams</span>
              <h1>Every field photo, organized by the site it came from.</h1>
              <p className="lead">SnapSite auto-groups GPS-tagged photos by project location so construction and utility inspection crews capture, annotate, and close out work without the end-of-day file shuffle.</p>
              <div className="hero-cta">
                <a className="btn btn-primary" href="#download"><CameraIcon size={18} /> Start capturing free</a>
                <a className="btn btn-ghost" href="#how">See how it works</a>
              </div>
              <div className="hero-meta">
                <CheckIcon size={18} strokeWidth={2.5} style={{ color: "var(--accent)" }} />
                No credit card · Works offline in the field
              </div>
            </div>
            <div aria-hidden="true">
              <div className="phone">
                <div className="phone-screen">
                  <div className="ps-top">
                    <small>Active project</small>
                    <div className="loc"><PinIcon size={16} /> Substation 14 — Riverside</div>
                  </div>
                  <div className="ps-photos">{photoTiles(9)}</div>
                  <div className="ps-bar">
                    <span style={{ fontSize: ".8rem", color: "var(--muted-fg)" }}>9 photos · 2 notes</span>
                    <div className="ps-cam" aria-hidden="true"><CameraIcon size={24} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="stats">
          <div className="wrap stats-grid">
            {STATS.map(([num, lbl]) => (
              <div className="stat" key={lbl}><div className="num">{num}</div><div className="lbl">{lbl}</div></div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <section id="features">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Features</span>
              <h2>Everything a field crew needs, nothing they don't</h2>
              <p className="lead">From the first tap of the shutter to the lead's final approval, SnapSite keeps the whole job in one organized place.</p>
            </div>
            <div className="features">
              {FEATURES.map(({ icon: I, title, body }) => (
                <article className="card" key={title}>
                  <div className="ficon"><I size={24} /></div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <div style={{ marginTop: 22 }}>
              <article className="card" style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                <div className="ficon" style={{ margin: 0 }}><CameraIcon size={24} /></div>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <h3>One-tap camera, always a thumb away</h3>
                  <p style={{ color: "var(--muted-fg)" }}>A persistent quick-access camera button means a new photo is one tap from anywhere in the app — captured, tagged, and filed before you've taken your hand off the wall.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="how">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">How it works</span>
              <h2>From shutter to sign-off in four steps</h2>
            </div>
            <div className="steps">
              {STEPS.map((s) => (
                <div className="step" key={s.n}>
                  <div className="n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PREVIEW */}
        <section id="preview">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Preview</span>
              <h2>A look inside SnapSite</h2>
              <p className="lead">Map view, project galleries, and AI-assisted notes — built for gloved hands and bright sun.</p>
            </div>
            <div className="shots">
              <div className="shot">
                <div className="shot-top"><MapIcon size={18} style={{ color: "var(--primary)" }} /> Map view</div>
                <div className="shot-body">
                  <div className="map-bg">
                    <span className="mappin" style={{ top: 60, left: 70, background: "var(--primary)" }} />
                    <span className="mappin" style={{ top: 130, left: 180, background: "var(--accent)" }} />
                    <span className="mappin" style={{ top: 200, left: 90, background: "var(--secondary)" }} />
                    <span className="mappin" style={{ top: 90, left: 230, background: "var(--destructive)" }} />
                  </div>
                </div>
              </div>
              <div className="shot">
                <div className="shot-top"><ImageIcon size={18} style={{ color: "var(--primary)" }} /> Project gallery</div>
                <div className="shot-body"><div className="grid-photos">{photoTiles(12)}</div></div>
              </div>
              <div className="shot">
                <div className="shot-top"><MicIcon size={18} style={{ color: "var(--primary)" }} /> Notes &amp; AI draft</div>
                <div className="shot-body">
                  <div className="note-row">
                    <div className="note-thumb pin" />
                    <div><div className="ai-chip">AI draft · needs approval</div><p>"Corrosion on lower bracket, recommend replacement within 30 days."</p></div>
                  </div>
                  <div className="note-row">
                    <div className="note-thumb pin2" />
                    <div><div className="ai-chip">Voice note · 0:14</div><p>Transformer reading nominal, gauge photographed for record.</p></div>
                  </div>
                  <div className="note-row" style={{ border: "none" }}>
                    <div className="note-thumb pin3" />
                    <div><div className="ai-chip">AI draft · approved</div><p>Access panel secured, no further action required.</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="how">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Pricing</span>
              <h2>Plans that scale with your crew</h2>
              <p className="lead">Start free as a solo inspector, grow into a full workgroup, or run the whole organization.</p>
            </div>
            <div className="pricing">
              {PLANS.map((p) => (
                <div className={`plan${p.popular ? " pop" : ""}`} key={p.name}>
                  <h3>{p.name}</h3>
                  <div className="price">{p.price}<span>{p.per}</span></div>
                  <p style={{ color: "var(--muted-fg)", fontSize: ".92rem" }}>{p.note}</p>
                  <ul>
                    {p.features.map((f) => (
                      <li key={f}><CheckIcon size={18} strokeWidth={2.5} /> {f}</li>
                    ))}
                  </ul>
                  <a className={`btn ${p.primary ? "btn-primary" : "btn-ghost"}`} href="#download">{p.cta}</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section>
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Testimonials</span>
              <h2>Trusted by crews in the field</h2>
            </div>
            <div className="tests">
              {TESTIMONIALS.map((t) => (
                <figure className="quote" key={t.initials}>
                  <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
                  <p>"{t.quote}"</p>
                  <figcaption className="who">
                    <span className="avatar">{t.initials}</span>
                    <span><span className="nm">{t.name}</span><br /><span className="rl">{t.role}</span></span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / DOWNLOAD */}
        <section id="download" style={{ paddingBottom: 0 }}>
          <div className="wrap">
            <div className="cta-band">
              <h2>Get your crew organized today</h2>
              <p>Join 500+ inspection teams capturing, annotating, and closing out projects with SnapSite. Free for solo inspectors.</p>
              <div className="badges">
                <a className="store" href="#" aria-label="Download on the App Store">
                  <AppleLogo /><span><small>Download on the</small><strong>App Store</strong></span>
                </a>
                <a className="store" href="#" aria-label="Get it on Google Play">
                  <PlayLogo /><span><small>Get it on</small><strong>Google Play</strong></span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <a href="#top" className="brand"><span className="brand-mark" aria-hidden="true"><CameraIcon size={20} /></span>SnapSite</a>
              <p style={{ marginTop: 14, color: "#94a3b8", fontSize: ".92rem", maxWidth: 280 }}>Field photo organization for construction and utility inspection teams.</p>
            </div>
            <div>
              <h4>Product</h4>
              <a className="fl" href="#features">Features</a>
              <a className="fl" href="#how">How it works</a>
              <a className="fl" href="#preview">Preview</a>
              <a className="fl" href="#pricing">Pricing</a>
            </div>
            <div>
              <h4>Company</h4>
              {["About", "Careers", "Blog", "Contact"].map((x) => <a className="fl" href="#" key={x}>{x}</a>)}
            </div>
            <div>
              <h4>Legal</h4>
              {["Privacy Policy", "Terms of Service", "Security", "Data & archives"].map((x) => <a className="fl" href="#" key={x}>{x}</a>)}
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 SnapSite. All rights reserved.</span>
            <span>Made for the field.</span>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ── Styles ────────────────────────────────────────────────────────────── */
const CSS = `
:root{
  --primary:#1E3A5F;--primary-700:#16304f;--on-primary:#FFFFFF;--secondary:#2563EB;
  --accent:#059669;--accent-700:#047857;--bg:#F8FAFC;--fg:#0F172A;--muted:#F1F3F5;
  --muted-fg:#64748B;--border:#E4E7EB;--destructive:#DC2626;--radius:14px;--maxw:1200px;
  --shadow-sm:0 1px 2px rgba(15,23,42,.06),0 1px 3px rgba(15,23,42,.08);
  --shadow-md:0 4px 12px rgba(15,23,42,.08),0 2px 4px rgba(15,23,42,.04);
  --shadow-lg:0 20px 40px rgba(15,23,42,.12);
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;font-family:"Plus Jakarta Sans",system-ui,-apple-system,sans-serif;color:var(--fg);background:var(--bg);line-height:1.6;-webkit-font-smoothing:antialiased;}
a{color:inherit;text-decoration:none;}
svg{display:block;}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 24px;}
.eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--accent);background:rgba(5,150,105,.08);padding:6px 14px;border-radius:999px;border:1px solid rgba(5,150,105,.18);}
h1,h2,h3{line-height:1.15;letter-spacing:-.02em;margin:0;font-weight:700;}
h1{font-size:clamp(2.2rem,5vw,3.6rem);font-weight:800;}
h2{font-size:clamp(1.8rem,3.5vw,2.6rem);}
h3{font-size:1.2rem;}
p{margin:0;}
.lead{font-size:1.15rem;color:var(--muted-fg);}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-family:inherit;font-weight:600;font-size:1rem;cursor:pointer;padding:14px 26px;border-radius:12px;border:1px solid transparent;transition:transform .2s ease,background .2s ease,box-shadow .2s ease,border-color .2s ease;min-height:48px;}
.btn:focus-visible{outline:3px solid rgba(37,99,235,.5);outline-offset:2px;}
.btn-primary{background:var(--accent);color:#fff;box-shadow:var(--shadow-sm);}
.btn-primary:hover{background:var(--accent-700);transform:translateY(-2px);box-shadow:var(--shadow-md);}
.btn-ghost{background:#fff;color:var(--primary);border-color:var(--border);}
.btn-ghost:hover{border-color:var(--primary);transform:translateY(-2px);}
header{position:sticky;top:0;z-index:100;background:rgba(248,250,252,.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);}
.nav{display:flex;align-items:center;justify-content:space-between;height:70px;}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.2rem;color:var(--primary);}
.brand-mark{width:34px;height:34px;border-radius:9px;background:var(--primary);display:grid;place-items:center;color:#fff;}
.nav-links{display:flex;align-items:center;gap:30px;}
.nav-links a.link{font-weight:500;color:var(--muted-fg);transition:color .2s;}
.nav-links a.link:hover{color:var(--fg);}
.menu-btn{display:none;background:none;border:none;cursor:pointer;padding:8px;color:var(--primary);}
@media (max-width:880px){.nav-links a.link{display:none;}.menu-btn{display:block;}}
.hero{position:relative;overflow:hidden;background:radial-gradient(1200px 500px at 80% -10%,rgba(37,99,235,.10),transparent 60%),radial-gradient(900px 400px at 10% 10%,rgba(5,150,105,.08),transparent 60%);}
.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center;padding:84px 0 72px;}
@media (max-width:920px){.hero-grid{grid-template-columns:1fr;gap:40px;padding:56px 0;}}
.hero h1{margin:22px 0 18px;}
.hero-cta{display:flex;gap:14px;margin-top:30px;flex-wrap:wrap;}
.hero-meta{margin-top:22px;display:flex;align-items:center;gap:10px;color:var(--muted-fg);font-size:.92rem;}
.phone{width:300px;max-width:100%;margin:0 auto;background:#0b1f33;border-radius:38px;padding:12px;box-shadow:var(--shadow-lg);border:1px solid rgba(15,23,42,.2);}
.phone-screen{background:var(--bg);border-radius:28px;overflow:hidden;}
.ps-top{background:var(--primary);color:#fff;padding:18px 16px 14px;}
.ps-top small{opacity:.7;font-size:11px;letter-spacing:.05em;text-transform:uppercase;}
.ps-top .loc{display:flex;align-items:center;gap:7px;font-weight:600;margin-top:4px;}
.ps-photos{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:4px;}
.ps-photos div{aspect-ratio:1;border-radius:6px;}
.pin{background:linear-gradient(135deg,#3b6ea5,#1E3A5F);}
.pin2{background:linear-gradient(135deg,#10b981,#047857);}
.pin3{background:linear-gradient(135deg,#475569,#1e293b);}
.ps-bar{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-top:1px solid var(--border);}
.ps-cam{width:54px;height:54px;border-radius:50%;background:var(--accent);display:grid;place-items:center;color:#fff;box-shadow:0 6px 16px rgba(5,150,105,.4);margin-top:-34px;border:4px solid var(--bg);}
.stats{border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:#fff;}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding:36px 0;text-align:center;}
@media (max-width:680px){.stats-grid{grid-template-columns:repeat(2,1fr);}}
.stat .num{font-size:2rem;font-weight:800;color:var(--primary);}
.stat .lbl{color:var(--muted-fg);font-size:.92rem;}
section{padding:84px 0;}
.sec-head{max-width:680px;margin:0 auto 56px;text-align:center;}
.sec-head h2{margin:16px 0 14px;}
.features{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
@media (max-width:920px){.features{grid-template-columns:repeat(2,1fr);}}
@media (max-width:600px){.features{grid-template-columns:1fr;}}
.card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:28px;box-shadow:var(--shadow-sm);transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;}
.card:hover{transform:translateY(-4px);box-shadow:var(--shadow-md);border-color:#cbd5e1;}
.ficon{width:48px;height:48px;border-radius:12px;display:grid;place-items:center;background:rgba(30,58,95,.07);color:var(--primary);margin-bottom:18px;}
.card h3{margin-bottom:8px;}
.card p{color:var(--muted-fg);font-size:.96rem;}
.how{background:#fff;}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
@media (max-width:920px){.steps{grid-template-columns:repeat(2,1fr);}}
@media (max-width:520px){.steps{grid-template-columns:1fr;}}
.step{position:relative;padding-top:8px;}
.step .n{width:44px;height:44px;border-radius:12px;background:var(--primary);color:#fff;font-weight:700;display:grid;place-items:center;margin-bottom:16px;}
.step h3{font-size:1.05rem;margin-bottom:6px;}
.step p{color:var(--muted-fg);font-size:.93rem;}
.shots{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
@media (max-width:820px){.shots{grid-template-columns:1fr;}}
.shot{border-radius:var(--radius);overflow:hidden;border:1px solid var(--border);background:#fff;box-shadow:var(--shadow-sm);}
.shot-top{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;font-weight:600;}
.shot-body{padding:0;height:300px;position:relative;}
.map-bg{width:100%;height:100%;background:linear-gradient(rgba(30,58,95,.04) 1px,transparent 1px) 0 0/26px 26px,linear-gradient(90deg,rgba(30,58,95,.04) 1px,transparent 1px) 0 0/26px 26px,#eef2f6;position:relative;}
.mappin{position:absolute;width:18px;height:18px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:var(--shadow-sm);}
.grid-photos{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:14px;}
.grid-photos div{aspect-ratio:1;border-radius:8px;}
.note-row{display:flex;gap:10px;padding:14px;align-items:flex-start;border-bottom:1px solid var(--border);}
.note-thumb{width:46px;height:46px;border-radius:8px;flex:none;}
.note-row p{font-size:.85rem;color:var(--muted-fg);}
.ai-chip{display:inline-block;font-size:11px;font-weight:600;color:var(--secondary);background:rgba(37,99,235,.1);padding:2px 8px;border-radius:6px;margin-bottom:4px;}
.pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;align-items:stretch;}
@media (max-width:880px){.pricing{grid-template-columns:1fr;max-width:460px;margin:0 auto;}}
.plan{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:30px;display:flex;flex-direction:column;box-shadow:var(--shadow-sm);}
.plan.pop{border-color:var(--accent);box-shadow:0 10px 30px rgba(5,150,105,.15);position:relative;}
.plan.pop::before{content:"Most popular";position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;font-size:12px;font-weight:600;padding:5px 14px;border-radius:999px;}
.plan h3{font-size:1.15rem;}
.price{font-size:2.4rem;font-weight:800;color:var(--primary);margin:12px 0 2px;}
.price span{font-size:1rem;font-weight:500;color:var(--muted-fg);}
.plan ul{list-style:none;padding:0;margin:20px 0 26px;display:grid;gap:11px;}
.plan li{display:flex;gap:10px;align-items:flex-start;font-size:.94rem;color:#334155;}
.plan li svg{flex:none;margin-top:3px;color:var(--accent);}
.plan .btn{margin-top:auto;width:100%;}
.tests{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
@media (max-width:880px){.tests{grid-template-columns:1fr;}}
.quote{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:28px;box-shadow:var(--shadow-sm);}
.quote p{font-size:1rem;color:#1e293b;}
.stars{color:#f59e0b;margin-bottom:14px;letter-spacing:2px;}
.who{display:flex;align-items:center;gap:12px;margin-top:20px;}
.avatar{width:44px;height:44px;border-radius:50%;background:var(--primary);color:#fff;display:grid;place-items:center;font-weight:700;}
.who .nm{font-weight:600;font-size:.95rem;}
.who .rl{font-size:.85rem;color:var(--muted-fg);}
.cta-band{background:var(--primary);color:#fff;border-radius:24px;padding:56px;text-align:center;}
.cta-band h2{color:#fff;}
.cta-band p{color:rgba(255,255,255,.8);max-width:540px;margin:14px auto 28px;}
.badges{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
.store{display:flex;align-items:center;gap:10px;background:#0b1f33;border:1px solid rgba(255,255,255,.18);padding:10px 18px;border-radius:12px;transition:transform .2s,border-color .2s;}
.store:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.4);}
.store small{display:block;font-size:10px;opacity:.7;text-transform:uppercase;letter-spacing:.05em;}
.store strong{font-size:1rem;}
footer{background:#0b1f33;color:#cbd5e1;padding:56px 0 30px;margin-top:84px;}
.foot-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:36px;}
@media (max-width:760px){.foot-grid{grid-template-columns:1fr 1fr;}}
footer h4{color:#fff;font-size:.95rem;margin:0 0 14px;}
footer a.fl{display:block;color:#94a3b8;padding:5px 0;font-size:.92rem;transition:color .2s;}
footer a.fl:hover{color:#fff;}
footer .brand{color:#fff;}
footer .brand-mark{background:#fff;color:var(--primary);}
.foot-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:22px;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;color:#64748b;font-size:.85rem;}
@media (prefers-reduced-motion:reduce){*{transition:none !important;scroll-behavior:auto !important;}}
`;
