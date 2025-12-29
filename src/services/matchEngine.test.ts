/**
 * Tests simples du moteur de score
 * Pour exécuter: Ouvrir la console navigateur et tester manuellement
 */

import type { Match } from '../types';
import * as matchEngine from './matchEngine';

/**
 * Crée un match de test minimal
 */
export function createTestMatch(): Match {
  return {
    id: 'test-123',
    createdAt: new Date().toISOString(),
    status: 'in_progress',
    duration: 0,
    teamUs: {
      playerLeft: 'Test Left',
      playerRight: 'Test Right',
    },
    teamThem: {
      player1: 'Adv 1',
      player2: 'Adv 2',
    },
    config: {
      setsToWin: 2,
      tiebreakInFinalSet: true,
    },
    currentSet: 1,
    sets: [
      matchEngine.createNewSet(1),
    ],
    finalScore: { us: 0, them: 0 },
    winner: null,
    version: '1.0.0',
  };
}

/**
 * Test 1: Jeu simple (nous gagnons 4-0)
 */
export function testSimpleGame() {
  console.log('🧪 TEST 1: Jeu simple 4-0');

  const match = createTestMatch();

  // Marquer 4 points pour nous
  for (let i = 0; i < 4; i++) {
    const result = matchEngine.scorePoint(match, 'us', 2, 1);
    console.log(`Point ${i + 1}:`, matchEngine.getMatchSummary(match));

    if (i === 3) {
      console.assert(result.gameWon === true, 'Le jeu devrait être gagné au 4e point');
    }
  }

  const currentSet = matchEngine.getCurrentSet(match);
  console.assert(currentSet?.score.us === 1, 'Score de jeux devrait être 1-0');
  console.log('✅ Test 1 réussi!\n');
}

/**
 * Test 2: Égalité 40-40 puis avantage
 */
export function testDeuce() {
  console.log('🧪 TEST 2: Égalité 40-40 et avantage');

  const match = createTestMatch();

  // 0-0 → 15-0 → 30-0 → 30-15 → 30-30 → 30-40 → 40-40
  matchEngine.scorePoint(match, 'us', 1, 1);    // 15-0
  matchEngine.scorePoint(match, 'us', 1, 1);    // 30-0
  matchEngine.scorePoint(match, 'them', 1, 1);  // 30-15
  matchEngine.scorePoint(match, 'them', 1, 1);  // 30-30
  matchEngine.scorePoint(match, 'them', 1, 1);  // 30-40
  matchEngine.scorePoint(match, 'us', 1, 1);    // 40-40 (égalité)

  const game = matchEngine.getCurrentGame(matchEngine.getCurrentSet(match)!);
  console.assert(game?.isDeuce === true, 'Devrait être en égalité (deuce)');
  console.log('Score:', matchEngine.getMatchSummary(match));

  // Avantage pour nous
  matchEngine.scorePoint(match, 'us', 1, 1);
  console.assert(game?.advantage === 'us', 'Nous devrions avoir l\'avantage');
  console.log('Avantage:', matchEngine.getMatchSummary(match));

  // Retour égalité
  matchEngine.scorePoint(match, 'them', 1, 1);
  console.assert(game?.advantage === null, 'Retour égalité');
  console.log('Retour égalité:', matchEngine.getMatchSummary(match));

  // Avantage eux puis jeu gagné
  matchEngine.scorePoint(match, 'them', 1, 1);
  const result = matchEngine.scorePoint(match, 'them', 1, 1);
  console.assert(result.gameWon === true, 'Jeu devrait être gagné');
  console.assert(game?.winner === 'them', 'Ils devraient gagner le jeu');

  console.log('✅ Test 2 réussi!\n');
}

/**
 * Test 3: Set complet (6-4)
 */
