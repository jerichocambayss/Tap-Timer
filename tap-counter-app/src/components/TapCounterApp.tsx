"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TapCounterApp() {
  const [tapCount, setTapCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [target, setTarget] = useState(100);
  const [avgPerMinute, setAvgPerMinute] = useState(0);

  useEffect(() => {
    if (startTime !== null && tapCount > 0) {
      const now = Date.now();
      const elapsedMinutes = (now - startTime) / 60000;
      setAvgPerMinute(Math.round(tapCount / elapsedMinutes));
    }
  }, [tapCount, startTime]);

  const handleTap = () => {
    if (startTime === null) {
      setStartTime(Date.now());
    }
    setTapCount((prev) => prev + 1);
  };

  const handleReset = () => {
    setTapCount(0);
    setStartTime(null);
    setAvgPerMinute(0);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white p-4 text-center">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Tap Tracker</h1>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Set Target Taps</label>
            <Input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              min={1}
              className="text-center"
            />
          </div>

          <Button
            onClick={handleTap}
            className="w-full py-6 text-lg font-semibold rounded-full bg-blue-500 hover:bg-blue-600"
          >
            Tap Me!
          </Button>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-lg">Taps</p>
              <p>{tapCount}</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Target</p>
              <p>{target}</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Timer</p>
              <p>{startTime ? `${Math.floor((Date.now() - startTime) / 1000)}s` : "0s"}</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Avg/Min</p>
              <p>{avgPerMinute}</p>
            </div>
          </div>

          <Button onClick={handleReset} variant="outline" className="w-full mt-4">
            Reset
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}