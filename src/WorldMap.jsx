import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';
import worldData from 'world-atlas/countries-110m.json';

// ─── 33rd Parallel Event Data ─────────────────────────────────────────────────
const PARALLEL_EVENTS = [
  {
    id: 1,
    name: 'Trinity Test',
    coords: [-106.5, 33.7],
    year: 'Jul 16, 1945',
    label: 'Atomic Birth',
    type: 'ritual',
    desc: 'First atomic bomb detonation in New Mexico. Oppenheimer quotes the Bhagavad Gita: "I am become Death, the destroyer of worlds." A Freemasonic consecration of the nuclear age.',
  },
  {
    id: 2,
    name: 'Dallas / JFK',
    coords: [-96.8, 32.8],
    year: 'Nov 22, 1963',
    label: 'Sacrifice of the King',
    type: 'sacrifice',
    desc: 'The ritual assassination of the last U.S. president to oppose both central banking and Israel\'s nuclear weapons program (Dimona). Executed at 33°N in Dealey Plaza — named after a known Freemason.',
  },
  {
    id: 3,
    name: 'Nagasaki',
    coords: [129.9, 32.7],
    year: 'Aug 9, 1945',
    label: 'Second Fire',
    type: 'ritual',
    desc: 'The second atomic bombing, completing the duality. Hiroshima and Nagasaki bracket the 33rd parallel. Two cities, two sacrifices — the pattern demands completion.',
  },
  {
    id: 4,
    name: 'Casablanca',
    coords: [-7.6, 33.6],
    year: 'Jan 1943',
    label: 'War Architecture',
    type: 'political',
    desc: 'WWII Allied conference at 33°N that shaped the unconditional surrender doctrine and created the post-war framework allowing Israel\'s founding as a geopolitical inevitability.',
  },
  {
    id: 5,
    name: 'Baghdad / Babylon',
    coords: [44.4, 33.3],
    year: '2003',
    label: 'Babylon Destroyed',
    type: 'war',
    desc: 'Ancient Babylon — the original world empire — obliterated. The region cleared for Greater Israel expansion. Sitting precisely on the 33rd parallel, the destruction was both strategic and symbolic.',
  },
  {
    id: 6,
    name: 'Damascus',
    coords: [36.3, 33.5],
    year: '2011–Present',
    label: 'Syria Operations',
    type: 'war',
    desc: 'The destabilization of Syria — the final buffer state between Israel and Lebanon, Jordan, and greater regional dominance. 33°N operations to clear the path.',
  },
  {
    id: 7,
    name: 'Jerusalem',
    coords: [35.2, 31.8],
    year: 'Terminal',
    label: 'The Destination',
    type: 'target',
    desc: 'The convergence point. Capital of the future AI world government. The Temple Mount reconstruction as a data center. Every road in this theory ends here. 35°E, 31°N — the sacred center.',
  },
  {
    id: 8,
    name: 'Gaza',
    coords: [34.5, 31.5],
    year: '2023–Present',
    label: 'Current Theater',
    type: 'war',
    desc: 'Phase 3 kinetic operations underway. The last territorial obstacle before full Jerusalem consolidation. The world watches while the script advances.',
  },
  {
    id: 9,
    name: 'Tel Aviv / Israel',
    coords: [34.8, 32.1],
    year: '1948–Present',
    label: 'The Gathering Point',
    type: 'gathering',
    desc: 'The global diaspora returns. Israel becomes the world\'s 4th-largest tech hub, concentrating AI capital, surveillance technology, and intelligence infrastructure for the terminal phase.',
  },
];