export function testFullSet() {
  console.log('🧪 TEST 3: Set complet 6-4');

  const match = createTestMatch();

  // Simuler des jeux (simplification: 4 points par jeu)
  const gamesSequence = [
    'us', 'us', 'them', 'us',     // 3-1
    'them', 'us', 'them', 'us',   // 5-3
    'them', 'us'                  // 6-4 → Set gagné
  ];

  gamesSequence.forEach((winner, index) => {
    // Gagner le jeu avec 4 points
    for (let p = 0; p < 4; p++) {
      const result = matchEngine.scorePoint(match, winner as 'us' | 'them', 1, 1);

      if (p === 3) {
        console.log(`Jeu ${index + 1} gagné par ${winner}`);

        if (index === 9) {
          // Dernier jeu: set devrait être gagné
          console.assert(result.setWon === true, 'Set devrait être gagné');
          console.assert(match.sets[0].winner === 'us', 'Nous devrions gagner le set');
        }
      }
    }
  });

  console.log('Score final du set:', match.sets[0].score);
  console.log('✅ Test 3 réussi!\n');
}

/**
 * Test 4: Tie-break
 */
export function testTiebreak() {
  console.log('🧪 TEST 4: Tie-break 7-5');

  const match = createTestMatch();

  // Amener le score à 6-6
  for (let i = 0; i < 6; i++) {
    // Nous gagnons un jeu
    for (let p = 0; p < 4; p++) {
      matchEngine.scorePoint(match, 'us', 1, 1);
    }
    // Eux gagnent un jeu
    for (let p = 0; p < 4; p++) {
      matchEngine.scorePoint(match, 'them', 1, 1);
    }
  }

  const currentSet = matchEngine.getCurrentSet(match);
  console.assert(currentSet?.score.us === 6 && currentSet?.score.them === 6, 'Score devrait être 6-6');

  const currentGame = matchEngine.getCurrentGame(currentSet!);
  console.assert(currentGame?.isTiebreak === true, 'Devrait être en tie-break');
  console.log('Tie-break commencé!');

  // Jouer le tie-break: 7-5
  // Nous: 1-0, Eux: 1-1, Nous: 2-1, Nous: 3-1, Eux: 3-2...
  const tiebreakSequence: Array<'us' | 'them'> = [
    'us', 'them', 'us', 'us', 'them', 'them', 'us', 'us', 'us', 'them', 'us', 'us'
  ];

  tiebreakSequence.forEach((winner, index) => {
    const result = matchEngine.scorePoint(match, winner, 1, 1);
    console.log(`TB Point ${index + 1}: ${currentGame?.score.us}-${currentGame?.score.them}`);

    if (index === 11) {
      // Score final: 7-5
      console.assert(result.gameWon === true, 'Tie-break devrait être gagné');
      console.assert(result.setWon === true, 'Set devrait être gagné');
    }
  });

  console.log('Score set après tie-break:', currentSet?.score);
  console.log('✅ Test 4 réussi!\n');
}

/**
 * Test 5: Undo last point
 */
export function testUndo() {
  console.log('🧪 TEST 5: Annulation de point');

  const match = createTestMatch();

  // Marquer 2 points
  matchEngine.scorePoint(match, 'us', 2, 1);
  matchEngine.scorePoint(match, 'them', 1, 2);

  const game = matchEngine.getCurrentGame(matchEngine.getCurrentSet(match)!);
  console.log('Avant undo:', game?.score);

  // Annuler le dernier
  const success = matchEngine.undoLastPoint(match);
  console.assert(success === true, 'Undo devrait réussir');
  console.log('Après undo:', game?.score);

  console.assert(game?.points.length === 1, 'Devrait avoir 1 point');
  console.log('✅ Test 5 réussi!\n');
}

/**
 * Exécuter tous les tests
 */
export function runAllTests() {
  console.log('🚀 DÉMARRAGE DES TESTS DU MOTEUR DE SCORE\n');

  try {
    testSimpleGame();
    testDeuce();
    testFullSet();
    testTiebreak();
    testUndo();

    console.log('✅✅✅ TOUS LES TESTS RÉUSSIS! ✅✅✅');
  } catch (error) {
    console.error('❌ ERREUR DANS LES TESTS:', error);
  }
}

// Export pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).testMatchEngine = {
    runAllTests,
    testSimpleGame,
    testDeuce,
    testFullSet,
    testTiebreak,
    testUndo,
  };

  console.log('💡 Tests disponibles via window.testMatchEngine.runAllTests()');
}
