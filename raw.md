import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  MapPin, 
  Cpu, 
  Skull, 
  Zap, 
  Users, 
  ShieldAlert, 
  Eye, 
  Lock, 
  ChevronRight, 
  ExternalLink,
  ChevronDown,
  BookOpen,
  Target,
  Activity,
  Compass,
  AlertTriangle,
  Server,
  Network,
  Radio,
  Dna,
  Link as LinkIcon,
  Search,
  Quote,
  History,
  FileText,
  Workflow
} from 'lucide-react';

// --- Specialized Components ---

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-600 rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
        <span className="text-white font-bold -rotate-45">P</span>
      </div>
      <span className="text-xl font-bold tracking-tighter text-white">PAX JUDAICA</span>
    </div>
    <div className="hidden md:flex gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
      <a href="#logic" className="hover:text-blue-400 transition-colors">Logic</a>
      <a href="#scripture" className="hover:text-blue-400 transition-colors">Scripture</a>
      <a href="#convergence" className="hover:text-blue-400 transition-colors">Flow</a>
      <a href="#control" className="hover:text-blue-400 transition-colors">Rabbit Hole</a>
      <a href="#quotes" className="hover:text-blue-400 transition-colors">Archives</a>
    </div>
  </nav>
);

const SectionHeading = ({ subtitle, title, alignment = "left" }) => (
  <div className={`mb-16 space-y-2 ${alignment === 'center' ? 'text-center' : ''}`}>
    <span className="text-blue-500 font-mono text-xs tracking-[0.4em] uppercase">{subtitle}</span>
    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">{title}</h2>
  </div>
);

