import { useState, useMemo, useRef, useEffect } from "react";
import {
  Calculator,
  Github,
  Music,
  Target,
  Download,
  Settings,
  ChevronDown,
  Sliders,
  Info,
  Guitar,
} from "lucide-react";
import * as api from "../services/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FretResult {
  fret: number;
  "distance-to-nut": number;
  "distance-to-bridge": number;
}

interface ScalePreset {
  id: string;
  label: string;
  length: number;
}

interface TuningPreset {
  id: string;
  label: string;
  notes: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FRET_OPTIONS = [12, 19, 20, 21, 22, 24, 27];



// ─── Sub-components ───────────────────────────────────────────────────────────

function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full ${className}`}
      style={{ background: "linear-gradient(90deg, transparent, #D4AF37 30%, #D4AF37 70%, transparent)" }}
    />
  );
}

function GuitarWireframe() {
  return (
    <svg
      viewBox="0 0 220 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-[0.06]"
      aria-hidden="true"
    >
      {/* Headstock */}
      <rect x="70" y="10" width="80" height="50" rx="6" stroke="#D4AF37" strokeWidth="1.2" />
      <line x1="80" y1="20" x2="80" y2="55" stroke="#D4AF37" strokeWidth="0.8" />
      <line x1="96" y1="20" x2="96" y2="55" stroke="#D4AF37" strokeWidth="0.8" />
      <line x1="112" y1="20" x2="112" y2="55" stroke="#D4AF37" strokeWidth="0.8" />
      <line x1="128" y1="20" x2="128" y2="55" stroke="#D4AF37" strokeWidth="0.8" />
      <line x1="144" y1="20" x2="144" y2="55" stroke="#D4AF37" strokeWidth="0.8" />
      <line x1="160" y1="20" x2="160" y2="55" stroke="#D4AF37" strokeWidth="0.8" />
      {/* Nut */}
      <rect x="75" y="60" width="70" height="4" rx="1" fill="#D4AF37" fillOpacity="0.3" stroke="#D4AF37" strokeWidth="0.8" />
      {/* Neck */}
      <rect x="80" y="64" width="60" height="260" rx="2" stroke="#D4AF37" strokeWidth="1" />
      {/* Fret lines */}
      {[0.0595, 0.1124, 0.1591, 0.2002, 0.2360, 0.2671, 0.2940, 0.3170, 0.3365, 0.3528, 0.3664, 0.3776, 0.4297, 0.4703, 0.5046, 0.5335, 0.5579, 0.5783, 0.5953, 0.6094, 0.6212, 0.6312].map(
        (pos, i) => (
          <line
            key={i}
            x1="80"
            y1={64 + pos * 260}
            x2="140"
            y2={64 + pos * 260}
            stroke="#D4AF37"
            strokeWidth={i === 0 ? 1.5 : 0.8}
          />
        )
      )}
      {/* Strings */}
      {[85, 92, 99, 106, 113, 120, 127, 134].slice(0, 6).map((x, i) => (
        <line key={i} x1={x + 2} y1="64" x2={x + 2} y2="324" stroke="#D4AF37" strokeWidth="0.5" />
      ))}
      {/* Body */}
      <ellipse cx="110" cy="360" rx="65" ry="55" stroke="#D4AF37" strokeWidth="1.2" />
      <ellipse cx="110" cy="340" rx="45" ry="35" stroke="#D4AF37" strokeWidth="0.8" />
      {/* Sound hole / pickup */}
      <ellipse cx="110" cy="360" rx="22" ry="8" stroke="#D4AF37" strokeWidth="0.8" />
      {/* Bridge */}
      <rect x="88" y="320" width="44" height="6" rx="2" stroke="#D4AF37" strokeWidth="0.8" />
    </svg>
  );
}

function FretboardVisualization({ results, scaleLength }: { results: FretResult[]; scaleLength: number }) {
  const boardHeight = 380;
  const boardWidth = 100;
  const nutY = 20;
  const bridgeY = nutY + boardHeight;
  const highlighted = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Guitar size={14} className="text-primary" />
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Visualização da Escala</span>
      </div>
      <div className="flex-1 flex justify-center">
        <svg viewBox={`0 0 ${boardWidth + 120} ${boardHeight + 50}`} className="h-full max-h-[420px]" aria-label="Fretboard visualization">
          {/* Board background */}
          <rect x="20" y={nutY} width={boardWidth} height={boardHeight} rx="4" fill="#1a1208" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.5" />
          {/* Nut */}
          <rect x="20" y={nutY} width={boardWidth} height="5" rx="2" fill="#D4AF37" fillOpacity="0.6" />
          <text x="130" y={nutY + 4} fill="#D4AF37" fontSize="8" fontFamily="JetBrains Mono, monospace" opacity="0.8">PESTANA</text>
          {/* Bridge */}
          <rect x="20" y={bridgeY} width={boardWidth} height="5" rx="2" fill="#D4AF37" fillOpacity="0.3" />
          <text x="130" y={bridgeY + 4} fill="#D4AF37" fontSize="8" fontFamily="JetBrains Mono, monospace" opacity="0.6">PONTE</text>

          {/* Strings */}
          {[0.15, 0.28, 0.41, 0.59, 0.72, 0.85].map((ratio, i) => (
            <line
              key={i}
              x1={20 + boardWidth * ratio}
              y1={nutY + 5}
              x2={20 + boardWidth * ratio}
              y2={bridgeY}
              stroke="#D4AF37"
              strokeWidth={0.4 + i * 0.15}
              strokeOpacity="0.4"
            />
          ))}

          {/* Fret lines */}
          {results.map((r) => {
            const y = nutY + (r["distance-to-nut"] / scaleLength) * boardHeight;
            const isHighlighted = highlighted.includes(r.fret);
            const showLabel = [1, 3, 5, 7, 9, 12, 17, 22, 24].includes(r.fret);
            return (
              <g key={r.fret}>
                <line
                  x1="20"
                  y1={y}
                  x2={20 + boardWidth}
                  y2={y}
                  stroke={isHighlighted ? "#D4AF37" : "#8a7040"}
                  strokeWidth={isHighlighted ? 1.2 : 0.7}
                  strokeOpacity={isHighlighted ? 0.9 : 0.5}
                />
                {/* Fret dots */}
                {[5, 7, 9].includes(r.fret) && (
                  <circle
                    cx={20 + boardWidth / 2}
                    cy={y - (results[r.fret - 2]?.["distance-to-nut"] ? (y - (nutY + (results[r.fret - 2]["distance-to-nut"] / scaleLength) * boardHeight)) / 2 : 8)}
                    r="3"
                    fill="#D4AF37"
                    fillOpacity="0.25"
                  />
                )}
                {r.fret === 12 && (
                  <>
                    <circle
                      cx={20 + boardWidth * 0.3}
                      cy={y - 8}
                      r="3"
                      fill="#D4AF37"
                      fillOpacity="0.3"
                    />
                    <circle
                      cx={20 + boardWidth * 0.7}
                      cy={y - 8}
                      r="3"
                      fill="#D4AF37"
                      fillOpacity="0.3"
                    />
                  </>
                )}
                {showLabel && (
                  <text
                    x="8"
                    y={y + 3}
                    fill="#D4AF37"
                    fontSize="7"
                    fontFamily="JetBrains Mono, monospace"
                    textAnchor="middle"
                    opacity={isHighlighted ? "0.9" : "0.5"}
                  >
                    {r.fret}
                  </text>
                )}
                {showLabel && (
                  <text
                    x={20 + boardWidth + 4}
                    y={y + 3}
                    fill="#e8e0d0"
                    fontSize="6.5"
                    fontFamily="JetBrains Mono, monospace"
                    opacity="0.55"
                  >
                    {r["distance-to-nut"].toFixed(1)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [scaleType, setScaleType] = useState<"preset" | "custom">("preset");
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customScale, setCustomScale] = useState("648");
  const [numFrets, setNumFrets] = useState(22);
  const [selectedTuning, setSelectedTuning] = useState<string | null>(null);
  const [results, setResults] = useState<FretResult[] | null>(null);
  const [calculatedScale, setCalculatedScale] = useState<number | null>(null);
  const [hoveredFret, setHoveredFret] = useState<number | null>(null);
  
  // API states
  const [scalesData, setScalesData] = useState<ScalePreset[]>([]);
  const [tuningsData, setTuningsData] = useState<TuningPreset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  // Carregar escalas e afinações na inicialização
  useEffect(() => {
    const loadData = async () => {
      try {
        const [scales, tunings] = await Promise.all([
          api.getScales(),
          api.getTunings(),
        ]);
        setScalesData(scales.scales);
        setTuningsData(tunings.tunings);
      } catch (err) {
        console.error("Erro ao carregar dados da API:", err);
        setError("Erro ao carregar escalas e afinações");
      }
    };
    loadData();
  }, []);

  const scaleLength = useMemo(() => {
    if (scaleType === "preset" && scalesData.length > 0) {
      return scalesData[selectedPreset]?.length || 648;
    }
    const v = parseFloat(customScale);
    return isNaN(v) ? 648 : v;
  }, [scaleType, selectedPreset, customScale, scalesData]);

  async function handleCalculate() {
    setIsLoading(true);
    setError(null);
    try {
      let res;
      if (scaleType === "preset" && scalesData.length > 0) {
        res = await api.calculateFretsWithScale(
          scalesData[selectedPreset].id,
          numFrets,
          selectedTuning || undefined
        );
      } else {
        res = await api.calculateFrets(
          scaleLength,
          numFrets,
          selectedTuning || undefined
        );
      }
      
      setResults(res.frets);
      setCalculatedScale(res["scale-length-mm"]);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao calcular trastes");
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }

  function handleExport() {
    if (!results || !calculatedScale) return;
    const rows = [
      ["Traste", "Dist. até Pestana (mm)", "Dist. até Ponte (mm)"],
      ...results.map((r) => [r.fret, r["distance-to-nut"], r["distance-to-bridge"]]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trastes-${calculatedScale}mm-${numFrets}f.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const scaleName =
    scaleType === "preset" && scalesData.length > 0
      ? scalesData[selectedPreset]?.label || "Desconhecido"
      : `Personalizada (${customScale} mm)`;

  return (
    <div
      className="min-h-screen text-foreground"
      style={{
        background: "linear-gradient(170deg, #050505 0%, #111111 40%, #0d0d0d 70%, #050505 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Header ────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: "rgba(5,5,5,0.92)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-8 h-8 flex items-center justify-center rounded"
              style={{ border: "1px solid rgba(212,175,55,0.4)", background: "rgba(212,175,55,0.06)" }}
            >
              <Guitar size={16} className="text-primary" />
            </div>
            <div>
              <div
                className="text-xs font-bold tracking-[0.2em] text-primary leading-none"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                LUTHIER VALDERRAMA
              </div>
              <div className="text-[10px] text-muted-foreground tracking-widest mt-0.5">
                Precisão em cada traste
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {["Calculadora", "Escalas", "Afinações", "Sobre"].map((item) => (
              <button
                key={item}
                className="text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors duration-200 uppercase"
                onClick={() => {
                  if (item === "Calculadora")
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* GitHub */}
          <a
            href="#"
            className="ml-auto flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
        </div>
        <GoldDivider />
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Wireframe bg */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="w-[420px] h-[600px] opacity-100">
            <GuitarWireframe />
          </div>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 pt-16 pb-8 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs tracking-widest uppercase text-primary"
            style={{ border: "1px solid rgba(212,175,55,0.25)", background: "rgba(212,175,55,0.04)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
            Ferramenta de Luteria de Precisão
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold text-primary mb-4 tracking-[0.06em]"
            style={{ fontFamily: "'Cinzel', serif", textShadow: "0 0 60px rgba(212,175,55,0.15)" }}
          >
            CALCULADORA DE TRASTES
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Calcule com precisão a distância de cada traste em relação à pestana e à ponte.{" "}
            <span className="text-foreground/60">Baseado na fórmula de divisão de oitavas de Marin Mersenne.</span>
          </p>
          <div className="mt-8 flex items-center justify-center gap-6">
            {[
              { val: "1/18", label: "Constante de Mersenne" },
              { val: "12 TET", label: "Temperamento Igual" },
              { val: "±0.01mm", label: "Precisão" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-lg font-bold text-primary"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {s.val}
                </div>
                <div className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <GoldDivider className="mt-8" />
      </section>

      {/* ── Configuration ─────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 py-10">
        <div
          className="rounded-xl p-6 md:p-8"
          style={{ border: "1px solid rgba(212,175,55,0.22)", background: "rgba(17,17,17,0.8)" }}
        >
          {/* Section header */}
          <div className="flex items-center gap-3 mb-8">
            <Settings size={16} className="text-primary" />
            <h2
              className="text-sm font-bold tracking-[0.25em] uppercase text-primary"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Configurações
            </h2>
            <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.15)" }} />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Left: Form */}
            <div className="space-y-7">
              {/* Scale type toggle */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-3">
                  Tipo de Escala
                </label>
                <div
                  className="inline-flex rounded-lg overflow-hidden"
                  style={{ border: "1px solid rgba(212,175,55,0.2)" }}
                >
                  {(["preset", "custom"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setScaleType(t)}
                      className="px-5 py-2.5 text-xs tracking-wider uppercase transition-all duration-200"
                      style={{
                        background: scaleType === t ? "#D4AF37" : "transparent",
                        color: scaleType === t ? "#050505" : "#888070",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: scaleType === t ? 600 : 400,
                      }}
                    >
                      {t === "preset" ? "Pré-definida" : "Personalizada"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale select / input */}
              {scaleType === "preset" ? (
                <div>
                  <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-3">
                    Escala
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPreset}
                      onChange={(e) => setSelectedPreset(Number(e.target.value))}
                      className="w-full appearance-none px-4 py-3 rounded-lg text-sm text-foreground pr-10 focus:outline-none focus:ring-1 transition-all duration-200"
                      style={{
                        background: "#1A1A1A",
                        border: "1px solid rgba(212,175,55,0.2)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {scalesData.map((p, i) => (
                        <option key={p.id} value={i} style={{ background: "#1A1A1A" }}>
                          {p.label} — {p.length} mm
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-3">
                    Comprimento da Escala (mm)
                  </label>
                  <input
                    type="number"
                    value={customScale}
                    onChange={(e) => setCustomScale(e.target.value)}
                    placeholder="648"
                    className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none transition-all duration-200"
                    style={{
                      background: "#1A1A1A",
                      border: "1px solid rgba(212,175,55,0.2)",
                      color: "#e8e0d0",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Ex: 648 mm (Fender), 628.65 mm (Gibson)
                  </p>
                </div>
              )}

              {/* Number of frets */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-3">
                  Número de Trastes
                </label>
                <div className="relative">
                  <select
                    value={numFrets}
                    onChange={(e) => setNumFrets(Number(e.target.value))}
                    className="w-full appearance-none px-4 py-3 rounded-lg text-sm text-foreground pr-10 focus:outline-none transition-all duration-200"
                    style={{
                      background: "#1A1A1A",
                      border: "1px solid rgba(212,175,55,0.2)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {FRET_OPTIONS.map((n) => (
                      <option key={n} value={n} style={{ background: "#1A1A1A" }}>
                        {n} trastes
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Tuning */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-3">
                  Afinação
                </label>
                <div className="relative">
                  <select
                    value={selectedTuning || ""}
                    onChange={(e) => setSelectedTuning(e.target.value || null)}
                    className="w-full appearance-none px-4 py-3 rounded-lg text-sm text-foreground pr-10 focus:outline-none transition-all duration-200"
                    style={{
                      background: "#1A1A1A",
                      border: "1px solid rgba(212,175,55,0.2)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <option value="" style={{ background: "#1A1A1A" }}>
                      Nenhuma afinação
                    </option>
                    {tuningsData.map((t) => (
                      <option key={t.id} value={t.id} style={{ background: "#1A1A1A" }}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleCalculate}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-lg font-bold text-sm tracking-[0.15em] uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #D4AF37, #C99A2E)",
                  color: "#050505",
                  fontFamily: "'Cinzel', serif",
                  boxShadow: "0 4px 24px rgba(212,175,55,0.2)",
                }}
              >
                <Calculator size={16} />
                {isLoading ? "Calculando..." : "Calcular"}
              </button>
              {error && (
                <div className="p-3 rounded-lg bg-red-900/20 border border-red-700 text-red-300 text-xs">
                  {error}
                </div>
              )}
            </div>

            {/* Right: Info card */}
            <div
              className="rounded-xl p-6 flex flex-col gap-5"
              style={{ border: "1px solid rgba(212,175,55,0.12)", background: "rgba(26,26,26,0.5)" }}
            >
              <div className="flex items-center gap-2">
                <Info size={14} className="text-primary" />
                <h3
                  className="text-xs font-bold tracking-[0.2em] uppercase text-primary"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Sobre a Calculadora
                </h3>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Esta ferramenta aplica a fórmula matemática fundamental da luteria moderna para calcular a posição exata de cada traste em relação à pestana e à ponte.
              </p>

              <div
                className="rounded-lg p-4"
                style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.1)" }}
              >
                <div className="text-xs text-muted-foreground mb-2 tracking-wider uppercase">Fórmula de Marin Mersenne</div>
                <div
                  className="text-sm text-primary font-mono"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  d(n) = L × (1 − 1 / 2^(n/12))
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Onde <span className="text-foreground">L</span> = comprimento da escala e <span className="text-foreground">n</span> = número do traste
                </div>
              </div>

              {/* Mini fretboard wireframe */}
              <div className="flex-1 flex items-center justify-center opacity-80">
                <div className="relative w-full" style={{ maxHeight: "180px", overflow: "hidden" }}>
                  <svg viewBox="0 0 300 160" fill="none" className="w-full">
                    {/* Neck outline */}
                    <rect x="10" y="20" width="280" height="120" rx="4" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.3" />
                    {/* Nut */}
                    <rect x="10" y="20" width="6" height="120" fill="#D4AF37" fillOpacity="0.2" />
                    {/* Bridge */}
                    <rect x="284" y="20" width="6" height="120" fill="#D4AF37" fillOpacity="0.1" />
                    {/* Strings */}
                    {[30, 46, 62, 78, 94, 110].map((y) => (
                      <line key={y} x1="16" y1={y} x2="284" y2={y} stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.25" />
                    ))}
                    {/* Frets at proportional positions */}
                    {[0.0595, 0.1124, 0.1591, 0.2002, 0.2360, 0.2671, 0.2940, 0.3170, 0.3365, 0.3528, 0.3664, 0.3776].map(
                      (pos, i) => {
                        const x = 16 + pos * 268;
                        return (
                          <g key={i}>
                            <line x1={x} y1="20" x2={x} y2="140" stroke="#D4AF37" strokeWidth={i === 11 ? 1.2 : 0.6} strokeOpacity={i === 11 ? 0.5 : 0.25} />
                            <text x={x - 3} y="155" fill="#D4AF37" fontSize="7" opacity="0.4" fontFamily="JetBrains Mono, monospace">{i + 1}</text>
                          </g>
                        );
                      }
                    )}
                    {/* Dot markers */}
                    {[4, 6, 8, 10].map((fret) => {
                      const pos = 1 - 1 / Math.pow(2, fret / 12);
                      const x = 16 + pos * 268;
                      const prevPos = 1 - 1 / Math.pow(2, (fret - 1) / 12);
                      const prevX = 16 + prevPos * 268;
                      return (
                        <circle key={fret} cx={(x + prevX) / 2} cy="80" r="5" fill="#D4AF37" fillOpacity="0.15" />
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-auto">
                {[
                  { label: "Precisão", val: "±0.01mm" },
                  { label: "Escalas", val: "6+" },
                  { label: "Afinações", val: "6+" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg p-3 text-center"
                    style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.08)" }}
                  >
                    <div
                      className="text-sm font-bold text-primary"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {s.val}
                    </div>
                    <div className="text-[10px] text-muted-foreground tracking-wider uppercase mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Results ───────────────────────────────────────────── */}
      <section ref={resultsRef} className="max-w-[1400px] mx-auto px-6 pb-10">
        <div
          className="rounded-xl p-6 md:p-8"
          style={{
            border: "1px solid rgba(212,175,55,0.22)",
            background: "rgba(17,17,17,0.8)",
            minHeight: results ? "auto" : "200px",
          }}
        >
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sliders size={16} className="text-primary" />
              <h2
                className="text-sm font-bold tracking-[0.25em] uppercase text-primary"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Resultados
              </h2>
            </div>
            {results && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs tracking-widest uppercase transition-all duration-200 hover:opacity-80"
                style={{
                  border: "1px solid rgba(212,175,55,0.35)",
                  color: "#D4AF37",
                  background: "rgba(212,175,55,0.06)",
                }}
              >
                <Download size={12} />
                Exportar CSV
              </button>
            )}
          </div>

          {!results ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ border: "1px solid rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.04)" }}
              >
                <Calculator size={22} className="text-primary opacity-60" />
              </div>
              <p className="text-muted-foreground text-sm">
                Configure os parâmetros acima e clique em{" "}
                <span className="text-primary font-medium">CALCULAR</span> para ver os resultados.
              </p>
            </div>
          ) : (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  {
                    icon: <Guitar size={16} className="text-primary" />,
                    label: "Escala Utilizada",
                    value: scaleName,
                    mono: false,
                  },
                  {
                    icon: <Target size={16} className="text-primary" />,
                    label: "Comprimento da Escala",
                    value: `${calculatedScale} mm`,
                    mono: true,
                  },
                  {
                    icon: <Music size={16} className="text-primary" />,
                    label: "Quantidade de Trastes",
                    value: `${numFrets} trastes`,
                    mono: true,
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="rounded-lg p-4 flex flex-col gap-2"
                    style={{ border: "1px solid rgba(212,175,55,0.15)", background: "rgba(26,26,26,0.6)" }}
                  >
                    <div className="flex items-center gap-2">
                      {card.icon}
                      <span className="text-[10px] tracking-widest uppercase text-muted-foreground">
                        {card.label}
                      </span>
                    </div>
                    <div
                      className="text-base font-semibold text-foreground"
                      style={{ fontFamily: card.mono ? "'JetBrains Mono', monospace" : "'Cinzel', serif" }}
                    >
                      {card.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Table + Fretboard */}
              <div className="grid md:grid-cols-[1fr_240px] gap-6">
                {/* Table */}
                <div className="overflow-auto rounded-lg" style={{ border: "1px solid rgba(212,175,55,0.12)" }}>
                  <table className="w-full text-sm" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
                    <thead>
                      <tr style={{ background: "rgba(212,175,55,0.08)" }}>
                        {["Traste", "Dist. até Pestana (mm)", "Dist. até Ponte (mm)"].map(
                          (col) => (
                            <th
                              key={col}
                              className="px-4 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-primary"
                              style={{
                                fontFamily: "'Cinzel', serif",
                                borderBottom: "1px solid rgba(212,175,55,0.2)",
                              }}
                            >
                              {col}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, idx) => {
                        const isOctave = r.fret === 12 || r.fret === 24;
                        const isHovered = hoveredFret === r.fret;
                        return (
                          <tr
                            key={r.fret}
                            onMouseEnter={() => setHoveredFret(r.fret)}
                            onMouseLeave={() => setHoveredFret(null)}
                            style={{
                              background: isHovered
                                ? "rgba(212,175,55,0.08)"
                                : isOctave
                                ? "rgba(212,175,55,0.04)"
                                : idx % 2 === 0
                                ? "transparent"
                                : "rgba(255,255,255,0.015)",
                              borderBottom: "1px solid rgba(212,175,55,0.06)",
                              transition: "background 0.15s ease",
                              cursor: "default",
                            }}
                          >
                            <td className="px-4 py-2.5">
                              <span
                                className="font-bold"
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  color: isOctave ? "#D4AF37" : "#e8e0d0",
                                  fontSize: "13px",
                                }}
                              >
                                {r.fret}
                                {isOctave && (
                                  <span className="ml-2 text-[9px] text-primary opacity-70 tracking-wider">
                                    OITAVA
                                  </span>
                                )}
                              </span>
                            </td>
                            <td
                              className="px-4 py-2.5"
                              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#c8c0b0" }}
                            >
                              {r["distance-to-nut"].toFixed(2)}
                            </td>
                            <td
                              className="px-4 py-2.5"
                              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#c8c0b0" }}
                            >
                              {r["distance-to-bridge"].toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Fretboard visualization */}
                <div
                  className="rounded-lg p-4"
                  style={{ border: "1px solid rgba(212,175,55,0.12)", background: "rgba(26,26,26,0.4)" }}
                >
                  <FretboardVisualization results={results} scaleLength={calculatedScale!} />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Feature strip ─────────────────────────────────────── */}
      <section
        style={{ borderTop: "1px solid rgba(212,175,55,0.15)", background: "rgba(10,10,10,0.8)" }}
        className="py-10"
      >
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              icon: <Target size={20} className="text-primary" />,
              title: "Precisão",
              desc: "Cálculos matemáticos com tolerância de ±0.01 mm baseados na fórmula de Mersenne.",
            },
            {
              icon: <Guitar size={20} className="text-primary" />,
              title: "Personalização",
              desc: "Suporte a escalas pré-definidas ou comprimentos customizados para qualquer instrumento.",
            },
            {
              icon: <Music size={20} className="text-primary" />,
              title: "Afinações",
              desc: "Compatível com Standard, Drop D, Open G, DADGAD e diversas afinações alternativas.",
            },
            {
              icon: <Download size={20} className="text-primary" />,
              title: "Exportação",
              desc: "Exporte os resultados em CSV para uso em seus projetos de luteria.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 p-5 rounded-lg transition-all duration-200 hover:border-primary/30"
              style={{ border: "1px solid rgba(212,175,55,0.1)", background: "rgba(17,17,17,0.4)" }}
            >
              <div
                className="w-9 h-9 rounded flex items-center justify-center"
                style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}
              >
                {f.icon}
              </div>
              <div
                className="text-xs font-bold tracking-widest uppercase text-primary"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {f.title}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(212,175,55,0.1)", background: "#050505" }}>
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 flex items-center justify-center rounded"
              style={{ border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.05)" }}
            >
              <Guitar size={13} className="text-primary" />
            </div>
            <div>
              <div
                className="text-xs font-bold tracking-[0.18em] text-primary"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                LUTHIER VALDERRAMA
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                Desenvolvido com precisão para luthiers e músicos.
              </div>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground tracking-wider">
            © 2026 Luthier Valderrama. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