// ─── Phase Heat Zones ─────────────────────────────────────────────────────────
const PHASE_HEAT_ZONES = [
  // Phase 1: Dispersion & Ritual — Eastern Europe, Western Europe, East Coast USA
  [
    { center: [27, 52],  r: 75,  color: '#3b82f6', intensity: 0.55, label: 'Pale of Settlement' },
    { center: [13, 51],  r: 60,  color: '#3b82f6', intensity: 0.40, label: 'Western Diaspora' },
    { center: [-74, 40.7], r: 50, color: '#3b82f6', intensity: 0.35, label: 'New World Diaspora' },
    { center: [35, 32],  r: 40,  color: '#3b82f6', intensity: 0.30, label: 'Ancient Homeland' },
  ],
  // Phase 2: Jar Shaking — Europe (WWI/WWII), NYC (9/11), Middle East
  [
    { center: [10, 50],  r: 85,  color: '#ef4444', intensity: 0.60, label: 'WWI/WWII Theater' },
    { center: [-74, 40.7], r: 55, color: '#ef4444', intensity: 0.75, label: '9/11 — New York' },
    { center: [44, 33],  r: 70,  color: '#ef4444', intensity: 0.65, label: 'Iraq / Babylon' },
    { center: [36, 33],  r: 60,  color: '#ef4444', intensity: 0.55, label: 'Syria / Levant' },
  ],
  // Phase 3: Gathering — Israel, Silicon Valley, Wall Street
  [
    { center: [35, 32],  r: 65,  color: '#f59e0b', intensity: 0.85, label: 'Israel: The Gathering' },
    { center: [34.5, 31.5], r: 45, color: '#f59e0b', intensity: 0.75, label: 'Gaza Operations' },
    { center: [-122, 37.4], r: 55, color: '#f59e0b', intensity: 0.60, label: 'Silicon Valley Capital' },
    { center: [-74, 40.7], r: 45, color: '#f59e0b', intensity: 0.50, label: 'Wall Street' },
  ],
  // Phase 4: Terminal Pax — Jerusalem, Greater Israel, Global grid
  [
    { center: [35.2, 31.8], r: 45,  color: '#8b5cf6', intensity: 1.00, label: 'Jerusalem: Final Capitol' },
    { center: [35, 32],     r: 75,  color: '#8b5cf6', intensity: 0.70, label: 'Greater Israel' },
    { center: [0, 20],      r: 220, color: '#8b5cf6', intensity: 0.10, label: 'Global Control Grid' },
  ],
];

const EVENT_COLORS = {
  ritual:    '#f59e0b',
  sacrifice: '#ef4444',
  war:       '#dc2626',
  political: '#8b5cf6',
  target:    '#3b82f6',
  gathering: '#22c55e',
};

const PHASE_LABELS = [
  'Phase 1 — Dispersion & Ritual',
  'Phase 2 — The Jar Shaking',
  'Phase 3 — The Gathering',
  'Phase 4 — Terminal Pax',
];