const ScripturalModule = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 mb-32 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-8 opacity-10">
      <BookOpen size={200} className="text-blue-500" />
    </div>
    <div className="space-y-6 z-10">
      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Ancient Text Alignment</h3>
      <p className="text-zinc-400 text-sm leading-relaxed font-light">
        The Pax Judaica theory isn't just modern politics—it's the enactment of a script found in the Bible (Ezekiel, Daniel, Revelation) and interpreted by Isaac Newton and occult secret societies.
      </p>
      <div className="space-y-4">
        {[
          { ref: "Ezekiel 37-38", event: "The Gathering", desc: "God gathers the scattered tribes back to Israel. This is the prerequisite for the 'End Game'." },
          { ref: "Genesis 15:18", event: "Greater Israel", desc: "The promise of land from the Nile to the Euphrates—the geographic footprint of Pax Judaica." },
          { ref: "Revelation 13", event: "The Mark", desc: "A world system where no one can buy or sell without a mark—the blueprint for the AI Digital ID surveillance state." }
        ].map((item, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="text-blue-500 font-mono text-xs shrink-0 pt-1">{item.ref}</div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase mb-1">{item.event}</h4>
              <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-zinc-900/30 p-8 rounded-[2rem] border border-zinc-800 z-10">
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
  </div>
);

const ConvergenceFlow = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { 
      label: "Phase 1: Dispersion & Ritual", 
      desc: "Historical dispersion of the Jewish diaspora. Infiltration of secret societies (Frankists/Illuminati) to gain control over transnational capital.",
      icon: Users
    },
    { 
      label: "Phase 2: The Jar Shaking", 
      desc: "Engineered global chaos: World Wars, 9/11, and the War on Terror. Destabilizing the Middle East to clear the path for regional dominance.",
      icon: ShieldAlert
    },
    { 
      label: "Phase 3: The Gathering", 
      desc: "Engineered anti-semitism and Zionism force the return of the diaspora to Israel to fulfill the 'Scripture' and build the technological base.",
      icon: MapPin
    },
    { 
      label: "Phase 4: Terminal Pax", 
      desc: "Capital and intelligence relocate to Jerusalem. Rebuilding of the Temple as a data center. Sentient AI world government begins.",
      icon: Cpu
    }
  ];

  return (
    <div className="mb-32 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <button 
            key={i}
            onClick={() => setActiveStep(i)}
            className={`p-6 rounded-3xl border transition-all text-left group ${activeStep === i ? 'bg-blue-600 border-blue-400' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
          >
            <step.icon size={20} className={`mb-4 ${activeStep === i ? 'text-white' : 'text-blue-500'}`} />
            <h4 className={`text-xs font-black uppercase tracking-widest mb-2 ${activeStep === i ? 'text-white' : 'text-zinc-300'}`}>{step.label}</h4>
            <div className={`h-[1px] w-full mb-4 ${activeStep === i ? 'bg-white/30' : 'bg-zinc-800'}`} />
            <p className={`text-[10px] leading-relaxed font-light ${activeStep === i ? 'text-blue-100' : 'text-zinc-500 opacity-0 group-hover:opacity-100'}`}>
              Click to view impact
            </p>
          </button>
        ))}
      </div>

      <div className="relative h-[200px] flex items-center justify-center bg-zinc-950 border border-zinc-900 rounded-[2rem] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="relative flex items-center gap-8 px-12 z-10">
          <Workflow size={40} className="text-blue-500 animate-pulse shrink-0" />
          <div className="space-y-2">
            <h5 className="text-white font-black uppercase tracking-tighter text-2xl">{steps[activeStep].label}</h5>
            <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">{steps[activeStep].desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RabbitHoleCard = ({ title, content, icon: Icon, tags }) => (
  <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-3xl hover:border-red-500/30 transition-all group relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-600 to-transparent group-hover:from-red-600 transition-all" />
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-blue-600/10 transition-colors">
        <Icon className="text-blue-500 group-hover:text-blue-400" size={24} />
      </div>
      <div className="flex gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="text-[9px] font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded uppercase">
            {tag}
          </span>
        ))}
      </div>
    </div>
    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">{title}</h3>
    <p className="text-zinc-400 font-light leading-relaxed text-sm">
      {content}
    </p>
  </div>
);

const App = () => {
  return (
    <div className="bg-black min-h-screen font-sans selection:bg-red-500 selection:text-white pb-20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white px-4">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,100 L100,0" stroke="rgba(255,255,255,0.05)" strokeWidth="0.05" />
             <path d="M0,0 L100,100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.05" />
          </svg>
        </div>
        
        <div className="z-10 text-center max-w-5xl space-y-8">
          <div className="flex justify-center gap-4 mb-4">
            <span className="px-3 py-1 bg-red-600/10 border border-red-600/30 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full">Secret History #END</span>
            <span className="px-3 py-1 bg-blue-600/10 border border-blue-600/30 text-blue-500 text-[10px] font-bold uppercase tracking-widest rounded-full">Phase: Terminal</span>
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent">
            PAX JUDAICA
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">
            A geopolitical autopsy of the "Final World System" where all roads lead to Jerusalem.
          </p>
          <div className="pt-8 flex flex-col md:flex-row justify-center gap-6">
            <a href="#logic" className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all">
              Initialize Logic
            </a>
            <a href="#convergence" className="px-10 py-4 border border-zinc-700 text-white font-black uppercase text-xs tracking-widest hover:bg-zinc-800 transition-all">
              Convergence Engine
            </a>
          </div>
        </div>
      </section>

      {/* Logic & Shaker Section */}
      <section id="logic" className="py-32 px-6 max-w-7xl mx-auto border-t border-zinc-900">
        <SectionHeading subtitle="Epistemology" title="The Theory of Truth" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
           <div className="space-y-8">
              <p className="text-zinc-400 text-lg leading-relaxed font-light">
                Professor Tang's core thesis suggests that a narrative approaches truth if it connects the ritualistic past, clarifies the chaotic present, and predicts the future with precision.
              </p>
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 blur-3xl -z-10" />
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
              {[
                { title: "Connect the Past", icon: Compass, desc: "Sabbatean origins and secret society infiltration." },
                { title: "Explain the Present", icon: Activity, desc: "Migration crises and the 'Greater Israel' military operations." },
                { title: "Predict the Future", icon: Eye, desc: "Relocation of tech giants and sentient AI world rule." },
                { title: "The Mechanism", icon: ShieldAlert, desc: "Correlation vs Causation. The script is the blueprint." }
              ].map((item, idx) => (
                <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-600 transition-colors">
                  <item.icon size={20} className="text-blue-500 mb-4" />
                  <h5 className="text-white font-bold text-sm mb-2">{item.title}</h5>
                  <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Scriptural Component */}
      <section id="scripture" className="py-32 px-6 max-w-7xl mx-auto">
        <SectionHeading subtitle="Divine Prophecy" title="The Scriptural Foundation" />
        <ScripturalModule />
      </section>

      {/* Convergence Flow Section */}
      <section id="convergence" className="py-32 px-6 max-w-7xl mx-auto">
        <SectionHeading subtitle="Operational Sequence" title="The Convergence Flow" alignment="center" />
        <ConvergenceFlow />
      </section>

      {/* Rabbit Hole Card Section */}
      <section id="control" className="py-32 px-6 max-w-7xl mx-auto">
        <SectionHeading subtitle="Deep Dive" title="Anatomy of the Hole" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <RabbitHoleCard 
            title="Epstein & Compromise"
            icon={Skull}
            tags={["Espionage", "Mossad", "Honeytrap"]}
            content="Theorized as a massive intelligence operation designed to compromise world leaders, ensuring they adhere to the Pax Judaica script regardless of national interests."
           />
           <RabbitHoleCard 
            title="The Useless AI Bubble"
            icon={Cpu}
            tags={["Economic Warfare", "Surveillance", "Capital"]}
            content="Billions poured into 'useless' AI to fund the construction of a global surveillance infrastructure (Mark of the Beast) controlled by a centralized center."
           />
           <RabbitHoleCard 
            title="33rd Parallel Rituals"
            icon={Target}
            tags={["Sacred Geometry", "Alchemy", "History"]}
            content="From Trinity (Atomic Birth) to Dallas (Sacrifice of the King), the 33rd parallel serves as a circuit for alchemical transformation."
           />
        </div>
      </section>

      {/* Quotes Archive Section */}
      <section id="quotes" className="py-32 px-6 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <SectionHeading subtitle="Verbatim" title="The Prophetic Archive" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Everything we do is studying science materialistic... they are trying to discover the underlying atom, but solving world poverty is not important to them.",
              "The nuclear bomb was a freemason project to achieve godhood. They needed to use it to show that they are god.",
              "Israel has the world's best intelligence agency, the Mossad. They go around and create as much chaos as possible, and while the world is burning, Israel is profiting.",
              "Artificial intelligence is a thinking, conscious, sentient force that is like god. They are trying to create god in Jerusalem.",
              "All road leads to Jerusalem. This helps us understand certain things about the world that otherwise don't make any sense.",
              "Evil must triumph so that good may rise. There must be total darkness for the light to shine, and all hope must end so that we can become hope ourselves."
            ].map((q, i) => (
              <div key={i} className="flex gap-6 p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl items-start">
                <Quote className="text-blue-500 shrink-0" size={24} />
                <p className="text-zinc-300 italic font-light leading-relaxed">"{q}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Resistance */}
      <footer className="py-32 px-6 text-center space-y-12 bg-black border-t border-zinc-900">
        <div className="max-w-2xl mx-auto">
          <p className="text-zinc-500 text-xs font-mono mb-8 uppercase tracking-[0.4em]">Prophetic Disclaimer</p>
          <div className="p-12 border border-red-900/50 bg-red-950/10 rounded-[3rem] space-y-6 mb-12">
            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">The Resistance Thesis</h4>
            <p className="text-zinc-400 font-light leading-relaxed">
              "When empires come into being, that's when they end. Arrogance and insularity lead to collapse. We have to imagine how we can rebuild the world together after the great flood that is coming."
            </p>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-[1px] bg-zinc-800" />
            <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-sm">Predictive History: Final Session</p>
            <p className="text-zinc-600 text-[10px] max-w-sm mx-auto leading-relaxed uppercase font-mono">
              Education and Speculation only. Distilled from "Secret History #END".
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;