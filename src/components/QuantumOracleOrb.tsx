import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, X, Compass, Radio, Sparkles, Send, Activity, HelpCircle } from "lucide-react";

// Inline simple tone synthesizer feedback for extreme high-tech physical touch sensation
function playTechBeep(frequency = 1200, duration = 0.04, type: OscillatorType = "sine") {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    // Smooth decay to prevent popping
    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (error) {
    // Fail silently if browser blocks audio autoplay/context
  }
}

interface OracleCurationPreset {
  title: string;
  energy: string;
  text: string;
}

const PRESETS: Record<string, OracleCurationPreset> = {
  oasis: {
    title: "Minimalist Oasis (비움의 오아시스)",
    energy: "FREQ 89.2 MHz // PURITY: 99.4%",
    text: "극도의 비움을 지향하는 오아시스 공간은 백색 회벽과 굵은 질감의 리넨이 극적인 대조를 이루며 시선의 고요를 유도합니다. 오직 미세한 모서리의 두께 차이와 흐르는 자연광의 소실점만이 존재를 증명하며, 머무는 이의 호흡을 정화합니다."
  },
  monolith: {
    title: "Symmetric Monolith (대칭적 모놀리스)",
    energy: "FREQ 112.5 MHz // PURITY: 98.9%",
    text: "차가운 다크 그레이 콘크리트로 성형된 대칭 사각 기둥은 공간에 강력한 중력과 기하학적 균형을 부여합니다. 가공되지 않은 돌의 질감이 머금는 따뜻한 간접 램프의 빛은 한 조각의 거대 성소에 머무는 듯한 신성한 긴장을 느끼게 합니다."
  },
  bauhaus: {
    title: "Bauhaus Future (바우하우스 퓨처)",
    energy: "FREQ 142.0 MHz // PURITY: 97.6%",
    text: "크롬 도금 스틸 링과 구부러진 직조 철판 가죽은 기능이 곧 극상의 장식임을 증명하는 바우하우스의 연대기입니다. 1920년대의 비례감이 내포한 구조적 순수함은 인공지능 시대의 가상 주거 공간에서도 완벽한 대지 예술로 변주됩니다."
  },
  brutalist: {
    title: "Brutalist Shadow (브루탈리스트의 음영)",
    energy: "FREQ 72.8 MHz // PURITY: 95.8%",
    text: "거친 유입수 송판 노출 콘크리트 외벽은 문명과 순수 자연의 충돌을 날것 그대로 보존합니다. 어둠이 짙게 깔릴 때 일상의 소음은 돌담의 미세 기공 속으로 흡수되어 지워지며 오직 순수한 물성과 영적인 고막의 울림만이 살아남습니다."
  }
};