// ─── Component ────────────────────────────────────────────────────────────────
const WorldMap = ({ activePhase, phaseColor }) => {
  const [tooltip, setTooltip] = useState(null);
  const heatZones = PHASE_HEAT_ZONES[activePhase] ?? [];
  const color = phaseColor || '#3b82f6';

  return (
    <div className="relative bg-zinc-950 border border-zinc-900 rounded-[2rem] overflow-hidden">
      {/* Phase accent bar */}
      <div
        className="absolute top-0 left-0 w-full h-[2px] transition-all duration-500"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />

      {/* Header */}
      <div className="absolute top-4 left-6 z-10 space-y-0.5">
        <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Geographic Intelligence</p>
        <p className="text-xs font-mono font-bold transition-all duration-500" style={{ color }}>
          33° Parallel Events · {PHASE_LABELS[activePhase]}
        </p>
      </div>

      {/* Legend — top right (hidden on mobile) */}
      <div className="absolute top-4 right-6 z-10 hidden sm:flex flex-col gap-1.5">
        {Object.entries(EVENT_COLORS).map(([type, c]) => (
          <div key={type} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: c }} />
            <span className="text-[9px] font-mono text-zinc-600 uppercase">{type}</span>
          </div>
        ))}
        <div className="mt-1 flex items-center gap-2">
          <div className="w-5 border-t border-dashed border-blue-500/60" />
          <span className="text-[9px] font-mono text-blue-500/60 uppercase">33°N</span>
        </div>
      </div>

      {/* Map */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [20, 25] }}
        width={900}
        height={460}
        style={{ width: '100%', height: 'auto' }}
      >
        <defs>
          {/* Heat blur filter */}
          <filter id="heat" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          {/* Marker glow */}
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Heat zones (below countries so they glow through) ── */}
        {heatZones.map((zone, i) => (
          <Marker key={`heat-${activePhase}-${i}`} coordinates={zone.center}>
            <circle
              r={zone.r}
              fill={zone.color}
              opacity={zone.intensity * 0.38}
              filter="url(#heat)"
              style={{ transition: 'all 0.6s ease' }}
            />
          </Marker>
        ))}

        {/* ── World countries ── */}
        <Geographies geography={worldData}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#111113"
                stroke="#1d1d20"
                strokeWidth={0.4}
                style={{
                  default:  { outline: 'none' },
                  hover:    { fill: '#1a1a1e', outline: 'none' },
                  pressed:  { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {/* ── 33rd parallel line ── */}
        <Line
          from={[-180, 33]}
          to={[180, 33]}
          stroke="#3b82f6"
          strokeWidth={0.8}
          strokeOpacity={0.55}
          strokeDasharray="6 5"
        />

        {/* ── Event markers ── */}
        {PARALLEL_EVENTS.map(event => {
          const isActive = tooltip?.id === event.id;
          const c = EVENT_COLORS[event.type];
          return (
            <Marker
              key={event.id}
              coordinates={event.coords}
              onClick={() => setTooltip(isActive ? null : event)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer pulse ring */}
              <circle
                r={isActive ? 14 : 10}
                fill="transparent"
                stroke={c}
                strokeWidth={isActive ? 1.5 : 0.8}
                opacity={isActive ? 0.6 : 0.3}
                style={{ transition: 'all 0.25s ease' }}
              />
              {/* Core dot */}
              <circle
                r={isActive ? 7 : 4.5}
                fill={c}
                opacity={0.95}
                filter="url(#glow)"
                style={{ transition: 'r 0.25s ease' }}
              />
            </Marker>
          );
        })}
      </ComposableMap>

      {/* ── Tooltip ── */}
      {tooltip && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xs sm:max-w-md px-3 sm:px-4 z-20"
          style={{ animation: 'fade-up 0.3s ease' }}
        >
          <div
            className="bg-black/95 border rounded-2xl p-5 backdrop-blur-sm"
            style={{ borderColor: `${EVENT_COLORS[tooltip.type]}40` }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div
                  className="text-[9px] font-mono uppercase tracking-widest mb-1"
                  style={{ color: EVENT_COLORS[tooltip.type] }}
                >
                  {tooltip.type} · {tooltip.year} · {tooltip.coords[1].toFixed(1)}°N {Math.abs(tooltip.coords[0]).toFixed(1)}°{tooltip.coords[0] < 0 ? 'W' : 'E'}
                </div>
                <h4 className="text-white font-black text-lg tracking-tight">{tooltip.name}</h4>
                <p className="text-zinc-400 text-xs italic">{tooltip.label}</p>
              </div>
              <button
                onClick={() => setTooltip(null)}
                className="text-zinc-600 hover:text-white ml-4 text-xl leading-none transition-colors shrink-0"
              >
                ×
              </button>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">{tooltip.desc}</p>
          </div>
        </div>
      )}

      {/* Phase indicator — bottom right */}
      <div className="absolute bottom-4 right-6 text-[9px] font-mono uppercase tracking-widest transition-all duration-500" style={{ color }}>
        {PHASE_LABELS[activePhase]}
      </div>

      {/* Click hint */}
      <div className="absolute bottom-4 left-6 text-[9px] font-mono uppercase tracking-widest text-zinc-700">
        Click markers to reveal
      </div>
    </div>
  );
};

export default WorldMap;
