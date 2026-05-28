import React, { useState, useEffect, useRef } from "react";
import { 
  Volume2, 
  VolumeX, 
  Trash2, 
  Delete, 
  History, 
  HelpCircle,
  Hash,
  Sparkles,
  Activity,
  Cpu,
  Layers,
  Settings,
  HelpCircle as InfoIcon
} from "lucide-react";

interface HistoryItem {
  id: string;
  equation: string;
  result: string;
  timestamp: string;
}

export default function App() {
  // Calculator Display & Core States
  const [currVal, setCurrVal] = useState<string>("0");
  const [accumVal, setAccumVal] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [expression, setExpression] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [lastBtnWasEquals, setLastBtnWasEquals] = useState<boolean>(false);

  // Preference & Layout States
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "demo1",
      equation: "√ (144) + 52",
      result: "64",
      timestamp: "12:04 PM"
    },
    {
      id: "demo2",
      equation: "2500 / 0.15",
      result: "16666.67",
      timestamp: "11:58 AM"
    }
  ]);
  const [shakeTrigger, setShakeTrigger] = useState<boolean>(false);
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);
  
  // High-Density Unified System Pipeline States
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [keystrokeCount, setKeystrokeCount] = useState<number>(12);
  const [peakResult, setPeakResult] = useState<number>(16666.67);
  const [processorState, setProcessorState] = useState<"IDLE" | "COMPUTING" | "HALTED">("IDLE");
  const [memoryHeap, setMemoryHeap] = useState<number>(14);

  // Audio Context Ref for instant click synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Standard interval for elapsed dynamic session counter
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionSeconds(p => p + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format the visual elapsed timer to standard HH:MM:SS format
  const formatSessionTime = (): string => {
    const hrs = Math.floor(sessionSeconds / 3600);
    const mins = Math.floor((sessionSeconds % 3600) / 60);
    const secs = sessionSeconds % 60;
    
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  // Play synthetic haptic click or custom error slide using Web Audio API
  const playSound = (type: "click" | "error" | "clear") => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === "suspended") {
        ctx?.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === "clear") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(190, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(85, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.start();
        osc.stop(ctx.currentTime + 0.28);
      }
    } catch (e) {
      console.warn("Audio Context is blocked or not supported by this container framework", e);
    }
  };

  // Helper to trigger momentary "COMPUTING" processor visual light flash
  const triggerComputingFlash = () => {
    setKeystrokeCount(prev => prev + 1);
    setMemoryHeap(prev => Math.min(95, Math.max(10, prev + (Math.random() > 0.5 ? 1 : -1))));
    setProcessorState("COMPUTING");
    setTimeout(() => {
      setProcessorState(prev => prev === "COMPUTING" ? "IDLE" : prev);
    }, 180);
  };

  // Helper: Trigger visual display shake on error or invalid clicks
  const triggerShake = () => {
    setShakeTrigger(true);
    setTimeout(() => setShakeTrigger(false), 500);
  };

  // Helper: Safely evaluate math without eval() to avoid floating point anomalies and catch division by zero
  const calculate = (v1: number, v2: number, op: string): number => {
    switch (op) {
      case "+":
        return v1 + v2;
      case "-":
        return v1 - v2;
      case "×":
        return v1 * v2;
      case "÷":
        if (v2 === 0) {
          throw new Error("DivByZero");
        }
        return v1 / v2;
      default:
        return v2;
    }
  };

  // Helper: Truncate and prettify floats to prevent JS rounding bugs (e.g. 0.1 + 0.2 = 0.3)
  const formatResult = (val: number): string => {
    if (!isFinite(val)) return "NaN";
    if (Math.abs(val) > 1e12 || (Math.abs(val) < 1e-9 && val !== 0)) {
      return val.toExponential(7);
    }
    const rounded = parseFloat(val.toFixed(10));
    return rounded.toString();
  };

  // Format numbers on screen with user-friendly thousand separators (commas), preserving fractional structure
  const formatDisplayNumber = (numStr: string): string => {
    if (isError) return numStr;
    if (numStr === "NaN" || numStr === "Infinity" || numStr === "-Infinity") return numStr;
    
    const parts = numStr.split(".");
    const intPart = parts[0];
    const decimalPart = parts.length > 1 ? "." + parts[1] : "";
    
    // Format integer part using standard helper
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedInt + decimalPart;
  };

  // Set visual font sizes dynamically based on display digits length to preserve layout limits
  const getFontSizeClass = (text: string) => {
    const len = text.length;
    if (len <= 9) return "text-4xl md:text-5xl font-light";
    if (len <= 14) return "text-2xl md:text-3xl font-light";
    if (len <= 18) return "text-xl md:text-2xl font-light";
    return "text-lg md:text-xl break-all font-light leading-tight";
  };

  // Trigger digit click
  const appendDigit = (digit: string) => {
    playSound("click");
    triggerComputingFlash();
    
    if (isError) {
      clearAll();
      setCurrVal(digit);
      return;
    }

    if (lastBtnWasEquals) {
      setCurrVal(digit);
      setLastBtnWasEquals(false);
      setExpression("");
      return;
    }

    if (currVal.replace(/[.-]/g, "").length >= 15) {
      triggerShake();
      return;
    }

    if (currVal === "0") {
      setCurrVal(digit);
    } else {
      setCurrVal(currVal + digit);
    }
  };

  // Decimal logic
  const appendDecimal = () => {
    playSound("click");
    triggerComputingFlash();
    
    if (isError) {
      clearAll();
      setCurrVal("0.");
      return;
    }

    if (lastBtnWasEquals) {
      setCurrVal("0.");
      setLastBtnWasEquals(false);
      setExpression("");
      return;
    }

    if (currVal.includes(".")) {
      triggerShake();
      return;
    }

    setCurrVal(currVal + ".");
  };

  // Single Clear action (C)
  const clearAll = () => {
    playSound("clear");
    setProcessorState("IDLE");
    setCurrVal("0.");
    setTimeout(() => setCurrVal("0"), 30);
    setAccumVal(null);
    setPendingOp(null);
    setExpression("");
    setIsError(false);
    setLastBtnWasEquals(false);
  };

  // Backspace logic (DEL)
  const performBackspace = () => {
    playSound("click");
    triggerComputingFlash();
    
    if (isError) {
      clearAll();
      return;
    }

    if (lastBtnWasEquals) {
      setExpression("");
      return;
    }

    if (currVal.length <= 1 || currVal === "0") {
      setCurrVal("0");
    } else {
      const newVal = currVal.slice(0, -1);
      if (newVal === "-" || newVal === "") {
        setCurrVal("0");
      } else {
        setCurrVal(newVal);
      }
    }
  };

  // Interactive +/- negative-positive toggle
  const toggleSign = () => {
    playSound("click");
    triggerComputingFlash();
    if (isError) return;

    if (currVal === "0") return;

    if (currVal.startsWith("-")) {
      setCurrVal(currVal.slice(1));
    } else {
      setCurrVal("-" + currVal);
    }
  };

  // Division-safe instant Percentage operation (%)
  const applyPercentage = () => {
    playSound("click");
    triggerComputingFlash();
    if (isError) return;

    const currentNum = parseFloat(currVal);
    if (isNaN(currentNum)) return;

    const result = currentNum / 100;
    setCurrVal(formatResult(result));
  };

  // Selecting operators: +, -, ×, ÷
  const chooseOperator = (op: string) => {
    playSound("click");
    triggerComputingFlash();
    if (isError) return;

    const currentNum = parseFloat(currVal);

    if (currVal === "0" && accumVal !== null && pendingOp !== null && !lastBtnWasEquals) {
      setPendingOp(op);
      setExpression(`${formatResult(accumVal)} ${op}`);
      return;
    }

    if (accumVal === null) {
      setAccumVal(currentNum);
      setPendingOp(op);
      setExpression(`${formatResult(currentNum)} ${op}`);
      setCurrVal("0");
    } else {
      try {
        const calculated = calculate(accumVal, currentNum, pendingOp!);
        const formatted = formatResult(calculated);
        setAccumVal(calculated);
        setPendingOp(op);
        setExpression(`${formatted} ${op}`);
        setCurrVal("0");
      } catch (err: any) {
        handleMathError(err);
      }
    }
    setLastBtnWasEquals(false);
  };

  // Solve the formula (=)
  const evaluate = () => {
    playSound("click");
    if (isError || pendingOp === null || accumVal === null) {
      triggerShake();
      return;
    }

    const currentNum = parseFloat(currVal);
    setProcessorState("COMPUTING");

    try {
      const calculatedResult = calculate(accumVal, currentNum, pendingOp);
      const resultFmt = formatResult(calculatedResult);
      
      const fullEquation = `${expression} ${currVal}`;
      setExpression(`${fullEquation} =`);
      
      // Update Peak Result stats dynamically
      const absResult = Math.abs(calculatedResult);
      if (absResult > peakResult) {
        setPeakResult(parseFloat(absResult.toFixed(4)));
      }

      // Save item to calculation history
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        equation: fullEquation,
        result: resultFmt,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      };
      
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 30));
      setCurrVal(resultFmt);
      setAccumVal(null);
      setPendingOp(null);
      setLastBtnWasEquals(true);
      
      setTimeout(() => {
        setProcessorState("IDLE");
      }, 250);
    } catch (err: any) {
      handleMathError(err);
    }
  };

  // Central Error routing
  const handleMathError = (err: any) => {
    playSound("error");
    triggerShake();
    setIsError(true);
    setProcessorState("HALTED");
    if (err.message === "DivByZero") {
      setCurrVal("Cannot divide by 0");
    } else {
      setCurrVal("Math Error");
    }
    setExpression("");
    setAccumVal(null);
    setPendingOp(null);
  };

  // Load calculation back from history
  const restoreHistory = (item: HistoryItem) => {
    playSound("clear");
    setIsError(false);
    setProcessorState("IDLE");
    setCurrVal(item.result);
    setExpression(item.equation + " =");
    setAccumVal(null);
    setPendingOp(null);
    setLastBtnWasEquals(true);
  };

  // Clear entire history board
  const clearHistoryTape = () => {
    playSound("clear");
    setHistory([]);
  };

  // Keyboard mapping listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (infoModalOpen) return;
      const key = e.key;

      if (/[0-9]/.test(key)) {
        e.preventDefault();
        appendDigit(key);
      } else if (key === "." || key === ",") {
        e.preventDefault();
        appendDecimal();
      } else if (key === "+") {
        e.preventDefault();
        chooseOperator("+");
      } else if (key === "-") {
        e.preventDefault();
        chooseOperator("-");
      } else if (key === "*" || key.toLowerCase() === "x") {
        e.preventDefault();
        chooseOperator("×");
      } else if (key === "/") {
        e.preventDefault();
        chooseOperator("÷");
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        evaluate();
      } else if (key === "Backspace") {
        e.preventDefault();
        performBackspace();
      } else if (key === "Escape" || key.toLowerCase() === "c") {
        e.preventDefault();
        clearAll();
      } else if (key === "%") {
        e.preventDefault();
        applyPercentage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currVal, accumVal, pendingOp, expression, isError, lastBtnWasEquals, soundEnabled, infoModalOpen]);

  return (
    <div className="min-h-screen bg-[#050508] text-[#E0E0E0] font-sans overflow-x-hidden p-4 sm:p-6 md:p-8 flex flex-col justify-between">
      
      {/* Decorative Orbs inside the Unified Quantum Workspace */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[8%] left-[25%] w-80 h-80 rounded-full bg-blue-900/10 blur-[130px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] rounded-full bg-indigo-950/15 blur-[160px]" />
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)", 
            backgroundSize: "20px 20px" 
          }} 
        />
      </div>

      {/* Main Container bound to the requested aesthetic layout bounds */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 relative z-10">
        
        {/* HEADER - Quantum Calc Brand & system telemetry indicators */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
          <div className="flex items-center gap-4"> 
            <div className="w-10 h-10 glass flex items-center justify-center shadow-md">
              <div className="w-5 h-5 bg-blue-500 rounded-sm transform rotate-45 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                QUANTUM<span className="text-blue-500">CALC</span>
              </h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                Unified Computation Engine v4.02
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6 items-center text-[11px] font-medium text-zinc-400 font-mono">
            <div className="flex flex-col items-end">
              <span className="text-zinc-600 font-bold text-[9px] tracking-wider uppercase">SESSION_TIME</span>
              <span className="text-white font-semibold">{formatSessionTime()}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-600 font-bold text-[9px] tracking-wider uppercase">MEM_USAGE</span>
              <span className="text-white font-semibold">1.2 MB</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
            
            {/* Action toggles merged directly into the computation panel bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-2 py-1 rounded transition-all border ${
                  soundEnabled 
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/25" 
                    : "bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10"
                }`}
                title={soundEnabled ? "Mute haptic audio click tones" : "Unmute haptic audio click tones"}
              >
                {soundEnabled ? "SOUND_ON" : "MUTED"}
              </button>
              
              <button
                onClick={() => setInfoModalOpen(true)}
                className="px-2 py-1 bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-all"
                title="Sleek Guide Map shortcut keys"
              >
                GUIDE
              </button>
            </div>

            <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full font-bold text-[10px] tracking-wider uppercase">
              SYNC_ACTIVE
            </div>
          </div>
        </header>

        {/* MAIN COMPOSITION - Double Grid layout (col-span-8 Arithmetic, col-span-4 Telemetry/History/Registers) */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* SECTION A: Arithmetic Pipeline Card (col-span-8) */}
          <section className="col-span-1 md:col-span-8 flex flex-col gap-4">
            <div className="glass p-6 flex flex-col gap-4 h-full relative overflow-hidden backdrop-blur-md">
              
              {/* LED digital screen element (OLED design sheet) */}
              <div 
                className={`h-32 w-full bg-black/40 rounded-xl border transition-all duration-200 p-6 flex flex-col justify-end items-end relative overflow-hidden ${
                  isError 
                    ? "border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]" 
                    : "border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                } ${shakeTrigger ? "animate-bounce scale-[0.99]" : ""}`}
              >
                <div className="absolute top-3 left-4 text-[10px] uppercase text-zinc-600 font-bold tracking-widest font-mono">
                  Arithmetic Pipeline
                </div>
                
                {/* Active memory state pill */}
                {accumVal !== null && (
                  <div className="absolute top-3 right-4 flex items-center gap-1 font-mono text-[9px] text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10">
                    <Layers className="w-3 h-3" />
                    <span>ACC: {formatResult(accumVal)}</span>
                  </div>
                )}

                {/* Equation trail line */}
                <div className="text-zinc-500 text-base md:text-lg lcd-text truncate max-w-full text-right h-7 mb-1 font-mono tracking-normal">
                  {expression || (accumVal !== null && pendingOp ? `${formatResult(accumVal)} ${pendingOp}` : "\u00A0")}
                </div>

                {/* Main Digital value output with font auto-sizing constraints */}
                <div className="text-white text-right w-full flex justify-end items-end select-text">
                  <span 
                    id="calculation_main_lcd_text"
                    className={`lcd-text tracking-wide ${getFontSizeClass(currVal)} ${
                      isError ? "text-red-400 font-normal" : "text-white"
                    }`}
                  >
                    {formatDisplayNumber(currVal)}
                  </span>
                </div>
              </div>

              {/* High Density Tactile Calculator grid (7-8-9, 4-5-6, 1-2-3, 0, ops) */}
              <div className="grid grid-cols-4 gap-3 flex-1 min-h-[360px]">
                
                {/* Row 1 */}
                <button 
                  onClick={clearAll}
                  className="glass glass-hover text-lg font-mono font-bold btn-danger cursor-pointer transition-all focus:outline-none"
                  title="Clear computation register buffers (C or Esc)"
                >
                  C
                </button>
                <button 
                  onClick={performBackspace} 
                  className="glass glass-hover text-base font-mono font-medium text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all focus:outline-none"
                  title="Delete last typed character symbol (Backspace)"
                >
                  <Delete className="w-4 h-4 text-zinc-400" />
                  DEL
                </button>
                <button 
                  onClick={applyPercentage}
                  className="glass glass-hover text-lg font-mono font-medium text-zinc-300 cursor-pointer transition-all focus:outline-none"
                  title="Apply immediate percentage calculation (%)"
                >
                  %
                </button>
                <button 
                  onClick={() => chooseOperator("÷")}
                  className={`glass glass-hover text-xl font-medium btn-primary cursor-pointer transition-all focus:outline-none ${
                    pendingOp === "÷" && currVal === "0" ? "shadow-[0_0_12px_rgba(59,130,246,0.3)] bg-blue-500/20 border-blue-400" : ""
                  }`}
                  title="Division Operator (/)"
                >
                  ÷
                </button>

                {/* Row 2 */}
                <button 
                  onClick={() => appendDigit("7")}
                  className="glass glass-hover text-2xl font-light font-mono text-zinc-100 cursor-pointer transition-all focus:outline-none"
                >
                  7
                </button>
                <button 
                  onClick={() => appendDigit("8")}
                  className="glass glass-hover text-2xl font-light font-mono text-zinc-100 cursor-pointer transition-all focus:outline-none"
                >
                  8
                </button>
                <button 
                  onClick={() => appendDigit("9")}
                  className="glass glass-hover text-2xl font-light font-mono text-zinc-100 cursor-pointer transition-all focus:outline-none"
                >
                  9
                </button>
                <button 
                  onClick={() => chooseOperator("×")}
                  className={`glass glass-hover text-xl font-medium btn-primary cursor-pointer transition-all focus:outline-none ${
                    pendingOp === "×" && currVal === "0" ? "shadow-[0_0_12px_rgba(59,130,246,0.3)] bg-blue-500/20 border-blue-400" : ""
                  }`}
                  title="Multiplication Operator (*)"
                >
                  ×
                </button>

                {/* Row 3 */}
                <button 
                  onClick={() => appendDigit("4")}
                  className="glass glass-hover text-2xl font-light font-mono text-zinc-100 cursor-pointer transition-all focus:outline-none"
                >
                  4
                </button>
                <button 
                  onClick={() => appendDigit("5")}
                  className="glass glass-hover text-2xl font-light font-mono text-zinc-100 cursor-pointer transition-all focus:outline-none"
                >
                  5
                </button>
                <button 
                  onClick={() => appendDigit("6")}
                  className="glass glass-hover text-2xl font-light font-mono text-zinc-100 cursor-pointer transition-all focus:outline-none"
                >
                  6
                </button>
                <button 
                  onClick={() => chooseOperator("-")}
                  className={`glass glass-hover text-xl font-medium btn-primary cursor-pointer transition-all focus:outline-none ${
                    pendingOp === "-" && currVal === "0" ? "shadow-[0_0_12px_rgba(59,130,246,0.3)] bg-blue-500/20 border-blue-400" : ""
                  }`}
                  title="Subtraction Operator (-)"
                >
                  -
                </button>

                {/* Row 4 */}
                <button 
                  onClick={() => appendDigit("1")}
                  className="glass glass-hover text-2xl font-light font-mono text-zinc-100 cursor-pointer transition-all focus:outline-none"
                >
                  1
                </button>
                <button 
                  onClick={() => appendDigit("2")}
                  className="glass glass-hover text-2xl font-light font-mono text-zinc-100 cursor-pointer transition-all focus:outline-none"
                >
                  2
                </button>
                <button 
                  onClick={() => appendDigit("3")}
                  className="glass glass-hover text-2xl font-light font-mono text-zinc-100 cursor-pointer transition-all focus:outline-none"
                >
                  3
                </button>
                <button 
                  onClick={() => chooseOperator("+")}
                  className={`glass glass-hover text-xl font-medium btn-primary cursor-pointer transition-all focus:outline-none ${
                    pendingOp === "+" && currVal === "0" ? "shadow-[0_0_12px_rgba(59,130,246,0.3)] bg-blue-500/20 border-blue-400" : ""
                  }`}
                  title="Addition Operator (+)"
                >
                  +
                </button>

                {/* Row 5 */}
                <button 
                  onClick={toggleSign}
                  className="glass glass-hover text-base font-mono font-medium text-zinc-300 cursor-pointer transition-all focus:outline-none"
                  title="Toggle positive/negative sign (+/-)"
                >
                  +/-
                </button>
                <button 
                  onClick={() => appendDigit("0")}
                  className="glass glass-hover text-2xl font-light font-mono text-zinc-100 cursor-pointer transition-all focus:outline-none"
                >
                  0
                </button>
                <button 
                  onClick={appendDecimal}
                  className="glass glass-hover text-2xl font-light font-mono text-zinc-100 cursor-pointer transition-all focus:outline-none"
                  title="Decimal separator point (.)"
                >
                  .
                </button>
                <button 
                  onClick={evaluate}
                  className="glass glass-hover text-2xl font-medium btn-accent cursor-pointer transition-all focus:outline-none shadow-md"
                  title="Evaluate math expression (Enter or =)"
                >
                  =
                </button>
                
              </div>
            </div>
          </section>

          {/* SECTION B: Calculation History & Memory Registers (col-span-4) */}
          <section className="col-span-1 md:col-span-4 flex flex-col gap-6">
            
            {/* Historical Tape Deck Panel */}
            <div className="glass flex-1 p-5 flex flex-col gap-4 backdrop-blur-md min-h-[290px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#60A5FA] flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-blue-400" />
                  Calculation History
                </h2>
                
                {history.length > 0 && (
                  <button 
                    onClick={clearHistoryTape}
                    className="text-[10px] uppercase font-mono text-red-400/80 hover:text-red-400 transition-colors flex items-center gap-1 focus:outline-none"
                    title="Flush history logs"
                  >
                    <Trash2 className="w-3 h-3" />
                    Flush
                  </button>
                )}
              </div>

              {/* Scrollable calculation tapes */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[250px] pr-1">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-zinc-600 text-xs font-mono">
                    No calculations logged.
                  </div>
                ) : (
                  history.map((record) => (
                    <div 
                      key={record.id}
                      onClick={() => restoreHistory(record)}
                      className="flex flex-col gap-1 group cursor-pointer"
                      title="Load calculation back to screen"
                    >
                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                        <span className="group-hover:text-amber-400/80 transition-colors">Unified Loop</span>
                        <span>{record.timestamp}</span>
                      </div>
                      <div className="p-3 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg border border-white/5 transition-all text-right">
                        <div className="text-xs text-zinc-400 truncate tracking-tight font-mono">{record.equation}</div>
                        <div className="text-sm font-bold text-[#60A5FA] tracking-tight truncate font-mono mt-0.5">
                          {formatDisplayNumber(record.result)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Hardware Memory Registers widget (High-density design specification) */}
            <div className="glass p-5 backdrop-blur-md">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#FBBF24] border-b border-white/5 pb-2 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Memory Registers
              </h2>
              
              <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] font-mono">
                {/* M1: Current internal stored accumulator register */}
                <div 
                  className={`flex items-center justify-between p-2 rounded transition-colors ${
                    accumVal !== null 
                      ? "bg-blue-500/10 border border-blue-500/20 text-blue-300"
                      : "bg-white/5 border border-white/10 text-zinc-400"
                  }`}
                  title="Accumulator active buffer register (M1)"
                >
                  <span className="font-bold text-[10px] opacity-70">M1</span>
                  <span className="font-bold truncate max-w-[65px] text-right">
                    {accumVal !== null ? formatResult(accumVal) : "0.00"}
                  </span>
                </div>

                {/* M2: Peak computed output value track */}
                <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10 text-zinc-300" title="Peak absolute outcome solved during the user session (M2)">
                  <span className="font-bold text-[10px] opacity-70">M2</span>
                  <span className="font-bold truncate max-w-[65px] text-right">
                    {peakResult > 0 ? formatResult(peakResult) : "0.00"}
                  </span>
                </div>

                {/* M3: Total physical key gestures registered */}
                <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10 text-zinc-300" title="Keystrokes interaction register (M3)">
                  <span className="font-bold text-[10px] opacity-70">M3</span>
                  <span className="font-bold text-right text-emerald-400">
                    #{keystrokeCount}
                  </span>
                </div>

                {/* M4: Integrated audio synthesis status trigger */}
                <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10 text-zinc-300" title="Synthetic instant click sounds engine active (M4)">
                  <span className="font-bold text-[10px] opacity-70">M4</span>
                  <span className={`font-bold uppercase text-[10px] ${soundEnabled ? "text-blue-400" : "text-zinc-600"}`}>
                    {soundEnabled ? "AUDIO_ON" : "MUTED"}
                  </span>
                </div>
              </div>
            </div>

          </section>
        </main>

        {/* FOOTER WIDGET - Live processor stats block matching the design HTML */}
        <footer className="h-auto md:h-12 glass flex flex-col md:flex-row items-start md:items-center px-6 py-3 md:py-0 justify-between text-[10px] uppercase font-semibold tracking-wider text-zinc-500 font-mono gap-3 md:gap-0 backdrop-blur-md">
          <div>
            Processor Status: <span className={`transition-colors font-bold ${
              processorState === "COMPUTING" 
                ? "text-yellow-400" 
                : processorState === "HALTED" 
                  ? "text-red-400 shadow-[0_0_8px_#f43f5e]" 
                  : "text-blue-400"
            }`}>{processorState}</span>
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-6">
            <span>Floating Point Logic: <span className="text-emerald-400 font-bold">OK</span></span>
            <span>Heap Alloc: <span className="text-white font-bold">{memoryHeap}%</span></span>
            <span>Thread Routing: <span className="text-blue-400 font-bold">#001A</span></span>
          </div>
          
          <div>Built for: Enterprise Financial Analysis</div>
        </footer>

      </div>

      {/* Shortcuts Guide Map Panel Overlay */}
      {infoModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass max-w-sm w-full p-6 relative bg-[#0a0a0f] border border-white/10">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2 border-b border-white/5 pb-2 font-mono uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Unified Keybindings
            </h3>
            
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed font-sans">
              Enter computation formulas with the dynamic layout board or instantly with physical keyboard shortcuts:
            </p>

            <div className="flex flex-col gap-2 mb-6 font-mono">
              {[
                { keys: "0 - 9", label: "Standard number inputs" },
                { keys: ".", label: "Add calculation decimal" },
                { keys: "+, -, *, /", label: "Add, subtract, multiply, divide ops" },
                { keys: "Enter or =", label: "Evaluate calculation pipeline" },
                { keys: "%", label: "Decimal point percentage transform" },
                { keys: "Backspace", label: "Delete last typed character symbol" },
                { keys: "Escape or C", label: "Flush computation session state" }
              ].map((shortcut, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] border-b border-white/[0.02] py-1">
                  <span className="bg-white/5 border border-white/10 text-blue-300 px-1.5 py-0.5 rounded font-bold text-[10px]">
                    {shortcut.keys}
                  </span>
                  <span className="text-zinc-400 text-right text-[10px]">{shortcut.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                playSound("click");
                setInfoModalOpen(false);
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider font-mono transition-all rounded px-4"
            >
              Dismiss Map Guide
            </button>
          </div>
        </div>
      )}

      {/* Minimal copyright stamp */}
      <footer className="text-center w-full mt-6 text-[9px] uppercase tracking-widest text-zinc-600 font-mono">
        Quantum Unified Workspace • Designed in Glassmorphism Dark Mode • Desktop-Native Precision Layouts
      </footer>

    </div>
  );
}
