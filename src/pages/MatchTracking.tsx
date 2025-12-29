import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchStore } from '../stores';
import { useTimer } from '../hooks/useTimer';
import * as matchEngine from '../services/matchEngine';

// Components
import Timer from '../components/match/Timer';
import ScoreDisplay from '../components/match/ScoreDisplay';
import SetScoreboard from '../components/match/SetScoreboard';
import TouchCounter from '../components/match/TouchCounter';
import PointButton from '../components/match/PointButton';

export default function MatchTracking() {
  const navigate = useNavigate();
  const currentMatch = useMatchStore((state) => state.currentMatch);
  const currentTouches = useMatchStore((state) => state.currentTouches);
  const addTouch = useMatchStore((state) => state.addTouch);
  const scorePoint = useMatchStore((state) => state.scorePoint);
  const undoLastPoint = useMatchStore((state) => state.undoLastPoint);
  const updateDuration = useMatchStore((state) => state.updateDuration);
  const pauseMatch = useMatchStore((state) => state.pauseMatch);
  const resumeMatch = useMatchStore((state) => state.resumeMatch);
  const endMatch = useMatchStore((state) => state.endMatch);

  const timer = useTimer(currentMatch?.duration || 0);
  const timerSecondsRef = useRef(timer.seconds);

  // Mettre à jour la ref quand les secondes changent
  useEffect(() => {
    timerSecondsRef.current = timer.seconds;
  }, [timer.seconds]);

  // Reprendre le match si en pause
  useEffect(() => {
    if (currentMatch?.status === 'paused') {
      resumeMatch();
    }
  }, [currentMatch?.status, resumeMatch]);

  // Démarrer le chrono quand le match est en cours
  useEffect(() => {
    if (currentMatch?.status === 'in_progress' && !timer.isRunning) {
      timer.start();
    }
  }, [currentMatch?.status]);

  // Mettre à jour la durée du match toutes les secondes
  useEffect(() => {
    if (!timer.isRunning) return;

    const interval = setInterval(() => {
      updateDuration(timerSecondsRef.current);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.isRunning, updateDuration]);

  // Rediriger si pas de match
  useEffect(() => {
    if (!currentMatch) {
      navigate('/');
    }
  }, [currentMatch, navigate]);

  // Rediriger si match terminé
  useEffect(() => {
    if (currentMatch?.status === 'completed') {
      navigate('/summary');
    }
  }, [currentMatch?.status, navigate]);

  if (!currentMatch) {
    return null;
  }

  const currentSet = matchEngine.getCurrentSet(currentMatch);
  const currentGame = currentSet ? matchEngine.getCurrentGame(currentSet) : null;

  // Calcul du score à afficher
  const scoreUs = currentGame?.score.us || 0;
  const scoreThem = currentGame?.score.them || 0;
  const displayScore = currentGame
    ? matchEngine.getDisplayScore(
        scoreUs,
        scoreThem,
        currentGame.isDeuce,
        currentGame.advantage,
        currentGame.isTiebreak
      )
    : '0-0';

  const [displayScoreUs, displayScoreThem] = displayScore.split('-');

  // Sets scores
  const setsScores = matchEngine.getSetsScores(currentMatch);

  const handlePause = () => {
    timer.pause();
    pauseMatch();
    navigate('/');
  };

  const handleEnd = () => {
    const confirm = window.confirm(
      'Êtes-vous sûr de vouloir terminer le match maintenant ?'
    );
    if (confirm) {
      timer.pause();
      endMatch();
    }
  };

  const handleScorePoint = (team: 'us' | 'them') => {
    scorePoint(team);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-dark">
      {/* Header */}
      <header className="flex items-center px-4 py-3 justify-between bg-background-dark/90 backdrop-blur-md sticky top-0 z-10">
        <button
          onClick={handlePause}
          className="text-white flex size-10 shrink-0 items-center justify-center rounded-full active:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight">
            Set {currentMatch.currentSet}
          </h2>
          <span className="text-gray-400 text-xs font-medium tracking-wide uppercase">
            Match Play
          </span>
        </div>

        <button
          onClick={handleEnd}
          className="flex h-10 items-center justify-end px-2 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-sm font-bold leading-normal">Terminer</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 pb-6 gap-4 overflow-y-auto">
        {/* Timer & Score Dashboard */}
        <section className="flex flex-col items-center justify-center py-2 shrink-0">
          {/* Timer */}
          <div className="flex items-center gap-2 mb-3">
            <Timer formattedTime={timer.formattedTime} />
          </div>

          {/* Score */}
          <ScoreDisplay scoreUs={displayScoreUs} scoreThem={displayScoreThem} />

          {/* Sets Scoreboard */}
          <SetScoreboard sets={setsScores} currentSetNumber={currentMatch.currentSet} />
        </section>

        {/* Touch Trackers (Massive Buttons) */}
        <section className="grid grid-cols-2 gap-4 grow min-h-0">
          <TouchCounter
            player="left"
            playerName={currentMatch.teamUs.playerLeft}
            touches={currentTouches.left}
            onTouch={() => addTouch('left')}
          />

          <TouchCounter
            player="right"
            playerName={currentMatch.teamUs.playerRight}
            touches={currentTouches.right}
            onTouch={() => addTouch('right')}
          />
        </section>

        {/* Point Award Buttons */}
        <section className="grid grid-cols-2 gap-4 pt-2 shrink-0">
          <PointButton
            label="POINT NOUS"
            team="us"
            onScore={() => handleScorePoint('us')}
          />

          <PointButton
            label="POINT EUX"
            team="them"
            onScore={() => handleScorePoint('them')}
          />
        </section>
      </main>

      {/* Floating Undo Button */}
      <div className="fixed bottom-6 right-1/2 translate-x-1/2 z-20">
        <button
          onClick={undoLastPoint}
          className="flex items-center justify-center size-12 bg-surface-dark border border-white/10 rounded-full text-gray-400 hover:text-white shadow-lg active:scale-90 active:bg-[#322839] transition-all"
        >
          <span className="material-symbols-outlined">undo</span>
        </button>
      </div>
    </div>
  );
}
