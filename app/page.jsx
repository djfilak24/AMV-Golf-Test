'use client';

import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   STYLE INJECTION
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #0A0F0A; color: #FAF8F5; font-family: 'Sora', sans-serif; overflow-x: hidden; }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.7); }
    }
    @keyframes scan-line {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(400%); }
    }
    @keyframes slow-rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes dash-offset {
      from { stroke-dashoffset: 200; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes cursor-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes glow-pulse {
      0%, 100% { box-shadow: 0 0 20px rgba(194,90,42,0.3); }
      50% { box-shadow: 0 0 40px rgba(194,90,42,0.6), 0 0 80px rgba(194,90,42,0.2); }
    }

    ::selection { background: rgba(194,90,42,0.3); color: #FAF8F5; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0A0F0A; }
    ::-webkit-scrollbar-thumb { background: #C25A2A; border-radius: 2px; }
  `}</style>
);

/* ─────────────────────────────────────────────
   NOISE OVERLAY
───────────────────────────────────────────── */
const NoiseOverlay = () => (
  <div style={{ position:'fixed', inset:0, zIndex:9999, pointerEvents:'none', opacity:0.04 }}>
    <svg width="100%" height="100%">
      <filter id="noise">
        <feTurbulence baseFrequency="0.65" numOctaves="4" stitchTiles="stitch"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)"/>
    </svg>
  </div>
);

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.12, ...options }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, isVisible];
};

const useParallax = () => {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let ticking = false;
    const handle = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setOffset(window.scrollY); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);
  return offset;
};

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────── */
const MagneticButton = ({ children, primary, onClick, style = {} }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: primary ? '1rem 2.2rem' : '0.9rem 2rem',
        borderRadius: '9999px',
        fontFamily: "'Sora', sans-serif",
        fontWeight: 600,
        fontSize: '0.9rem',
        letterSpacing: '0.04em',
        cursor: 'pointer',
        border: primary ? 'none' : '1px solid rgba(194,90,42,0.4)',
        background: primary ? (hovered ? '#d4b35a' : '#C25A2A') : 'transparent',
        color: primary ? '#0A0F0A' : '#C25A2A',
        transform: hovered ? 'scale(1.04) translateY(-1px)' : 'scale(1) translateY(0)',
        boxShadow: primary
          ? (hovered ? '0 8px 30px rgba(194,90,42,0.5)' : '0 4px 15px rgba(194,90,42,0.25)')
          : (hovered ? '0 0 20px rgba(194,90,42,0.2)' : 'none'),
        transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        ...style
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav style={{
      position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)',
      zIndex: 1000, maxWidth: '900px', width: 'calc(100% - 2rem)',
      padding: '0.75rem 1.5rem', borderRadius: '9999px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(13,13,18,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      border: scrolled ? '1px solid rgba(194,90,42,0.15)' : '1px solid transparent',
      boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
        <svg viewBox="0 0 28 28" fill="none" width="24" height="24">
          <rect x="2" y="6" width="5" height="16" fill="#C25A2A"/>
          <rect x="9" y="2" width="5" height="24" fill="#C25A2A"/>
          <rect x="16" y="8" width="5" height="12" fill="#C25A2A"/>
          <rect x="23" y="4" width="4" height="20" fill="rgba(194,90,42,0.4)"/>
        </svg>
        <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'1rem', color:'#FAF8F5', letterSpacing:'0.12em' }}>AMV Golf</span>
      </div>
      <div style={{ display:'flex', gap:'2rem', alignItems:'center' }}>
        {['Products','Custom','Process','Pricing'].map(l => (
          <button key={l} onClick={() => scroll(l.toLowerCase())}
            style={{ background:'none', border:'none', cursor:'pointer', color:'#FAF8F5',
              fontFamily:"'Sora',sans-serif", fontSize:'0.85rem', fontWeight:400,
              letterSpacing:'0.06em', opacity:0.65, transition:'all 0.2s' }}
            onMouseEnter={e => { e.target.style.opacity=1; e.target.style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { e.target.style.opacity=0.65; e.target.style.transform='translateY(0)'; }}
          >{l}</button>
        ))}
        <MagneticButton primary onClick={() => scroll('custom')} style={{ fontSize:'0.8rem', padding:'0.65rem 1.5rem' }}>
          Order Custom
        </MagneticButton>
      </div>
    </nav>
  );
};

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const parallax = useParallax();
  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t); }, []);

  const fadeIn = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  return (
    <section id="hero" style={{
      minHeight: '100dvh', position: 'relative',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      paddingBottom: '12vh',
      paddingLeft: 'clamp(1.5rem, 5vw, 5rem)',
      paddingRight: 'clamp(1.5rem, 5vw, 5rem)',
      overflow: 'hidden',
      background: `
        radial-gradient(ellipse 80% 60% at 65% 40%, rgba(74,110,58,0.12) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 20% 80%, rgba(194,90,42,0.07) 0%, transparent 50%),
        linear-gradient(160deg, #0A0F0A 0%, #0e1510 50%, #080d08 100%)
      `,
    }}>
      <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none',
        transform: `translateY(${parallax * 0.15}px)`, transition:'transform 0.1s linear' }}>
        <svg style={{ position:'absolute', right:'-5%', top:'8%', width:'55vw', maxWidth:'700px', opacity:0.07 }} viewBox="0 0 600 600">
          <polygon points="300,30 570,150 570,450 300,570 30,450 30,150" stroke="#4a6e3a" strokeWidth="1.5" fill="none"/>
          <polygon points="300,80 520,185 520,415 300,520 80,415 80,185" stroke="#4a6e3a" strokeWidth="0.8" fill="none"/>
          <polygon points="300,130 470,220 470,380 300,470 130,380 130,220" stroke="#C25A2A" strokeWidth="0.4" fill="none"/>
        </svg>
        <svg style={{ position:'absolute', left:0, top:0, width:'100%', height:'100%', opacity:0.03 }} viewBox="0 0 1440 900" preserveAspectRatio="none">
          {Array.from({length:12}).map((_,i) => <line key={`v${i}`} x1={i*130} y1="0" x2={i*130} y2="900" stroke="#4a6e3a" strokeWidth="0.5"/>)}
          {Array.from({length:8}).map((_,i) => <line key={`h${i}`} x1="0" y1={i*130} x2="1440" y2={i*130} stroke="#4a6e3a" strokeWidth="0.5"/>)}
        </svg>
      </div>

      <div style={{ ...fadeIn(0.2), marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
        <div style={{ width:32, height:1, background:'#C25A2A' }}/>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.7rem', letterSpacing:'0.15em', color:'#C25A2A', textTransform:'uppercase' }}>
          CNC Laser-Cut · Powder Coated · Made to Order
        </span>
      </div>

      <div style={{ maxWidth:'900px' }}>
        <div style={fadeIn(0.35)}>
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'clamp(1.4rem, 3vw, 2.2rem)', letterSpacing:'-0.02em', color:'rgba(250,248,245,0.75)', display:'block', marginBottom:'0.25rem' }}>
            Metal products made for
          </span>
        </div>
        <div style={fadeIn(0.5)}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', fontWeight:700, fontSize:'clamp(3.5rem, 9vw, 8rem)', letterSpacing:'-0.03em', lineHeight:0.9, color:'#FAF8F5', display:'block' }}>
            the{' '}
            <span style={{ color:'#C25A2A', textShadow:'0 0 60px rgba(194,90,42,0.4)' }}>Fairway.</span>
          </span>
        </div>
      </div>

      <div style={{ ...fadeIn(0.65), maxWidth:'520px', marginTop:'2rem' }}>
        <p style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(1rem,1.5vw,1.15rem)', lineHeight:1.7, color:'rgba(250,248,245,0.6)', fontWeight:300 }}>
          Premium CNC-precision metal signage and course accessories engineered for clubs that demand their infrastructure match their standards.
        </p>
      </div>

      <div style={{ ...fadeIn(0.8), marginTop:'2.5rem', display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center' }}>
        <MagneticButton primary onClick={() => document.getElementById('custom')?.scrollIntoView({behavior:'smooth'})}>
          Start Custom Order →
        </MagneticButton>
        <MagneticButton onClick={() => document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}>
          Browse Products
        </MagneticButton>
      </div>

      <div style={{ ...fadeIn(1.1), position:'absolute', bottom:'2.5rem', right:'clamp(1.5rem,5vw,5rem)', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem' }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.6rem', letterSpacing:'0.15em', color:'rgba(250,248,245,0.3)', textTransform:'uppercase', writingMode:'vertical-lr' }}>Scroll</span>
        <div style={{ width:1, height:48, background:'linear-gradient(to bottom, rgba(194,90,42,0.6), transparent)' }}/>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FEATURE CARDS
───────────────────────────────────────────── */
const ShufflerCard = () => {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const cards = [
    { label:'Tee Box Signs', sub:'Hole number · yardage · club logo', mat:'Corten Steel' },
    { label:'Entry Monuments', sub:'Laser-cut club crest · brushed finish', mat:'Brushed Stainless' },
    { label:'Wayfinding Panels', sub:'Directional · cart path · facility', mat:'Matte Black' },
  ];
  useEffect(() => {
    const t = setInterval(() => {
      setActive(p => { setPrev(p); return (p+1) % cards.length; });
    }, 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position:'relative', height:160 }}>
      {/* Ghost cards behind for depth — no text, just borders */}
      {[1, 2].map(offset => {
        const idx = (active + offset) % cards.length;
        return (
          <div key={`ghost-${offset}`} style={{
            position:'absolute', inset:0,
            background:'rgba(28,38,25,0.6)',
            border:'1px solid rgba(194,90,42,0.08)',
            borderRadius:'1.5rem',
            transform:`translateY(${offset * 8}px) scale(${1 - offset * 0.03})`,
            zIndex: 3 - offset,
          }}/>
        );
      })}
      {/* Active card — full content */}
      <div style={{
        position:'absolute', inset:0,
        background:'linear-gradient(135deg, rgba(194,90,42,0.12) 0%, rgba(10,15,10,0.6) 100%)',
        border:'1px solid rgba(194,90,42,0.3)',
        borderRadius:'1.5rem', padding:'1.5rem',
        zIndex:5,
        boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
        transition:'all 0.5s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.65rem', color:'#C25A2A', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.6rem' }}>{cards[active].mat}</div>
        <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'1.25rem', color:'#FAF8F5', marginBottom:'0.4rem' }}>{cards[active].label}</div>
        <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'0.82rem', color:'rgba(250,248,245,0.55)', lineHeight:1.5 }}>{cards[active].sub}</div>
        <div style={{ position:'absolute', bottom:'1.25rem', right:'1.25rem', display:'flex', gap:'0.3rem' }}>
          {cards.map((_,j) => (
            <div key={j} style={{ width:j===active?18:5, height:3, borderRadius:9999, background:j===active?'#C25A2A':'rgba(194,90,42,0.25)', transition:'all 0.4s ease' }}/>
          ))}
        </div>
      </div>
    </div>
  );
};

const TypewriterCard = () => {
  const messages = [
    "Proof delivered within 24 hours of order.",
    "Upload your vector — receive CAD-ready design.",
    "Approve digitally. We cut and ship next day.",
    "Custom color match via RAL powder coat system.",
  ];
  const [msgIdx, setMsgIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const current = messages[msgIdx];
    if (!isDeleting && charIdx < current.length) {
      const t = setTimeout(() => { setDisplayed(current.slice(0, charIdx+1)); setCharIdx(c=>c+1); }, 35);
      return () => clearTimeout(t);
    } else if (!isDeleting && charIdx === current.length) {
      const t = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(t);
    } else if (isDeleting && charIdx > 0) {
      const t = setTimeout(() => { setDisplayed(current.slice(0, charIdx-1)); setCharIdx(c=>c-1); }, 18);
      return () => clearTimeout(t);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setMsgIdx(m => (m+1) % messages.length);
    }
  }, [charIdx, isDeleting, msgIdx]);
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#4ade80', animation:'pulse-dot 2s ease-in-out infinite' }}/>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.65rem', color:'#4ade80', letterSpacing:'0.12em', textTransform:'uppercase' }}>Live Proof Feed</span>
      </div>
      <div style={{ background:'rgba(0,0,0,0.4)', border:'1px solid rgba(194,90,42,0.1)', borderRadius:'1rem', padding:'1.1rem', minHeight:'72px', display:'flex', alignItems:'center' }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.85rem', color:'#C25A2A', lineHeight:1.6 }}>
          {displayed}<span style={{ animation:'cursor-blink 0.8s step-end infinite', color:'#C25A2A' }}>|</span>
        </span>
      </div>
      <div style={{ marginTop:'0.75rem', display:'flex', gap:'0.4rem' }}>
        {['Upload','Proof','Approve','Ship'].map((step, i) => (
          <div key={step} style={{ flex:1, textAlign:'center', padding:'0.35rem 0.15rem', borderRadius:'0.5rem',
            background: i===msgIdx ? 'rgba(194,90,42,0.15)' : 'rgba(255,255,255,0.03)',
            border: i===msgIdx ? '1px solid rgba(194,90,42,0.3)' : '1px solid rgba(255,255,255,0.05)',
            transition:'all 0.3s ease' }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.58rem', color:i===msgIdx?'#C25A2A':'rgba(250,248,245,0.3)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SchedulerCard = () => {
  const signs = ['Hole 1','Hole 2','Hole 3','Club →','Cart ↺','Pro Shop'];
  const [activeIdx, setActiveIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let idx = 0; let saveCycle = false;
    const cycle = () => {
      if (saveCycle) { setSaved(true); setTimeout(() => { setSaved(false); saveCycle=false; cycle(); }, 1400); return; }
      idx = (idx+1) % signs.length; setActiveIdx(idx);
      if (idx === signs.length-1) saveCycle = true;
      setTimeout(cycle, 750);
    };
    const t = setTimeout(cycle, 600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.4rem', marginBottom:'0.75rem' }}>
        {signs.map((s,i) => (
          <div key={i} style={{ padding:'0.6rem 0.4rem', borderRadius:'0.7rem',
            background: i===activeIdx ? 'rgba(194,90,42,0.18)' : 'rgba(255,255,255,0.03)',
            border: i===activeIdx ? '1px solid rgba(194,90,42,0.5)' : '1px solid rgba(255,255,255,0.06)',
            textAlign:'center',
            transform: i===activeIdx ? 'scale(0.95)' : 'scale(1)',
            transition:'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: i===activeIdx ? '0 0 15px rgba(194,90,42,0.2)' : 'none' }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.65rem', color:i===activeIdx?'#C25A2A':'rgba(250,248,245,0.4)', textTransform:'uppercase', letterSpacing:'0.04em' }}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <div style={{ padding:'0.5rem 1.2rem', borderRadius:'9999px',
          background: saved ? '#C25A2A' : 'rgba(194,90,42,0.1)',
          border:'1px solid rgba(194,90,42,0.3)',
          transition:'all 0.4s ease',
          animation: saved ? 'glow-pulse 0.6s ease' : 'none' }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.65rem', color:saved?'#0A0F0A':'#C25A2A', letterSpacing:'0.1em', textTransform:'uppercase' }}>
            {saved ? '✓ Layout Saved' : 'Save Layout'}
          </span>
        </div>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const [ref, isVisible] = useScrollReveal();
  const features = [
    { title:'Precision Products', desc:'From tee box signs to entry monuments — CNC laser-cut to ±0.1mm tolerance.', component:<ShufflerCard/> },
    { title:'24-Hour Proof', desc:'Upload your logo. Receive a CAD-ready proof within one business day. Approve digitally.', component:<TypewriterCard/> },
    { title:'Course Layout System', desc:'Full-course signage packages. One cohesive identity, every stake, post, and panel.', component:<SchedulerCard/> },
  ];
  return (
    <section id="products" ref={ref} style={{ padding:'clamp(4rem,8vw,8rem) clamp(1.5rem,5vw,5rem)', background:'linear-gradient(180deg, #0A0F0A 0%, #0c1209 100%)' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ opacity:isVisible?1:0, transform:isVisible?'translateY(0)':'translateY(30px)', transition:'opacity 0.8s ease, transform 0.8s ease', marginBottom:'3.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
            <div style={{ width:24, height:1, background:'#C25A2A' }}/>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.7rem', letterSpacing:'0.15em', color:'#C25A2A', textTransform:'uppercase' }}>Core Offering</span>
          </div>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'clamp(2rem,4vw,3rem)', letterSpacing:'-0.03em', color:'#FAF8F5', maxWidth:'600px', lineHeight:1.15 }}>
            Built for courses that{' '}
            <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', color:'#C25A2A' }}>don't compromise.</span>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1.25rem' }}>
          {features.map((f,i) => (
            <div key={i} style={{
              background:'rgba(28,38,25,0.4)', border:'1px solid rgba(194,90,42,0.1)',
              borderRadius:'2rem', padding:'2rem', backdropFilter:'blur(10px)',
              opacity:isVisible?1:0, transform:isVisible?'translateY(0)':'translateY(40px)',
              transition:`opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${0.15+i*0.12}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${0.15+i*0.12}s`,
              boxShadow:'0 4px 24px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor='rgba(194,90,42,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor='rgba(194,90,42,0.1)'; }}
            >
              <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'1.1rem', color:'#FAF8F5', marginBottom:'0.45rem' }}>{f.title}</h3>
              <p style={{ fontFamily:"'Sora',sans-serif", fontSize:'0.83rem', color:'rgba(250,248,245,0.5)', lineHeight:1.6, marginBottom:'1.5rem' }}>{f.desc}</p>
              {f.component}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PHILOSOPHY
───────────────────────────────────────────── */
const PhilosophySection = () => {
  const [ref, isVisible] = useScrollReveal();
  const words = ["Every","course","deserves","signage","that","matches","its","architecture."];
  return (
    <section style={{
      padding:'clamp(5rem,10vw,10rem) clamp(1.5rem,5vw,5rem)', position:'relative', overflow:'hidden',
      background:`radial-gradient(ellipse 70% 50% at 50% 50%, rgba(74,110,58,0.08) 0%, transparent 70%), linear-gradient(180deg, #0c1209 0%, #0A0F0A 100%)`,
    }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.035 }}>
        <svg width="100%" height="100%" style={{ position:'absolute' }}>
          {Array.from({length:22}).map((_,i) => <line key={i} x1={`${i*4.8}%`} y1="0" x2={`${i*4.8}%`} y2="100%" stroke="#4a6e3a" strokeWidth="0.5"/>)}
        </svg>
      </div>
      <div ref={ref} style={{ maxWidth:'1000px', margin:'0 auto', position:'relative' }}>
        <div style={{ opacity:isVisible?1:0, transform:isVisible?'translateY(0)':'translateY(20px)', transition:'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s', marginBottom:'3rem' }}>
          <p style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(1rem,1.5vw,1.2rem)', color:'rgba(250,248,245,0.4)', lineHeight:1.8, maxWidth:'700px' }}>
            Most fabrication shops treat golf signage as an afterthought — raw steel, off-the-shelf mounts, generic designs that cheapen the experience.
          </p>
        </div>
        <div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:'1rem', marginBottom:'0.75rem' }}>
            <div style={{ width:3, minHeight:'3rem', background:'#C25A2A', borderRadius:9999, flexShrink:0, marginTop:'0.6rem' }}/>
            <p style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(0.9rem,1.2vw,1rem)', color:'rgba(250,248,245,0.5)', lineHeight:1.7 }}>We focus on:</p>
          </div>
          <div style={{ paddingLeft:'1.75rem' }}>
            {words.map((w,i) => (
              <span key={i} style={{
                display:'inline-block', marginRight:'0.4rem', marginBottom:'0.2rem',
                fontFamily: w==="architecture." ? "'Playfair Display',serif" : "'Sora',sans-serif",
                fontStyle: w==="architecture." ? "italic" : "normal",
                fontWeight:700,
                fontSize:'clamp(2rem,5vw,4rem)',
                letterSpacing:'-0.02em', lineHeight:1.1,
                color: w==="architecture." ? '#C25A2A' : '#FAF8F5',
                opacity:isVisible?1:0,
                transform:isVisible?'translateY(0)':'translateY(30px)',
                transition:`opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${0.3+i*0.06}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.3+i*0.06}s`,
                textShadow: w==="architecture." ? '0 0 60px rgba(194,90,42,0.3)' : 'none',
              }}>{w}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PROCESS STEPS
───────────────────────────────────────────── */
const ProcessSection = () => {
  const r0 = useScrollReveal();
  const r1 = useScrollReveal();
  const r2 = useScrollReveal();
  const refs = [r0, r1, r2];

  const steps = [
    {
      num:'01', title:'Upload & Configure',
      desc:'Submit your club logo and select product type, material, finish, and dimensions through our streamlined order portal.',
      motif: (
        <svg width="72" height="72" viewBox="0 0 72 72" style={{ animation:'slow-rotate 12s linear infinite', opacity:0.5, flexShrink:0 }}>
          <polygon points="36,4 67,20 67,52 36,68 5,52 5,20" stroke="#C25A2A" strokeWidth="1.5" fill="none"/>
          <polygon points="36,14 57,26 57,46 36,58 15,46 15,26" stroke="#4a6e3a" strokeWidth="0.8" fill="none" opacity="0.5"/>
          <circle cx="36" cy="36" r="4" fill="#C25A2A" opacity="0.6"/>
        </svg>
      ),
    },
    {
      num:'02', title:'Proof & Approve',
      desc:'Receive a photorealistic CAD proof within 24 hours. Request revisions or approve — then we move to production.',
      motif: (
        <div style={{ width:72, height:40, position:'relative', overflow:'hidden', borderRadius:'0.5rem', background:'rgba(194,90,42,0.03)', border:'1px solid rgba(194,90,42,0.1)', flexShrink:0 }}>
          <div style={{ position:'absolute', top:0, bottom:0, width:'40%', background:'linear-gradient(to right, transparent, rgba(194,90,42,0.3), transparent)', animation:'scan-line 2.5s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(8,1fr)' }}>
            {Array.from({length:8}).map((_,i) => <div key={i} style={{ borderRight:'1px solid rgba(194,90,42,0.08)' }}/>)}
          </div>
        </div>
      ),
    },
    {
      num:'03', title:'Cut, Coat & Ship',
      desc:'Your order is CNC laser-cut, powder coated in your specified RAL color, and shipped directly to the course.',
      motif: (
        <svg width="120" height="36" viewBox="0 0 160 40" style={{ flexShrink:0 }}>
          <path d="M0,20 Q20,5 40,20 Q60,35 80,20 Q100,5 120,20 Q140,35 160,20" stroke="#C25A2A" strokeWidth="2" fill="none" opacity="0.6"
            style={{ strokeDasharray:200, animation:'dash-offset 2s ease-in-out infinite alternate' }}/>
          <path d="M0,20 Q20,8 40,20 Q60,32 80,20 Q100,8 120,20 Q140,32 160,20" stroke="#C25A2A" strokeWidth="1" fill="none" opacity="0.25"/>
        </svg>
      ),
    },
  ];

  return (
    <section id="process" style={{ padding:'clamp(4rem,8vw,8rem) clamp(1.5rem,5vw,5rem)', background:'linear-gradient(180deg, #0A0F0A 0%, #091008 100%)' }}>
      <div style={{ maxWidth:'900px', margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
          <div style={{ width:24, height:1, background:'#C25A2A' }}/>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.7rem', letterSpacing:'0.15em', color:'#C25A2A', textTransform:'uppercase' }}>The Process</span>
        </div>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'clamp(2rem,4vw,3rem)', letterSpacing:'-0.03em', color:'#FAF8F5', marginBottom:'3.5rem', lineHeight:1.15 }}>
          From concept to{' '}
          <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', color:'#C25A2A' }}>course-ready.</span>
        </h2>
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          {steps.map((s,i) => (
            <div key={i} ref={refs[i][0]} style={{
              opacity:refs[i][1]?1:0, transform:refs[i][1]?'translateY(0)':'translateY(40px)',
              transition:`opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${i*0.1}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i*0.1}s`,
              background:'rgba(28,38,25,0.3)', border:'1px solid rgba(194,90,42,0.1)',
              borderRadius:'2rem', padding:'clamp(1.5rem,3vw,2.5rem)',
              display:'flex', gap:'2rem', alignItems:'center',
              backdropFilter:'blur(8px)',
            }}>
              <div style={{ flexShrink:0 }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'2.5rem', fontWeight:500, color:'rgba(194,90,42,0.12)', lineHeight:1, marginBottom:'0.75rem' }}>{s.num}</div>
                {s.motif}
              </div>
              <div>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'1.25rem', color:'#FAF8F5', marginBottom:'0.5rem' }}>{s.title}</h3>
                <p style={{ fontFamily:"'Sora',sans-serif", fontSize:'0.88rem', color:'rgba(250,248,245,0.5)', lineHeight:1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   CUSTOM ORDER
───────────────────────────────────────────── */
const CustomSection = () => {
  const [ref, isVisible] = useScrollReveal();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ product:'', material:'', club:'', color:'' });

  const products = ['Tee Box Signs','Directional Signs','Entry Monument','Bag Rack','Course Logo Panel','Custom Design'];
  const materials = ['Corten Steel','Matte Black Powder Coat','Brushed Stainless','Gloss White Powder Coat'];

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
      padding:'0.55rem 1rem', borderRadius:'9999px', cursor:'pointer',
      background: active ? 'rgba(194,90,42,0.2)' : 'rgba(255,255,255,0.04)',
      border:`1px solid ${active ? 'rgba(194,90,42,0.5)' : 'rgba(255,255,255,0.08)'}`,
      color: active ? '#C25A2A' : 'rgba(250,248,245,0.5)',
      fontFamily:"'Sora',sans-serif", fontSize:'0.8rem',
      fontWeight: active ? 600 : 400,
      transition:'all 0.25s ease',
    }}>{label}</button>
  );

  return (
    <section id="custom" ref={ref} style={{
      padding:'clamp(4rem,8vw,8rem) clamp(1.5rem,5vw,5rem)',
      background:`radial-gradient(ellipse 60% 50% at 50% 0%, rgba(74,110,58,0.09) 0%, transparent 60%), linear-gradient(180deg, #091008 0%, #0A0F0A 100%)`,
    }}>
      <div style={{ maxWidth:'780px', margin:'0 auto' }}>
        <div style={{ opacity:isVisible?1:0, transform:isVisible?'translateY(0)':'translateY(30px)', transition:'opacity 0.8s ease, transform 0.8s ease', marginBottom:'3rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
            <div style={{ width:24, height:1, background:'#C25A2A' }}/>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.7rem', letterSpacing:'0.15em', color:'#C25A2A', textTransform:'uppercase' }}>Custom Order</span>
          </div>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'clamp(2rem,4vw,3rem)', letterSpacing:'-0.03em', color:'#FAF8F5', lineHeight:1.15 }}>
            Your logo. Your finish.{' '}
            <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', color:'#C25A2A' }}>Your course.</span>
          </h2>
        </div>

        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'2.5rem', opacity:isVisible?1:0, transition:'opacity 0.8s ease 0.2s' }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <div style={{ width:28, height:28, borderRadius:'50%',
                background: s<=step ? '#C25A2A' : 'rgba(255,255,255,0.06)',
                border:`1px solid ${s<=step ? '#C25A2A' : 'rgba(255,255,255,0.1)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:"'JetBrains Mono',monospace", fontSize:'0.65rem',
                color: s<=step ? '#0A0F0A' : 'rgba(250,248,245,0.3)',
                fontWeight:700, transition:'all 0.3s ease' }}>
                {s}
              </div>
              {s<3 && <div style={{ width:36, height:1, background:s<step?'#C25A2A':'rgba(255,255,255,0.08)', transition:'all 0.3s ease' }}/>}
            </div>
          ))}
        </div>

        <div style={{ background:'rgba(28,38,25,0.35)', border:'1px solid rgba(194,90,42,0.1)', borderRadius:'2rem', padding:'clamp(1.5rem,3vw,2.5rem)', backdropFilter:'blur(10px)', opacity:isVisible?1:0, transition:'opacity 0.8s ease 0.3s' }}>
          {step===1 && (
            <div>
              <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:'0.88rem', color:'rgba(250,248,245,0.7)', marginBottom:'1.25rem' }}>01 — Select product type</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'2rem' }}>
                {products.map(p => <Chip key={p} label={p} active={form.product===p} onClick={() => setForm(f=>({...f,product:p}))}/>)}
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <MagneticButton primary onClick={() => form.product && setStep(2)} style={{ opacity:form.product?1:0.4 }}>Continue →</MagneticButton>
              </div>
            </div>
          )}
          {step===2 && (
            <div>
              <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:'0.88rem', color:'rgba(250,248,245,0.7)', marginBottom:'1.25rem' }}>02 — Select material & finish</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'2rem' }}>
                {materials.map(m => <Chip key={m} label={m} active={form.material===m} onClick={() => setForm(f=>({...f,material:m}))}/>)}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <button onClick={() => setStep(1)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(250,248,245,0.4)', fontFamily:"'Sora',sans-serif", fontSize:'0.85rem' }}>← Back</button>
                <MagneticButton primary onClick={() => form.material && setStep(3)} style={{ opacity:form.material?1:0.4 }}>Continue →</MagneticButton>
              </div>
            </div>
          )}
          {step===3 && (
            <div>
              <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:'0.88rem', color:'rgba(250,248,245,0.7)', marginBottom:'1.25rem' }}>03 — Club details & submit</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem', marginBottom:'1.5rem' }}>
                {[['club','Club name'],['color','Preferred RAL color (or "advise me")']].map(([key,ph]) => (
                  <input key={key} value={form[key]} onChange={e => setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph}
                    style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(194,90,42,0.2)', borderRadius:'1rem', padding:'0.9rem 1.2rem', color:'#FAF8F5', fontFamily:"'Sora',sans-serif", fontSize:'0.88rem', outline:'none', width:'100%' }}/>
                ))}
              </div>
              <div style={{ background:'rgba(194,90,42,0.06)', border:'1px solid rgba(194,90,42,0.15)', borderRadius:'1rem', padding:'0.9rem 1.1rem', marginBottom:'1.5rem' }}>
                <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.68rem', color:'#C25A2A', letterSpacing:'0.1em' }}>
                  ORDER SUMMARY · {form.product} · {form.material}
                </p>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <button onClick={() => setStep(2)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(250,248,245,0.4)', fontFamily:"'Sora',sans-serif", fontSize:'0.85rem' }}>← Back</button>
                <MagneticButton primary onClick={() => { alert('Request received. Proof delivered within 24 hours.'); setStep(1); setForm({product:'',material:'',club:'',color:''}); }}>
                  Submit for Proof →
                </MagneticButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PRICING
───────────────────────────────────────────── */
const PricingSection = () => {
  const [ref, isVisible] = useScrollReveal();
  const tiers = [
    { name:'Signature', tag:'Single Pieces', price:'From $120', desc:'Individual custom-fabricated signs for any application.',
      items:['Tee box signs','Directional signs','Cart path markers','24hr proof turnaround','Any finish / RAL color'] },
    { name:'Course Package', tag:'Full System', price:'From $6,000', desc:'Complete cohesive signage for your full 18-hole layout.', featured:true,
      items:['18 tee box signs','12 directional signs','Cart rule markers','Practice facility signs','Logo panel + install hardware'] },
    { name:'Clubhouse', tag:'Identity + Architecture', price:'Custom Quote', desc:'Large-format metalwork and identity pieces for club renovations.',
      items:['Entry monument logos','Clubhouse feature crests','Donor recognition boards','Hole map panels','Tournament signage'] },
  ];
  return (
    <section id="pricing" ref={ref} style={{ padding:'clamp(4rem,8vw,8rem) clamp(1.5rem,5vw,5rem)', background:'linear-gradient(180deg, #0A0F0A 0%, #091008 100%)' }}>
      <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ opacity:isVisible?1:0, transform:isVisible?'translateY(0)':'translateY(30px)', transition:'opacity 0.8s ease, transform 0.8s ease', marginBottom:'3.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
            <div style={{ width:24, height:1, background:'#C25A2A' }}/>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.7rem', letterSpacing:'0.15em', color:'#C25A2A', textTransform:'uppercase' }}>Pricing</span>
          </div>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'clamp(2rem,4vw,3rem)', letterSpacing:'-0.03em', color:'#FAF8F5', lineHeight:1.15 }}>
            Investment in{' '}
            <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', color:'#C25A2A' }}>permanence.</span>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.25rem' }}>
          {tiers.map((t,i) => (
            <div key={i} style={{
              background: t.featured ? 'rgba(194,90,42,0.08)' : 'rgba(28,38,25,0.3)',
              border:`1px solid ${t.featured ? 'rgba(194,90,42,0.35)' : 'rgba(194,90,42,0.08)'}`,
              borderRadius:'2rem', padding:'2rem', position:'relative', overflow:'hidden',
              opacity:isVisible?1:0, transform:isVisible?'translateY(0)':'translateY(40px)',
              transition:`opacity 0.8s ease ${0.1+i*0.12}s, transform 0.8s ease ${0.1+i*0.12}s`,
              boxShadow: t.featured ? '0 8px 40px rgba(194,90,42,0.12)' : 'none',
            }}>
              {t.featured && (
                <div style={{ position:'absolute', top:'1rem', right:'1rem', background:'#C25A2A', color:'#0A0F0A', fontFamily:"'JetBrains Mono',monospace", fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.3rem 0.7rem', borderRadius:'9999px', fontWeight:700 }}>Popular</div>
              )}
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.62rem', color:'#C25A2A', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.4rem' }}>{t.tag}</div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'1.35rem', color:'#FAF8F5', marginBottom:'0.4rem' }}>{t.name}</div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'0.82rem', color:'rgba(250,248,245,0.45)', lineHeight:1.6, marginBottom:'1.25rem' }}>{t.desc}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', fontSize:'1.9rem', color:t.featured?'#C25A2A':'#FAF8F5', marginBottom:'1.5rem', letterSpacing:'-0.02em' }}>{t.price}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem', marginBottom:'1.75rem' }}>
                {t.items.map((item,j) => (
                  <div key={j} style={{ display:'flex', gap:'0.55rem', alignItems:'flex-start' }}>
                    <span style={{ color:'#C25A2A', flexShrink:0 }}>—</span>
                    <span style={{ fontFamily:"'Sora',sans-serif", fontSize:'0.83rem', color:'rgba(250,248,245,0.6)', lineHeight:1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              <MagneticButton primary={t.featured} onClick={() => document.getElementById('custom')?.scrollIntoView({behavior:'smooth'})} style={{ width:'100%', justifyContent:'center', borderRadius:'1rem' }}>
                {t.featured ? 'Get a Quote →' : 'Start Order'}
              </MagneticButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer = () => (
  <footer style={{ background:'#060d06', borderRadius:'4rem 4rem 0 0', padding:'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,5rem)', marginTop:'2rem' }}>
    <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr', gap:'3rem', marginBottom:'3rem' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1rem' }}>
            <svg viewBox="0 0 28 28" fill="none" width="22" height="22">
              <rect x="2" y="6" width="5" height="16" fill="#C25A2A"/>
              <rect x="9" y="2" width="5" height="24" fill="#C25A2A"/>
              <rect x="16" y="8" width="5" height="12" fill="#C25A2A"/>
            </svg>
            <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'0.95rem', color:'#FAF8F5', letterSpacing:'0.12em' }}>AMV GOLF</span>
          </div>
          <p style={{ fontFamily:"'Sora',sans-serif", fontSize:'0.82rem', color:'rgba(250,248,245,0.35)', lineHeight:1.7, maxWidth:'220px', marginBottom:'1.5rem' }}>
            Architectural metal products engineered for golf courses that demand excellence.
          </p>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#4ade80', animation:'pulse-dot 2s ease-in-out infinite' }}/>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.62rem', color:'rgba(250,248,245,0.3)', letterSpacing:'0.1em' }}>SYSTEM OPERATIONAL</span>
          </div>
        </div>
        {[['Products',['Tee Signs','Directional','Entry Monuments','Bag Racks','Custom']],['Company',['About AMV','Our Process','Gallery','Contact']]].map(([col,items]) => (
          <div key={col}>
            <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.62rem', color:'#C25A2A', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'1rem' }}>{col}</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
              {items.map(item => (
                <a key={item} href="#" style={{ fontFamily:"'Sora',sans-serif", fontSize:'0.83rem', color:'rgba(250,248,245,0.4)', textDecoration:'none', display:'inline-block', transition:'all 0.2s ease' }}
                  onMouseEnter={e => { e.target.style.color='#FAF8F5'; e.target.style.transform='translateY(-1px)'; }}
                  onMouseLeave={e => { e.target.style.color='rgba(250,248,245,0.4)'; e.target.style.transform='translateY(0)'; }}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.62rem', color:'rgba(250,248,245,0.2)', letterSpacing:'0.08em' }}>© 2025 AMV METAL FABRICATION — ALL RIGHTS RESERVED</span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.62rem', color:'rgba(250,248,245,0.2)', letterSpacing:'0.08em' }}>CNC PRECISION · POWDER COATED · COURSE-READY</span>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <>
      <GlobalStyles />
      <NoiseOverlay />
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <PhilosophySection />
        <ProcessSection />
        <CustomSection />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
