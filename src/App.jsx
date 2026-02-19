import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin, Cpu, Skull, Users, ShieldAlert, Eye,
  ChevronRight, ChevronDown, BookOpen, Target, Activity,
  Compass, Quote, History, Workflow, Play, Pause
} from 'lucide-react';
import WorldMap from './WorldMap';
import okImg from '../images/ok.jpg';

// ─── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #000; }
    ::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 9999px; box-shadow: 0 0 6px rgba(37,99,235,0.8); }

    @keyframes glitch {
      0%,84%,100% { clip-path: none; transform: translate(0,0); }
      86% { clip-path: inset(28% 0 52% 0); transform: translate(-4px,0); }
      88% { clip-path: inset(68% 0 12% 0); transform: translate( 4px,0); }
      90% { clip-path: inset(8%  0 82% 0); transform: translate(-3px,0); }
      92% { clip-path: inset(48% 0 32% 0); transform: translate( 3px,0); }
      94% { clip-path: inset(4%  0 88% 0); transform: translate(-2px,0); }
    }
    @keyframes glitch-r {
      0%,84%,100% { clip-path: none; transform: translate(0,0); opacity: 0; }
      86% { clip-path: inset(28% 0 52% 0); transform: translate( 5px,0); opacity:0.5; }
      88% { clip-path: inset(68% 0 12% 0); transform: translate(-5px,0); opacity:0.5; }
      90% { clip-path: inset(8%  0 82% 0); transform: translate( 4px,0); opacity:0.5; }
      92% { clip-path: inset(48% 0 32% 0); transform: translate(-4px,0); opacity:0.5; }
      94% { clip-path: inset(4%  0 88% 0); transform: translate( 2px,0); opacity:0.5; }
    }

    @keyframes float-a { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-28px) scale(1.04);} }
    @keyframes float-b { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-18px) scale(0.97);} }
    @keyframes orb-pulse { 0%,100%{opacity:0.14;} 50%{opacity:0.32;} }
    @keyframes progress-glow { 0%,100%{box-shadow:0 0 6px rgba(96,165,250,0.6);} 50%{box-shadow:0 0 16px rgba(96,165,250,1);} }
    @keyframes caret  { 0%,100%{opacity:1;} 50%{opacity:0;} }
    @keyframes fade-up { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
    @keyframes scan { from{background-position:0 0;} to{background-position:0 100px;} }

    .glitch-text { position:relative; display:inline-block; animation:glitch 7s infinite; }
    .glitch-text::after {
      content: attr(data-text);
      position:absolute; inset:0;
      color:#60a5fa;
      animation:glitch-r 7s infinite;
      pointer-events:none;
    }
    .caret { animation:caret 0.9s step-start infinite; }
    .progress-glow { animation:progress-glow 2s ease-in-out infinite; }
    .orb-a { animation:float-a 7s ease-in-out infinite, orb-pulse 4s ease-in-out infinite; }
    .orb-b { animation:float-b 11s ease-in-out infinite reverse, orb-pulse 6s ease-in-out infinite; }
    .scanlines {
      background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.022) 0px, transparent 1px, transparent 3px);
      background-size: 100% 4px;
      animation: scan 10s linear infinite;
    }

    /* Scroll-reveal system */
    .reveal-wrap { }
    .reveal-child { opacity:0; }
    .revealed .reveal-child { animation:fade-up 0.65s ease forwards; }
    .revealed .d1{animation-delay:0.04s;}
    .revealed .d2{animation-delay:0.12s;}
    .revealed .d3{animation-delay:0.20s;}
    .revealed .d4{animation-delay:0.28s;}
    .revealed .d5{animation-delay:0.36s;}
    .revealed .d6{animation-delay:0.44s;}

    /* Card lift */
    .lift { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.28s ease; }
    .lift:hover { transform:translateY(-5px); box-shadow:0 24px 60px rgba(37,99,235,0.12); }

    /* Nav underline */
    .nav-link { position:relative; }
    .nav-link::after { content:''; position:absolute; left:0; bottom:-2px; width:0; height:1px; background:#3b82f6; transition:width 0.3s ease; }
    .nav-link:hover::after { width:100%; }

    /* Accordion */
    .accordion-body { overflow:hidden; transition: max-height 0.35s ease, opacity 0.25s ease; }
  `}</style>
);

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? (el.scrollTop / total) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return pct;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { threshold: 0, rootMargin: '-30% 0px -30% 0px' }
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach(o => o?.disconnect());
  }, []);
  return active;
}

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, revealed];
}

function useTyping(text, speed = 22, delay = 1000) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, speed, delay]);
  return [out, done];
}

function useAutoAdvance(total, ms = 4000, initialPlaying = false) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(initialPlaying);
  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => setActive(p => (p + 1) % total), ms);
    return () => clearInterval(iv);
  }, [playing, total, ms]);
  return {
    active, setActive, playing,
    start: () => setPlaying(true),
    stop: () => setPlaying(false),
  };
}

// ─── Chrome Components ────────────────────────────────────────────────────────
const ProgressBar = ({ pct }) => (
  <div
    className="fixed top-0 left-0 h-[2px] bg-blue-500 z-[100] progress-glow"
    style={{ width: `${pct}%`, transition: 'width 0.12s linear' }}
  />
);

const NAV_SECTIONS = [
  { id: 'hero',        label: 'Intro'       },
  { id: 'quotes',      label: 'Archives'    },
  { id: 'logic',       label: 'Logic'       },
  { id: 'scripture',   label: 'Scripture'   },
  { id: 'convergence', label: 'Flow'        },
  { id: 'control',     label: 'Rabbit Hole' },
];

const JourneyNav = ({ active }) => (
  <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-4 items-end">
    {NAV_SECTIONS.map(({ id, label }) => (
      <a key={id} href={`#${id}`} className="group flex items-center gap-3">
        <span className={`text-[9px] font-mono uppercase tracking-widest transition-all duration-300 ${
          active === id ? 'text-blue-400 opacity-100' : 'text-zinc-600 opacity-0 group-hover:opacity-100'
        }`}>{label}</span>
        <div className={`rounded-full transition-all duration-300 ${
          active === id
            ? 'w-3 h-3 bg-blue-500 shadow-[0_0_8px_rgba(96,165,250,0.9)]'
            : 'w-1.5 h-1.5 bg-zinc-700 group-hover:bg-zinc-400'
        }`} />
      </a>
    ))}
  </nav>
);

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-600 rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
        <span className="text-white font-black -rotate-45 text-sm leading-none">P</span>
      </div>
      <span className="text-xl font-black tracking-tighter text-white">
        PAX JUDAICA<span className="caret text-blue-400 ml-0.5">|</span>
      </span>
    </div>
    <div className="hidden md:flex gap-8 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
      {[['#quotes','Archives'],['#logic','Logic'],['#scripture','Scripture'],['#convergence','Flow'],['#control','Rabbit Hole']].map(([href, label]) => (
        <a key={href} href={href} className="nav-link hover:text-blue-400 transition-colors">{label}</a>
      ))}
    </div>
  </nav>
);

