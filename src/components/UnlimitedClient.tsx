"use client";

import { useCallback, useState } from "react";
import { GameScreen } from "./GameScreen";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HowToPlayModal, StatsModal } from "./Modals";
import { loadStats, type Stats } from "@/lib/stats";

/** /unlimited: the same game, starting in practice mode, without
 *  touching the homepage daily session. Header/Footer/Modals mirror
 *  the homepage shell so the page looks and behaves like the game. */
export default function UnlimitedClient() {
  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<Stats>(() => loadStats());

  const handleStatsChange = useCallback((next: Stats) => {
    setStats(next);
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Header
        onHowToPlay={() => setShowHowTo(true)}
        onStatistics={() => {
          setStats(loadStats());
          setShowStats(true);
        }}
        solvedCount={stats.gamesSolved}
      />
      <main id="main-content" className="flex-1">
        <GameScreen
          onStatsChange={handleStatsChange}
          initialMode="practice"
          initialPracticeOffset={1}
          ignoreSession
        />
      </main>
      <Footer />
      <HowToPlayModal open={showHowTo} onClose={() => setShowHowTo(false)} />
      <StatsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
    </div>
  );
}
