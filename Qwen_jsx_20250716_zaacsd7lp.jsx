import { useState, useEffect, useRef } from "react";

export default function App() {
  const [activeView, setActiveView] = useState("wins"); // 'wins' | 'grind' | 'afk'
  const [winCount, setWinCount] = useState(0);
  const [targetWins, setTargetWins] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const [tapHistory, setTapHistory] = useState([]);

  const [ao5, setAo5] = useState("--");
  const [ao30, setAo30] = useState("--");
  const [ao60, setAo60] = useState("--");

  const [currentCoin, setCurrentCoin] = useState("");
  const [coinPerWin, setCoinPerWin] = useState("");
  const [targetCoin, setTargetCoin] = useState("");
  const [useGoldTraitGrind, setUseGoldTraitGrind] = useState(false);

  const [afkCurrent, setAfkCurrent] = useState("");
  const [afkRate, setAfkRate] = useState("");
  const [afkTarget, setAfkTarget] = useState("");
  const [useDoubleRate, setUseDoubleRate] = useState(false);
  const [useGoldTraitAfk, setUseGoldTraitAfk] = useState(false);

  const canvasRef = useRef(null);
  const confettiAnimationId = useRef(null);

  // Start timer on first win
  useEffect(() => {
    let interval;
    if (startTime !== null && !isFinished) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100); // Update every 100ms for smooth display
    }
    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  // Confetti Animation
  useEffect(() => {
    if (winCount === Number(targetWins) && Number(targetWins) > 0) {
      setIsFinished(true);
      drawConfetti();
    }
  }, [winCount, targetWins]);

  const drawConfetti = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);
    const particles = [];
    const particleNum = 100;

    for (let i = 0; i < particleNum; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H - H,
        radius: Math.random() * 4 + 1,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        speedX: (Math.random() - 0.5) * 10,
        speedY: Math.random() * 6 + 1,
        angle: Math.random() * 360,
        rotation: Math.random() * 0.5 - 0.25,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      for (let p of particles) {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.rotation;

        if (p.y > H) {
          p.y = -10;
          p.x = Math.random() * W;
        }
      }
      confettiAnimationId.current = requestAnimationFrame(animate);
    }

    animate();

    setTimeout(() => stopConfetti(), 3000);
  };

  const stopConfetti = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (confettiAnimationId.current) {
      cancelAnimationFrame(confettiAnimationId.current);
    }
  };

  // Update Ao5, Ao30, Ao60 every second
  useEffect(() => {
    if (!startTime || isFinished) return;

    const avgInterval = setInterval(() => {
      const now = Date.now();

      const updateAo = (durationMs, resetAfterMs, setter) => {
        const start = now - durationMs;
        const relevantTaps = tapHistory.filter((time) => time >= start);
        const total = relevantTaps.length;
        if (total === 0) return "--";
        setter(total);

        if (resetAfterMs && now - startTime >= resetAfterMs) {
          setter("--");
          setTapHistory((prev) => prev.filter((time) => time >= now - resetAfterMs + 5000));
        }
      };

      if (now - startTime >= 5 * 60 * 1000) updateAo(5 * 60 * 1000, 5 * 60 * 1000, setAo5);
      if (now - startTime >= 30 * 60 * 1000) updateAo(30 * 60 * 1000, 5 * 60 * 1000, setAo30);
      if (now - startTime >= 60 * 60 * 1000) updateAo(60 * 60 * 1000, 60 * 60 * 1000, setAo60);
    }, 1000);

    return () => clearInterval(avgInterval);
  }, [winCount, startTime, isFinished]);

  const handleWin = () => {
    if (isFinished || !targetWins) return;

    if (startTime === null) {
      setStartTime(Date.now());
    }

    setWinCount((prev) => prev + 1);
    setTapHistory((prev) => [...prev, Date.now()]);
  };

  const handleReset = () => {
    stopConfetti();
    setWinCount(0);
    setStartTime(null);
    setElapsedTime(0);
    setTapHistory([]);
    setAo5("--");
    setAo30("--");
    setAo60("--");
    setIsFinished(false);
  };

  // Format time as 00d:00h:00m
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${String(days).padStart(2, "0")}d:${String(hours).padStart(2, "0")}h:${String(minutes).padStart(2, "0")}m`;
  };

  const formatTimeEstimate = (totalMinutes) => {
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${String(days).padStart(2, "0")}d:${String(hours).padStart(2, "0")}h:${String(minutes).padStart(2, "0")}m`;
  };

  const parseValue = (value) => {
    if (!value) return 0;
    value = value.trim().toUpperCase();
    if (/^\d+(\.\d+)?$/.test(value)) return parseFloat(value);
    const suffixes = {
      M: 1e6,
      B: 1e9,
      T: 1e12,
      QD: 1e15,
      QN: 1e18,
      SX: 1e21,
      SP: 1e24,
    };
    const match = value.match(/^(\d+\.?\d*)([A-Z]+)$/);
    if (match) {
      const [, num, suffix] = match;
      const multiplier = suffixes[suffix];
      if (multiplier) return parseFloat(num) * multiplier;
    }
    return 0;
  };

  const formatValue = (num) => {
    const abbreviations = [
      { value: 1e24, symbol: "Sp" },
      { value: 1e21, symbol: "Sx" },
      { value: 1e18, symbol: "Qn" },
      { value: 1e15, symbol: "Qd" },
      { value: 1e12, symbol: "T" },
      { value: 1e9, symbol: "B" },
      { value: 1e6, symbol: "M" },
    ];

    for (let i = 0; i < abbreviations.length; i++) {
      if (num >= abbreviations[i].value) {
        const formatted = (num / abbreviations[i].value).toFixed(2);
        return `${parseFloat(formatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}${abbreviations[i].symbol}`;
      }
    }

    return num.toLocaleString();
  };

  const calculateRequiredKills = () => {
    const current = parseValue(currentCoin);
    const perWin = parseValue(coinPerWin) * (useGoldTraitGrind ? 1.2 : 1);
    const target = parseValue(targetCoin);

    if (perWin === 0) return "--";
    const required = Math.max(0, Math.ceil((target - current) / perWin));
    return required.toLocaleString();
  };

  const calculateRemainingCoins = () => {
    const current = parseValue(currentCoin);
    const target = parseValue(targetCoin);
    const remaining = Math.max(0, target - current);
    return formatValue(remaining);
  };

  const calculateAfkRemainingCoins = () => {
    const current = parseValue(afkCurrent);
    const target = parseValue(afkTarget);
    const remaining = Math.max(0, target - current);
    return formatValue(remaining);
  };

  const calculateAfkTime = () => {
    const current = parseValue(afkCurrent);
    const rate = parseValue(afkRate) * (useDoubleRate ? 2 : 1) * (useGoldTraitAfk ? 1.2 : 1);
    const target = parseValue(afkTarget);

    if (rate === 0) return "--d:--h:--m";
    const remaining = Math.max(0, target - current);
    const totalMinutes = remaining / rate / 60;

    return formatTimeEstimate(totalMinutes);
  };

  const calculateAfkHourlyRate = () => {
    const rate = parseValue(afkRate) * (useDoubleRate ? 2 : 1) * (useGoldTraitAfk ? 1.2 : 1);
    const hourlyRate = rate * 60;
    return formatValue(hourlyRate);
  };

  const calculateEstimatedWinTime = () => {
    if (winCount === 0 || elapsedTime === 0 || !targetWins) return "--d:--h:--m";

    const winsPerMinute = winCount / (elapsedTime / 60000);
    const remainingWins = targetWins - winCount;

    if (winsPerMinute === 0) return "--d:--h:--m";

    const estimatedMinutes = remainingWins / winsPerMinute;
    return formatTimeEstimate(estimatedMinutes);
  };

  const Header = () => (
    <header className="w-full py-4 px-6 bg-gray-800 text-white flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Shadow Garden</h1>
      <nav className="flex gap-4 text-sm">
        <button
          onClick={() => setActiveView("wins")}
          className={`px-3 py-1 rounded-full ${
            activeView === "wins" ? "bg-green-600" : "hover:bg-gray-700"
          }`}
        >
          Boss Wins
        </button>
        <button
          onClick={() => setActiveView("grind")}
          className={`px-3 py-1 rounded-full ${
            activeView === "grind" ? "bg-yellow-600" : "hover:bg-gray-700"
          }`}
        >
          Boss Grind Calculator
        </button>
        <button
          onClick={() => setActiveView("afk")}
          className={`px-3 py-1 rounded-full ${
            activeView === "afk" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          AFK Coin Calculator
        </button>
      </nav>
    </header>
  );

  return (
    <>
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{ zIndex: 9999 }}
      />

      {/* Main App */}
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        {activeView === "wins" && (
          <BossWinsView
            winCount={winCount}
            targetWins={targetWins}
            setTargetWins={setTargetWins}
            handleWin={handleWin}
            handleReset={handleReset}
            ao5={ao5}
            ao30={ao30}
            ao60={ao60}
            formatTime={formatTime}
            elapsedTime={elapsedTime}
            isFinished={isFinished}
            calculateEstimatedWinTime={calculateEstimatedWinTime}
          />
        )}

        {activeView === "grind" && (
          <BossGrindCalculatorView
            currentCoin={currentCoin}
            setCurrentCoin={setCurrentCoin}
            coinPerWin={coinPerWin}
            setCoinPerWin={setCoinPerWin}
            targetCoin={targetCoin}
            setTargetCoin={setTargetCoin}
            useGoldTraitGrind={useGoldTraitGrind}
            setUseGoldTraitGrind={setUseGoldTraitGrind}
            calculateRequiredKills={calculateRequiredKills}
            calculateRemainingCoins={calculateRemainingCoins}
            formatValue={formatValue}
          />
        )}

        {activeView === "afk" && (
          <AfkCoinCalculatorView
            afkCurrent={afkCurrent}
            setAfkCurrent={setAfkCurrent}
            afkRate={afkRate}
            setAfkRate={setAfkRate}
            afkTarget={afkTarget}
            setAfkTarget={setAfkTarget}
            useDoubleRate={useDoubleRate}
            setUseDoubleRate={setUseDoubleRate}
            useGoldTraitAfk={useGoldTraitAfk}
            setUseGoldTraitAfk={setUseGoldTraitAfk}
            calculateAfkRemainingCoins={calculateAfkRemainingCoins}
            calculateAfkTime={calculateAfkTime}
            calculateAfkHourlyRate={calculateAfkHourlyRate}
            formatValue={formatValue}
          />
        )}
      </div>
    </>
  );
}

// Boss Wins View Component
function BossWinsView({
  winCount,
  targetWins,
  setTargetWins,
  handleWin,
  handleReset,
  ao5,
  ao30,
  ao60,
  formatTime,
  elapsedTime,
  isFinished,
  calculateEstimatedWinTime,
}) {
  return (
    <main className="flex-1 flex flex-col items-center justify-start w-full p-4 space-y-6">
      {/* Real-time Stopwatch */}
      <div className="text-3xl font-mono tracking-wider text-green-400 mb-4">{formatTime(elapsedTime)}</div>

      {/* Win Button */}
      <button
        onClick={handleWin}
        disabled={isFinished}
        className={`w-40 h-40 rounded-full text-xl font-bold flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${
          isFinished ? "bg-gray-700 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        Win
      </button>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md text-sm text-gray-300">
        <div className="p-3 bg-gray-800 rounded-lg shadow-sm">
          <p className="font-semibold text-green-400">Wins</p>
          <p className="text-xl font-bold">{winCount}</p>
        </div>
        <div className="p-3 bg-gray-800 rounded-lg shadow-sm">
          <p className="font-semibold text-blue-400">Target</p>
          <input
            type="number"
            min="1"
            value={targetWins}
            onChange={(e) => setTargetWins(e.target.value)}
            placeholder="Enter target"
            className="text-center bg-gray-700 border border-gray-600 w-full"
          />
        </div>
      </div>

      {/* Average Stats */}
      <div className="grid grid-cols-3 gap-3 mt-6 w-full max-w-md text-sm text-gray-300">
        <div className="p-3 bg-gray-800 rounded-lg shadow-sm">
          <p className="font-semibold text-xs text-red-400">Ao5</p>
          <p className="text-xl font-bold">{ao5}</p>
        </div>
        <div className="p-3 bg-gray-800 rounded-lg shadow-sm">
          <p className="font-semibold text-xs text-teal-400">Ao30</p>
          <p className="text-xl font-bold">{ao30}</p>
        </div>
        <div className="p-3 bg-gray-800 rounded-lg shadow-sm">
          <p className="font-semibold text-xs text-indigo-400">Ao60</p>
          <p className="text-xl font-bold">{ao60}</p>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="p-3 bg-gray-800 rounded-lg shadow-sm w-full max-w-md">
        <p className="font-semibold text-yellow-400">Est. Time to Target</p>
        <p className="text-xl font-bold">{calculateEstimatedWinTime()}</p>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full max-w-md py-3 mt-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors duration-200"
      >
        Reset
      </button>
    </main>
  );
}

// Boss Grind Calculator View Component
function BossGrindCalculatorView({
  currentCoin,
  setCurrentCoin,
  coinPerWin,
  setCoinPerWin,
  targetCoin,
  setTargetCoin,
  useGoldTraitGrind,
  setUseGoldTraitGrind,
  calculateRequiredKills,
  calculateRemainingCoins,
  formatValue,
}) {
  return (
    <main className="flex-1 flex flex-col items-center justify-start w-full p-6 space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400">Boss Grind Calculator</h2>

      <div className="w-full max-w-md space-y-4">
        <div className="space-y-2">
          <label className="block text-left text-sm text-gray-300">Current Coins</label>
          <input
            type="text"
            value={currentCoin}
            onChange={(e) => setCurrentCoin(e.target.value)}
            placeholder="e.g. 1.5M or 2B"
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-left text-sm text-gray-300">Coins Per Win</label>
          <input
            type="text"
            value={coinPerWin}
            onChange={(e) => setCoinPerWin(e.target.value)}
            placeholder="e.g. 100k or 1.5M"
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-left text-sm text-gray-300">Target Coins</label>
          <input
            type="text"
            value={targetCoin}
            onChange={(e) => setTargetCoin(e.target.value)}
            placeholder="e.g. 100M or 1T"
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Gold Trait Toggle */}
        <div className="mt-2 flex items-center gap-2">
          <div
            onClick={() => setUseGoldTraitGrind(!useGoldTraitGrind)}
            className={`w-8 h-8 rounded flex items-center justify-center cursor-pointer text-xs transition-colors ${
              useGoldTraitGrind ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            Gold
          </div>
          <span className="text-sm text-gray-300">Gold Trait</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md text-sm text-gray-300">
        <div className="p-3 bg-gray-800 rounded-lg shadow-sm">
          <p className="font-semibold text-yellow-400">Coins Needed</p>
          <p className="text-xl font-bold">{calculateRemainingCoins()}</p>
        </div>
        <div className="p-3 bg-gray-800 rounded-lg shadow-sm">
          <p className="font-semibold text-blue-400">Boss Wins Needed</p>
          <p className="text-xl font-bold">{calculateRequiredKills()}</p>
        </div>
      </div>
    </main>
  );
}

// AFK Coin Calculator View Component
function AfkCoinCalculatorView({
  afkCurrent,
  setAfkCurrent,
  afkRate,
  setAfkRate,
  afkTarget,
  setAfkTarget,
  useDoubleRate,
  setUseDoubleRate,
  useGoldTraitAfk,
  setUseGoldTraitAfk,
  calculateAfkRemainingCoins,
  calculateAfkTime,
  calculateAfkHourlyRate,
  formatValue,
}) {
  return (
    <main className="flex-1 flex flex-col items-center justify-start w-full p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-400">AFK Coin Calculator</h2>

      <div className="w-full max-w-md space-y-4">
        <div className="space-y-2">
          <label className="block text-left text-sm text-gray-300">Current Coins</label>
          <input
            type="text"
            value={afkCurrent}
            onChange={(e) => setAfkCurrent(e.target.value)}
            placeholder="e.g. 1.5M or 2B"
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-left text-sm text-gray-300">Coins Per Minute</label>
          <input
            type="text"
            value={afkRate}
            onChange={(e) => setAfkRate(e.target.value)}
            placeholder="e.g. 100k or 1.5M"
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-left text-sm text-gray-300">Target Coins</label>
          <input
            type="text"
            value={afkTarget}
            onChange={(e) => setAfkTarget(e.target.value)}
            placeholder="e.g. 100M or 1T"
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Toggles */}
        <div className="mt-2 flex flex-wrap gap-2">
          <div
            onClick={() => setUseDoubleRate(!useDoubleRate)}
            className={`w-8 h-8 rounded flex items-center justify-center cursor-pointer text-xs transition-colors ${
              useDoubleRate ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            x2
          </div>
          <span className="text-sm text-gray-300 self-center">Gamepass</span>

          <div
            onClick={() => setUseGoldTraitAfk(!useGoldTraitAfk)}
            className={`w-8 h-8 rounded flex items-center justify-center cursor-pointer text-xs transition-colors ${
              useGoldTraitAfk ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            Gold
          </div>
          <span className="text-sm text-gray-300 self-center">Gold Trait</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md text-sm text-gray-300">
        <div className="p-3 bg-gray-800 rounded-lg shadow-sm">
          <p className="font-semibold text-blue-400">Coins Needed</p>
          <p className="text-xl font-bold">{calculateAfkRemainingCoins()}</p>
        </div>
        <div className="p-3 bg-gray-800 rounded-lg shadow-sm">
          <p className="font-semibold text-purple-400">Estimated Time</p>
          <p className="text-xl font-bold">{calculateAfkTime()}</p>
        </div>
        <div className="p-3 bg-gray-800 rounded-lg shadow-sm col-span-2">
          <p className="font-semibold text-blue-400">Coins Per Hour</p>
          <p className="text-xl font-bold">{calculateAfkHourlyRate()}</p>
        </div>
      </div>
    </main>
  );
}