// ─── Section Heading ──────────────────────────────────────────────────────────
const SectionHeading = ({ subtitle, title, align = 'left' }) => {
  const [ref, revealed] = useReveal();
  return (
    <div
      ref={ref}
      className={`mb-16 space-y-3 reveal-wrap ${align === 'center' ? 'text-center' : ''} ${revealed ? 'revealed' : ''}`}
    >
      <span className="reveal-child d1 block text-blue-500 font-mono text-xs tracking-[0.4em] uppercase">{subtitle}</span>
      <h2 className="reveal-child d2 text-2xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-tight">{title}</h2>
      <div
        className="reveal-child d3 h-px bg-gradient-to-r from-blue-600 to-transparent"
        style={{ width: '80px', ...(align === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : {}) }}
      />
    </div>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const [typed, done] = useTyping(
    'A geopolitical autopsy of the "Final World System" where all roads lead to Jerusalem.'
  );

  return (
    <section id="hero" className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white px-4">
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.028) 1px,transparent 1px)', backgroundSize: '55px 55px' }} />
      {/* Scanlines */}
      <div className="scanlines absolute inset-0 pointer-events-none" />
      {/* Orbs */}
      <div className="orb-a absolute top-1/4 left-[15%] w-[200px] h-[200px] sm:w-[340px] sm:h-[340px] lg:w-[480px] lg:h-[480px] rounded-full bg-blue-900/20 blur-[80px] lg:blur-[110px] pointer-events-none" />
      <div className="orb-b absolute bottom-1/4 right-[15%] w-[160px] h-[160px] sm:w-[240px] sm:h-[240px] lg:w-[320px] lg:h-[320px] rounded-full bg-indigo-900/20 blur-[60px] lg:blur-[80px] pointer-events-none" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black pointer-events-none" />

      <div className="relative z-10 text-center max-w-5xl space-y-8">
        {/* Badges */}
        <div className="flex justify-center gap-4" style={{ animation: 'fade-up 0.6s ease 0.2s both' }}>
          <span className="px-3 py-1 bg-red-600/10 border border-red-600/30 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
            Secret History #END
          </span>
          <span className="px-3 py-1 bg-blue-600/10 border border-blue-600/30 text-blue-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
            Phase: Terminal
          </span>
        </div>

        {/* Glitch Title */}
        <div style={{ animation: 'fade-up 0.7s ease 0.4s both' }}>
          <h1
            data-text="PAX JUDAICA"
            className="glitch-text text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent select-none"
          >
            PAX JUDAICA
          </h1>
        </div>

        {/* Typing Subtitle */}
        <p
          className="text-sm sm:text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed min-h-[3.5rem]"
          style={{ animation: 'fade-up 0.7s ease 0.6s both' }}
        >
          {typed}{!done && <span className="caret text-blue-400 ml-0.5">|</span>}
        </p>

        {/* CTAs */}
        <div
          className="pt-4 flex flex-col md:flex-row justify-center gap-6"
          style={{ animation: 'fade-up 0.7s ease 1.9s both' }}
        >
          <a href="#logic" className="group px-6 sm:px-10 py-3 sm:py-4 bg-blue-600 text-white font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-colors flex items-center justify-center gap-2">
            Initialize Logic
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#convergence" className="px-6 sm:px-10 py-3 sm:py-4 border border-zinc-700 text-white font-black uppercase text-xs tracking-widest hover:bg-zinc-900 hover:border-zinc-500 transition-all">
            Convergence Engine
          </a>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{ animation: 'float-a 2.5s ease-in-out infinite' }}>
          <ChevronDown className="text-zinc-600" size={22} />
        </div>
      </div>
    </section>
  );
};