export function QuantumOracleOrb() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [typedText, setTypedText] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [systemUptime, setSystemUptime] = useState("00:00:00");
  const [interactiveCount, setInteractiveCount] = useState(0);
  
  // Custom typewriter speed variable
  const textIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Update system uptime simulated text
    const timer = setInterval(() => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setSystemUptime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerTypewriter = (text: string) => {
    if (textIntervalRef.current) clearInterval(textIntervalRef.current);
    setTypedText("");
    setIsTyping(true);
    let i = 0;
    
    // Play sound on initiation
    playTechBeep(1500, 0.1, "triangle");

    textIntervalRef.current = setInterval(() => {
      if (i < text.length) {
        // Increment typed letters
        const currentLetter = text.charAt(i);
        setTypedText((prev) => prev + currentLetter);
        
        // Play very quiet tap sound occasionally
        if (i % 3 === 0) {
          playTechBeep(600 + (i % 250), 0.015, "sine");
        }
        i++;
      } else {
        if (textIntervalRef.current) clearInterval(textIntervalRef.current);
        setIsTyping(false);
        playTechBeep(1800, 0.07, "sine");
      }
    }, 28);
  };

  const handleSelectPreset = (key: string) => {
    setActivePreset(key);
    setInteractiveCount((v) => v + 1);
    const content = PRESETS[key];
    triggerTypewriter(content.text);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setInteractiveCount((v) => v + 1);
    const textQuery = customPrompt.trim();
    setCustomPrompt("");
    setActivePreset("custom");

    // Formulate a beautiful poetic, dynamic architectural response based on user keywords
    let response = `ROUNDMAG A.I. 큐레이터가 입력 정보 '${textQuery}'를 공간 공진 벡터로 해석하였습니다.\n\n`;
    if (textQuery.includes("가구") || textQuery.includes("침대") || textQuery.includes("의자")) {
      response += "사물과 인체공학이 자아내는 고유의 기하학적 곡면은 그 어떤 화려한 수사보다 깊은 영감의 자취를 수반합니다. 당신이 머무는 휴식의 모서리에 간결함과 가죽의 섬세한 기품을 배치하세요.";
    } else if (textQuery.includes("검증") || textQuery.includes("메트로") || textQuery.includes("도시") || textQuery.includes("서울")) {
      response += "도심의 복잡성 속에서 의식적으로 소음을 단절하는 방음재의 물성과 저채도 마감재는 현대인이 구축해야 할 최후의 안식처가 됩니다. 불필요한 색채를 배제하고 침묵을 마중하십시오.";
    } else {
      response += `머릿속으로 상상했던 '${textQuery}'의 형태는 비어있는 차가운 평면 위에 빛의 궤적이 겹겹이 쌓여 가며 완성됩니다. 소박하며 견고하게 지어진 이 무드는 ROUNDMAG의 미학적 철학관과 완벽히 부합하며 공간을 치유하는 새로운 빛의 조화로 확장됩니다.`;
    }

    triggerTypewriter(response);
  };

  const handleToggleOpen = () => {
    playTechBeep(isOpen ? 600 : 1000, 0.06, "sine");
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Absolute floating bottom-right interactive orb widget */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        
        {/* Holographic glowing breathing circle trigger */}
        <button
          onClick={handleToggleOpen}
          onMouseEnter={() => playTechBeep(1300, 0.02, "sine")}
          className="group relative w-14 h-14 bg-zinc-950/90 backdrop-blur-md rounded-full border border-cyan-400/40 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xl z-50 focus:outline-none"
          title="ROUNDMAG Quantum Oracle"
        >
          {/* Animated concentric rings rotating in alternative speeds */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[3px] border border-dashed border-cyan-400/20 group-hover:border-cyan-400/50 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[6px] border border-cyan-400/10 group-hover:border-cyan-400/30 rounded-full"
          />

          {/* Central responsive blinking core icon */}
          <motion.div
            animate={{ scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative text-cyan-400 group-hover:text-cyan-300 z-10 flex items-center justify-center"
          >
            <Cpu className="h-5 w-5" />
          </motion.div>

          {/* Glowing pulse aura */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/10 animate-ping opacity-25 group-hover:opacity-40" />
        </button>

        {/* Portal Overlay Dialog */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="absolute bottom-18 right-2 w-[340px] sm:w-[400px] h-[520px] bg-zinc-950/95 backdrop-blur-xl border border-cyan-500/30 rounded-none shadow-2xl z-40 flex flex-col justify-between overflow-hidden font-mono text-xs text-zinc-300 shadow-cyan-950/20"
            >
              {/* Dynamic decorative radar headers (Cyber HUD specs) */}
              <div className="relative border-b border-cyan-500/20 px-4 py-3 bg-zinc-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <div className="text-[10px] font-bold tracking-widest text-[#22D3EE] flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    <span>ROUNDMAG NEURAL ORACLE v1.4</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-zinc-500">{systemUptime}</span>
                  <button 
                    onClick={handleToggleOpen}
                    className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 h-[1px] bg-cyan-400 w-1/3 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </div>

              {/* Core Body Container */}
              <div className="flex-grow p-4 overflow-y-auto space-y-4 font-sans leading-relaxed">
                
                {/* Introduction greeting message */}
                <div className="bg-zinc-900/40 p-3.5 border border-zinc-800 text-zinc-400 space-y-2">
                  <p className="text-zinc-300 font-mono text-[10px] font-bold text-cyan-400 tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    SYSTEM STIMULATION INITIATOR
                  </p>
                  <p className="text-xs">
                    가구, 오브제, 건축의 심오한 비례와 미학적 내러티브를 분석하는 뉴럴 네트워크 코어입니다. 공간의 주파수를 링킹해 보세요.
                  </p>
                </div>

                {/* Preset Interactive buttons */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 font-semibold tracking-wider">CHOOSE PRESET CHANNELS :</span>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(PRESETS).map(([key, data]) => (
                      <button
                        key={key}
                        onClick={() => handleSelectPreset(key)}
                        className={`text-left p-2 border text-[11px] font-mono select-none cursor-pointer transition ${
                          activePreset === key 
                            ? "bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.2)]" 
                            : "bg-zinc-900/10 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                        }`}
                      >
                        <div className="font-bold truncate text-[10px]">{data.title}</div>
                        <div className="text-[8px] text-zinc-500 font-semibold">{data.energy}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Diagnostic Output */}
                <div className="border border-zinc-800 bg-zinc-900/80 p-3 h-48 overflow-y-auto rounded-none font-mono text-[11px] leading-relaxed relative flex flex-col shadow-inner">
                  {/* Floating telemetry lines */}
                  <div className="text-[8px] text-zinc-600 border-b border-zinc-800 pb-1 mb-1.5 flex justify-between uppercase">
                    <span>Curation Data Sync Matrix</span>
                    <span>Int-Level {interactiveCount}L</span>
                  </div>

                  {activePreset ? (
                    <div className="whitespace-pre-wrap font-sans text-xs text-zinc-200 scrollbar-none">
                      {typedText}
                      {isTyping && (
                        <span className="inline-block w-1.5 h-3 bg-cyan-400 animate-pulse ml-0.5" />
                      )}
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center text-zinc-550 py-4 font-mono space-y-1">
                      <Compass className="h-7 w-7 text-zinc-700 animate-spin" style={{ animationDuration: "12s" }} />
                      <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest mt-1">AWAITING POLAR COORDINATES</p>
                      <p className="text-[9px]">Select any frequency preset or write a custom spatial query below.</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Terminal input form */}
              <form 
                onSubmit={handleCustomSubmit}
                className="border-t border-cyan-500/20 px-3 py-3 bg-zinc-900/80 flex items-center gap-2"
              >
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="E.g. 콘크리트 인테리어, 모던 가구..."
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-400 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 rounded-none focus:outline-none transition font-sans pr-8"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[8px] text-zinc-600 font-bold select-none uppercase">PROMPT</span>
                </div>
                
                <button
                  type="submit"
                  disabled={!customPrompt.trim() || isTyping}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black px-3.5 py-2 hover:shadow-[0_0_8px_rgba(34,211,238,0.4)] transition disabled:opacity-30 disabled:hover:shadow-none cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Send className="h-3.5 w-3.5 font-bold" />
                </button>
              </form>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}