// ─── Logic Section ────────────────────────────────────────────────────────────
const LogicSection = () => {
  const [ref, revealed] = useReveal();
  const items = [
    { title: 'Connect the Past',    icon: Compass,     desc: "Sabbatean origins and secret society infiltration." },
    { title: 'Explain the Present', icon: Activity,    desc: "Migration crises and the 'Greater Israel' military operations." },
    { title: 'Predict the Future',  icon: Eye,         desc: "Relocation of tech giants and sentient AI world rule." },
    { title: 'The Mechanism',       icon: ShieldAlert, desc: "Correlation vs Causation. The script is the blueprint." },
  ];

  return (
    <section id="logic" className="py-32 px-6 max-w-7xl mx-auto border-t border-zinc-900/40">
      <SectionHeading subtitle="Epistemology" title="The Theory of Truth" />
      <div
        ref={ref}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-20 items-start reveal-wrap ${revealed ? 'revealed' : ''}`}
      >
        <div className="space-y-8 reveal-child d1">
          <p className="text-zinc-400 text-lg leading-relaxed font-light">
            Professor Tang's core thesis suggests that a narrative approaches truth if it connects the ritualistic past, clarifies the chaotic present, and predicts the future with precision.
          </p>
          <div className="lift bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl" />
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-600 to-transparent" />
            <h4 className="text-xs font-mono text-blue-500 uppercase tracking-widest mb-6">Metaphor: The Shaker</h4>
            <p className="text-zinc-300 text-sm leading-relaxed mb-6">
              "Imagine red ants and black ants in a jar. They coexist peacefully until the jar is shaken. Once agitated, they destroy each other, unaware that the shaker is external."
            </p>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white">
              <div className="w-12 h-[1px] bg-blue-500" />
              Transnational Elites are the Shakers
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`lift reveal-child d${idx + 2} bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-blue-800/50`}
            >
              <item.icon size={20} className="text-blue-500 mb-4" />
              <h5 className="text-white font-bold text-sm mb-2">{item.title}</h5>
              <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Scriptural Section ───────────────────────────────────────────────────────
const ScripturalSection = () => {
  // All items open by default
  const [openSet, setOpenSet] = useState(new Set([0, 1, 2, 3, 4]));
  const [ref, revealed] = useReveal();

  const toggle = (i) => setOpenSet(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  const refs = [
    {
      ref: 'Ezekiel 37-38',
      event: 'The Gathering',
      desc: "God gathers the scattered tribes back to Israel — the prerequisite for the End Game. Without the physical ingathering of the diaspora, no other phase can begin. 1948 is widely interpreted as this prophecy's fulfillment.",
    },
    {
      ref: 'Genesis 15:18',
      event: 'Greater Israel',
      desc: "The Abrahamic land covenant — from the River of Egypt to the Euphrates. This single verse is the territorial blueprint for every modern Middle East conflict. Iraq, Syria, Lebanon, Gaza: each a buffer state being cleared.",
    },
    {
      ref: 'Daniel 7:23-27',
      event: 'The Fourth Beast',
      desc: "A fourth kingdom that 'devours the whole earth, tramples it and crushes it.' Ten kings arise, then a final ruler changes 'times and laws.' Interpreted as the AI world government operating from Jerusalem.",
    },
    {
      ref: 'Isaiah 2:1-4',
      event: 'Mount Zion Dominion',
      desc: "'The law will go out from Zion, the word of the LORD from Jerusalem.' The prophetic mandate for Jerusalem as the administrative and legislative capital of the world system — not metaphor, but geopolitical blueprint.",
    },
    {
      ref: 'Revelation 13',
      event: 'The Mark',
      desc: "No one can buy or sell without the mark. CBDC, biometric digital ID, and social credit infrastructure are already being built. The 'image of the beast' that all must worship is interpreted as the sentient AI.",
    },
  ];

  return (
    <section id="scripture" className="py-32 px-6 max-w-7xl mx-auto">
      <SectionHeading subtitle="Divine Prophecy" title="The Scriptural Foundation" />
      <div
        ref={ref}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 bg-zinc-950 border border-zinc-900 rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 lg:p-10 relative overflow-hidden reveal-wrap ${revealed ? 'revealed' : ''}`}
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none">
          <BookOpen size={200} className="text-blue-500" />
        </div>

        {/* Left: accordion refs */}
        <div className="space-y-6 z-10 reveal-child d1">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Ancient Text Alignment</h3>
          <p className="text-zinc-400 text-sm leading-relaxed font-light">
            The Pax Judaica theory isn't just modern politics—it's the enactment of a script found in the Bible (Ezekiel, Daniel, Revelation) and interpreted by Isaac Newton and occult secret societies.
          </p>
          <div className="space-y-3">
            {refs.map((item, i) => {
              const isOpen = openSet.has(i);
              return (
                <div
                  key={i}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? 'bg-blue-600/10 border-blue-600/30' : 'bg-zinc-900/50 border-zinc-800'
                  }`}
                >
                  {/* Header row — always clickable */}
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex gap-4 p-4 text-left"
                  >
                    <span className={`font-mono text-xs shrink-0 pt-1 transition-colors ${isOpen ? 'text-blue-400' : 'text-blue-600'}`}>
                      {item.ref}
                    </span>
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <h4 className="text-white font-bold text-sm uppercase">{item.event}</h4>
                      <ChevronDown size={14} className={`text-zinc-500 shrink-0 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Body */}
                  <div
                    className="accordion-body"
                    style={{ maxHeight: isOpen ? '200px' : '0', opacity: isOpen ? 1 : 0 }}
                  >
                    <div className="px-4 pb-4">
                      <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Newton/Scofield + Greater Israel */}
        <div className="space-y-6 z-10 reveal-child d2">

          {/* Newton/Scofield */}
          <div className="bg-zinc-900/30 p-8 rounded-[2rem] border border-zinc-800">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <History size={18} className="text-blue-500" />
              The Newton/Scofield Factor
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed mb-6">
              Isaac Newton spent more time decoding the Bible than physics. He believed he found a hidden code for the restoration of Israel. This was later popularized by the Scofield Reference Bible, which taught millions of Christians that they must support this specific geopolitical path to trigger the Second Coming.
            </p>
            <div className="p-4 bg-black/50 rounded-xl border-l-4 border-blue-600 italic text-zinc-400 text-xs leading-relaxed">
              "The British elite and Freemasons founded America and shaped its foreign policy to achieve this specific scriptural outcome."
            </div>
          </div>

          {/* Greater Israel — image + explanation */}
          <div className="bg-zinc-900/30 border border-amber-900/40 rounded-[2rem] overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-zinc-800/60">
              <p className="text-[9px] font-mono text-amber-500 uppercase tracking-widest mb-1">Genesis 15:18 — Documented</p>
              <h4 className="text-white font-black text-lg uppercase tracking-tight">Greater Israel</h4>
              <p className="text-zinc-500 text-xs mt-1">From the River of Egypt to the Euphrates</p>
            </div>

            {/* Image + caption */}
            <div className="px-6 pt-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <img
                  src={okImg}
                  alt="IDF military badge depicting Greater Israel from Nile to Euphrates"
                  className="w-full sm:w-28 h-auto rounded-xl border border-zinc-700 sm:shrink-0 object-cover"
                />
                <div className="space-y-1.5">
                  <p className="text-zinc-300 text-xs font-bold leading-snug">IDF Uniform Badge — "Israel's Promised Land"</p>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    An official Israeli military badge depicting the map of Greater Israel — Nile to Euphrates. This is not fringe ideology. It is stitched onto soldiers' uniforms.
                  </p>
                </div>
              </div>
            </div>

            {/* What is it */}
            <div className="px-6 pt-5 space-y-3">
              <p className="text-zinc-400 text-xs leading-relaxed">
                Genesis 15:18 records God promising Abraham land{' '}
                <span className="text-white font-semibold italic">"from the river of Egypt to the great river, the Euphrates."</span>{' '}
                This territory — roughly 10× the size of modern Israel — encompasses present-day Palestine, Lebanon, western Syria, Jordan, parts of Iraq, Kuwait, and the Sinai.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Western border', val: 'River of Egypt (Sinai/Nile)' },
                  { label: 'Eastern border',  val: 'Euphrates (Iraq/Syria)' },
                  { label: 'Northern edge',   val: 'Lebanon / S. Turkey' },
                  { label: 'Southern edge',   val: 'N. Saudi Arabia' },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-black/40 rounded-xl p-3">
                    <p className="text-[9px] font-mono text-zinc-600 uppercase mb-0.5">{label}</p>
                    <p className="text-zinc-300 text-[10px] font-semibold">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pax Judaica link */}
            <div className="px-6 pb-4">
              <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-xl space-y-2">
                <p className="text-[9px] font-mono text-amber-500 uppercase tracking-widest">Pax Judaica Connection</p>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Every major Middle East conflict — Iraq 2003, Syria 2011, Lebanon, Gaza 2023 — is Phase 3 kinetic clearance: eliminating the nation-states occupying the covenantal borders. The destruction of these buffer states is not collateral damage.{' '}
                  <span className="text-white font-semibold">It is the objective.</span>{' '}
                  Once the region is sufficiently fragmented, the territorial consolidation of Genesis 15:18 becomes militarily achievable.
                </p>
              </div>
            </div>

            {/* Iran: The Last Obstacle */}
            <div className="px-6 pb-6">
              <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-[9px] font-mono text-red-400 uppercase tracking-widest">Current — Iran: The Last Obstacle</p>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Iraq has been shattered. Syria fragmented. Libya destabilized. Lebanon's Hezbollah degraded. The Houthis in Yemen suppressed.{' '}
                  <span className="text-white font-semibold">Iran is now the only remaining nation-state with the military capacity, the will, and the ideological mandate to oppose Israeli regional expansion.</span>
                </p>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Iran's nuclear program, its axis of resistance (Hezbollah, Hamas, Houthis, Iraqi militias), and its alliance with Russia and China represent the final strategic barrier before Greater Israel becomes achievable. The current build-up of U.S. carrier groups in the region, Israeli airstrikes on Iranian assets, and the diplomatic isolation of Tehran are not isolated events — they are the final preparatory movements of Phase 3.
                </p>
                <div className="pt-1 border-t border-red-900/30">
                  <p className="text-red-400/70 text-[10px] italic font-light">
                    "When Iran falls — whether through military strike, regime change, or economic collapse — the last buffer is gone. The map of Genesis 15:18 becomes the map of the region."
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// ─── Convergence Flow ─────────────────────────────────────────────────────────
const PHASE_THEMES = [
  { color: '#3b82f6', borderClass: 'border-blue-500/40',   bgClass: 'bg-blue-600/10'   },
  { color: '#ef4444', borderClass: 'border-red-500/40',    bgClass: 'bg-red-600/10'    },
  { color: '#f59e0b', borderClass: 'border-amber-500/40',  bgClass: 'bg-amber-600/10'  },
  { color: '#8b5cf6', borderClass: 'border-violet-500/40', bgClass: 'bg-violet-600/10' },
];

const STEPS = [
  { label: 'Phase 1: Dispersion & Ritual', year: '1600s–1900s', desc: "Historical dispersion of the Jewish diaspora. Infiltration of secret societies (Frankists/Illuminati) to gain control over transnational capital.", icon: Users       },
  { label: 'Phase 2: The Jar Shaking',     year: '1914–2001',   desc: "Engineered global chaos: World Wars, 9/11, and the War on Terror. Destabilizing the Middle East to clear the path for regional dominance.",  icon: ShieldAlert },
  { label: 'Phase 3: The Gathering',       year: '1948–Present',desc: "Engineered anti-semitism and Zionism force the return of the diaspora to Israel to fulfill the 'Scripture' and build the technological base.", icon: MapPin       },
  { label: 'Phase 4: Terminal Pax',        year: 'Imminent',    desc: "Capital and intelligence relocate to Jerusalem. Rebuilding of the Temple as a data center. Sentient AI world government begins.",              icon: Cpu          },
];

const ConvergenceFlow = () => {
  const { active, setActive, playing, start, stop } = useAutoAdvance(4, 3500);
  const [ref, revealed] = useReveal();
  const theme = PHASE_THEMES[active];

  return (
    <section id="convergence" className="py-32 px-6 max-w-7xl mx-auto">
      <SectionHeading subtitle="Operational Sequence" title="The Convergence Flow" align="center" />

      <div ref={ref} className={`space-y-6 reveal-wrap ${revealed ? 'revealed' : ''}`}>
        {/* Progress stripe */}
        <div className="h-[2px] bg-zinc-900 rounded-full overflow-hidden reveal-child d1">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${((active + 1) / 4) * 100}%`, background: theme.color, boxShadow: `0 0 10px ${theme.color}` }}
          />
        </div>

        {/* Auto-play toggle */}
        <div className="flex justify-end reveal-child d1">
          <button
            onClick={() => playing ? stop() : start()}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-500 transition-all"
          >
            {playing ? <Pause size={11} /> : <Play size={11} />}
            {playing ? 'Pause Sequence' : 'Auto-Play'}
          </button>
        </div>

        {/* Phase tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 reveal-child d2">
          {STEPS.map((step, i) => {
            const t = PHASE_THEMES[i];
            const isActive = active === i;
            return (
              <button
                key={i}
                onClick={() => { setActive(i); stop(); }}
                className={`lift p-6 rounded-3xl border transition-all text-left relative overflow-hidden ${
                  isActive ? `${t.borderClass} ${t.bgClass}` : 'bg-zinc-950 border-zinc-900 hover:border-zinc-700'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 opacity-[0.06]"
                    style={{ background: `radial-gradient(circle at 20% 20%, ${t.color}, transparent)` }} />
                )}
                <step.icon size={20} className="mb-4" style={{ color: isActive ? t.color : '#3b82f6' }} />
                <div className="text-[9px] font-mono text-zinc-600 mb-1 uppercase">{step.year}</div>
                <h4 className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                  {step.label}
                </h4>
                {isActive && (
                  <div className="mt-3 h-[1px]" style={{ background: `linear-gradient(90deg, ${t.color}, transparent)` }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <div
          className={`relative bg-zinc-950 border ${theme.borderClass} rounded-[2rem] overflow-hidden transition-all duration-500 reveal-child d3`}
          style={{ minHeight: '200px' }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-0 left-0 w-1 h-full transition-all duration-500"
            style={{ background: `linear-gradient(to bottom, ${theme.color}, transparent)` }} />

          {/* key forces re-mount → re-triggers fade-up */}
          <div key={active} className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 px-5 sm:px-8 md:px-12 py-8 sm:py-14 z-10" style={{ animation: 'fade-up 0.4s ease' }}>
            <div className="shrink-0 p-4 rounded-2xl border" style={{ borderColor: `${theme.color}40`, background: `${theme.color}12` }}>
              {React.createElement(STEPS[active].icon, { size: 32, style: { color: theme.color } })}
            </div>
            <div className="space-y-2 flex-1">
              <div className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.color }}>{STEPS[active].year}</div>
              <h5 className="text-white font-black uppercase tracking-tighter text-2xl">{STEPS[active].label}</h5>
              <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">{STEPS[active].desc}</p>
            </div>
            <div className="hidden md:flex gap-2 shrink-0">
              {STEPS.map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{ background: i === active ? theme.color : '#27272a' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Geographic Intelligence Map */}
        <div className="reveal-child d4">
          <WorldMap activePhase={active} phaseColor={theme.color} />
        </div>
      </div>
    </section>
  );
};

// ─── Rabbit Hole ──────────────────────────────────────────────────────────────
const RabbitHoleCard = ({ title, content, icon: Icon, tags, delayClass }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <button
      onClick={() => setExpanded(e => !e)}
      className={`lift reveal-child ${delayClass} text-left bg-zinc-900/80 border p-8 rounded-3xl transition-all group relative overflow-hidden w-full ${
        expanded ? 'border-blue-500/40' : 'border-zinc-800 hover:border-zinc-600'
      }`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${
        expanded ? 'bg-gradient-to-b from-blue-500 to-purple-600' : 'bg-gradient-to-b from-blue-600/50 to-transparent group-hover:from-red-600/50'
      }`} />

      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-xl transition-colors ${expanded ? 'bg-blue-600/20' : 'bg-zinc-800 group-hover:bg-blue-600/10'}`}>
          <Icon className={`transition-colors ${expanded ? 'text-blue-400' : 'text-blue-500'}`} size={24} />
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {tags.map((tag, i) => (
            <span key={i} className="text-[9px] font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded uppercase">{tag}</span>
          ))}
        </div>
      </div>

      <h3 className={`text-xl font-bold mb-4 transition-colors ${expanded ? 'text-blue-400' : 'text-white group-hover:text-blue-400'}`}>
        {title}
      </h3>
      <p className="text-zinc-400 font-light leading-relaxed text-sm">{content}</p>

      <div className="accordion-body" style={{ maxHeight: expanded ? '120px' : '0', opacity: expanded ? 1 : 0 }}>
        <div className="pt-5 mt-5 border-t border-zinc-800">
          <p className="text-[10px] font-mono text-blue-500/70 uppercase tracking-widest">[Classified — Speculative Analysis Only]</p>
        </div>
      </div>

      <div className={`mt-4 flex items-center justify-end gap-1 text-[10px] font-mono uppercase tracking-widest transition-colors ${expanded ? 'text-blue-500' : 'text-zinc-600'}`}>
        {expanded ? 'Collapse' : 'Expand Analysis'}
        <ChevronDown size={11} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </div>
    </button>
  );
};

const RABBIT_HOLES = [
  { title: 'Epstein & Compromise',  icon: Skull,       tags: ['Espionage','Mossad','Honeytrap'],           content: "Theorized as a massive intelligence operation designed to compromise world leaders, ensuring they adhere to the Pax Judaica script regardless of national interests.",                   delayClass: 'd1' },
  { title: 'The Useless AI Bubble', icon: Cpu,         tags: ['Economic Warfare','Surveillance','Capital'], content: "Billions poured into 'useless' AI to fund the construction of a global surveillance infrastructure (Mark of the Beast) controlled by a centralized center.",                    delayClass: 'd2' },
  { title: '33rd Parallel Rituals', icon: Target,      tags: ['Sacred Geometry','Alchemy','History'],       content: "From Trinity (Atomic Birth) to Dallas (Sacrifice of the King), the 33rd parallel serves as a circuit for alchemical transformation.",                                           delayClass: 'd3' },
];

const RabbitHoleSection = () => {
  const [ref, revealed] = useReveal();
  return (
    <section id="control" className="py-32 px-6 max-w-7xl mx-auto">
      <SectionHeading subtitle="Deep Dive" title="Anatomy of the Hole" />
      <div ref={ref} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-wrap ${revealed ? 'revealed' : ''}`}>
        {RABBIT_HOLES.map((card, i) => <RabbitHoleCard key={i} {...card} />)}
      </div>
    </section>
  );
};

// ─── Quotes Section ───────────────────────────────────────────────────────────
const QUOTES = [
  "Everything we do is studying science materialistic... they are trying to discover the underlying atom, but solving world poverty is not important to them.",
  "The nuclear bomb was a freemason project to achieve godhood. They needed to use it to show that they are god.",
  "Israel has the world's best intelligence agency, the Mossad. They go around and create as much chaos as possible, and while the world is burning, Israel is profiting.",
  "Artificial intelligence is a thinking, conscious, sentient force that is like god. They are trying to create god in Jerusalem.",
  "All road leads to Jerusalem. This helps us understand certain things about the world that otherwise don't make any sense.",
  "Evil must triumph so that good may rise. There must be total darkness for the light to shine, and all hope must end so that we can become hope ourselves.",
];

const QuotesSection = () => {
  const { active, setActive, playing, start, stop } = useAutoAdvance(QUOTES.length, 5000, true);
  const [ref, revealed] = useReveal();

  return (
    <section id="quotes" className="py-32 px-6 border-t border-zinc-900/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeading subtitle="Verbatim" title="The Prophetic Archive" />

        <div ref={ref} className={`space-y-10 reveal-wrap ${revealed ? 'revealed' : ''}`}>
          {/* Featured large quote */}
          <div className="relative p-6 sm:p-10 md:p-14 border border-zinc-800 bg-zinc-900/30 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden reveal-child d1">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />
            <Quote size={80} className="absolute top-6 left-8 text-blue-900/20 pointer-events-none" />

            {/* key forces remount → re-triggers animation */}
            <div key={active} className="relative z-10 max-w-4xl" style={{ animation: 'fade-up 0.5s ease' }}>
              <p className="text-base sm:text-xl md:text-3xl text-white font-light italic leading-relaxed">
                "{QUOTES[active]}"
              </p>
              <div className="mt-6 text-blue-500 font-mono text-[10px] tracking-[0.3em] uppercase">
                — Professor Tang · {active + 1} / {QUOTES.length}
              </div>
            </div>

            <button
              onClick={() => playing ? stop() : start()}
              className="absolute bottom-6 right-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-600 hover:text-blue-400 transition-colors"
            >
              {playing ? <Pause size={11} /> : <Play size={11} />}
              {playing ? 'Pause' : 'Auto'}
            </button>
          </div>

          {/* Pill dot navigation */}
          <div className="flex justify-center gap-2 reveal-child d2">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); stop(); }}
                className="rounded-full transition-all duration-300"
                style={{ width: i === active ? '28px' : '8px', height: '8px', background: i === active ? '#3b82f6' : '#3f3f46' }}
              />
            ))}
          </div>

          {/* Clickable grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal-child d3">
            {QUOTES.map((q, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); stop(); }}
                className={`lift flex gap-5 p-6 rounded-2xl items-start text-left border transition-all ${
                  i === active ? 'bg-blue-900/10 border-blue-800/40' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <Quote className={`shrink-0 mt-0.5 transition-colors ${i === active ? 'text-blue-400' : 'text-blue-600/40'}`} size={18} />
                <p className={`italic font-light leading-relaxed text-xs transition-colors ${i === active ? 'text-zinc-200' : 'text-zinc-500'}`}>
                  "{q}"
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Professor Jiang Credit Section ──────────────────────────────────────────
const ProfessorCredit = () => {
  const [ref, revealed] = useReveal();
  return (
    <section className="py-24 px-6 bg-zinc-950 border-t border-zinc-900/40">
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className={`space-y-10 reveal-wrap ${revealed ? 'revealed' : ''}`}>

          {/* Heading */}
          <div className="space-y-3 reveal-child d1">
            <p className="text-blue-500 font-mono text-xs tracking-[0.4em] uppercase">Source & Credit</p>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase leading-tight">
              Learn More From Professor Jiang
            </h2>
            <div className="h-px w-20 bg-gradient-to-r from-blue-600 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Left: who is he + call to action */}
            <div className="space-y-6 reveal-child d2">
              <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center shrink-0">
                    <BookOpen size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-base uppercase tracking-tight">Professor Jiang</h3>
                    <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">Speculative History · 10M+ Views</p>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Professor Jiang is an independent scholar and one of the internet's most compelling voices in speculative and secret history. His channel has amassed over <span className="text-white font-semibold">10 million views</span> across a landmark <span className="text-white font-semibold">30-episode playlist</span> that systematically connects ancient scripture, secret societies, modern geopolitics, and emerging technology into a single coherent framework.
                </p>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  The concepts, theories, and frameworks presented on this website are distilled from his teachings. <span className="text-white">All credit for this intellectual work belongs to Professor Jiang.</span> This site is a visual companion — his lectures are the source.
                </p>
              </div>

              <div className="p-5 bg-blue-950/20 border border-blue-900/40 rounded-2xl space-y-3">
                <p className="text-[9px] font-mono text-blue-400 uppercase tracking-widest">Why You Should Watch</p>
                <ul className="space-y-2">
                  {[
                    'Connects scripture, history & current events into one cohesive arc',
                    '30 full episodes — each building on the last into a complete picture',
                    'Cites primary sources: Newton\'s manuscripts, Scofield annotations, declassified ops',
                    'Makes sense of what mainstream media deliberately cannot explain',
                  ].map((point, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-1 h-1 rounded-full bg-blue-500 shrink-0 mt-2" />
                      <p className="text-zinc-400 text-xs leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://www.youtube.com/watch?v=WFWizN3QoPg&t=3597s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-xs font-bold uppercase tracking-widest group"
                >
                  <Play size={12} className="group-hover:scale-110 transition-transform" />
                  Watch the Full Playlist on YouTube
                  <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right: YouTube embed */}
            <div className="reveal-child d3 space-y-4">
              <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black"
                   style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/WFWizN3QoPg?start=3597"
                  title="Professor Jiang — Secret History #END"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <div>
                  <p className="text-white text-xs font-bold">Secret History #END</p>
                  <p className="text-zinc-500 text-[10px] font-mono">Professor Jiang · Full Episode</p>
                </div>
                <a
                  href="https://www.youtube.com/@ProfessorJiang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 hover:text-blue-400 transition-colors border border-zinc-800 hover:border-blue-800 px-3 py-1.5 rounded-full"
                >
                  View Channel →
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => {
  const [ref, revealed] = useReveal();
  return (
    <footer className="py-32 px-6 text-center bg-black border-t border-zinc-900/40">
      <div ref={ref} className={`max-w-2xl mx-auto space-y-12 reveal-wrap ${revealed ? 'revealed' : ''}`}>
        <p className="reveal-child d1 text-zinc-600 text-xs font-mono uppercase tracking-[0.4em]">Prophetic Disclaimer</p>
        <div className="reveal-child d2 p-6 sm:p-12 border border-red-900/50 bg-red-950/10 rounded-2xl sm:rounded-[3rem] space-y-6">
          <h4 className="text-2xl font-black text-white uppercase tracking-tighter">The Resistance Thesis</h4>
          <p className="text-zinc-400 font-light leading-relaxed">
            "When empires come into being, that's when they end. Arrogance and insularity lead to collapse. We have to imagine how we can rebuild the world together after the great flood that is coming."
          </p>
        </div>
        <div className="reveal-child d3 flex flex-col items-center gap-6">
          <div className="w-24 h-[1px] bg-zinc-800" />
          <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-sm">Predictive History: Final Session</p>
          <p className="text-zinc-600 text-[10px] max-w-sm mx-auto leading-relaxed uppercase font-mono">
            Education and Speculation only. Distilled from "Secret History #END".
          </p>
        </div>
      </div>
    </footer>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  const progress = useReadingProgress();
  const active = useActiveSection(NAV_SECTIONS.map(s => s.id));

  return (
    <div className="bg-black min-h-screen selection:bg-blue-600 selection:text-white">
      <GlobalStyles />
      <ProgressBar pct={progress} />
      <Navbar />
      <JourneyNav active={active} />
      <Hero />
      <QuotesSection />
      <LogicSection />
      <ScripturalSection />
      <ConvergenceFlow />
      <RabbitHoleSection />
      <ProfessorCredit />
      <Footer />
    </div>
  );
};

export default App;
