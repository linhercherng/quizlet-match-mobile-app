(function exposeGameTemplates(global) {
  "use strict";

  function shuffleCopy(items, random = Math.random) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function normalizePairs(pairs) {
    const seen = new Set();
    return pairs
      .filter((pair) => Array.isArray(pair) && pair.length >= 2)
      .map(([term, definition]) => [String(term).trim(), String(definition).trim()])
      .filter(([term, definition]) => {
        const key = term.toLocaleLowerCase();
        if (!term || !definition || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  function createChoiceQuestions(pairs, requestedCount, optionCount = 4, random = Math.random) {
    const cleanPairs = normalizePairs(pairs);
    if (cleanPairs.length < optionCount) {
      throw new Error(`此遊戲至少需要 ${optionCount} 個不同答案`);
    }

    const selected = shuffleCopy(cleanPairs, random).slice(0, Math.min(requestedCount, cleanPairs.length));
    return selected.map(([answer, prompt]) => {
      const distractors = shuffleCopy(
        cleanPairs.filter(([term]) => term !== answer).map(([term]) => term),
        random
      ).slice(0, optionCount - 1);
      return {
        prompt,
        answer,
        options: shuffleCopy([answer, ...distractors], random)
      };
    });
  }

  const DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  function positionKey(position) {
    return `${position.x},${position.y}`;
  }

  function legalPosition(position, size, walls, occupied = new Set()) {
    return position.x >= 0 && position.y >= 0 && position.x < size && position.y < size
      && !walls.has(positionKey(position)) && !occupied.has(positionKey(position));
  }

  function moveMazePlayer(position, direction, size, walls) {
    const delta = DIRECTIONS[direction];
    if (!delta) return { ...position };
    const next = { x: position.x + delta.x, y: position.y + delta.y };
    return legalPosition(next, size, walls) ? next : { ...position };
  }

  function chooseEnemyStep(enemy, player, size, walls, occupied = new Set(), random = Math.random) {
    const candidates = Object.values(DIRECTIONS)
      .map((delta) => ({ x: enemy.x + delta.x, y: enemy.y + delta.y }))
      .filter((position) => legalPosition(position, size, walls, occupied));
    if (!candidates.length) return { ...enemy };

    const distance = (position) => Math.abs(position.x - player.x) + Math.abs(position.y - player.y);
    const nearestDistance = Math.min(...candidates.map(distance));
    const nearest = candidates.filter((position) => distance(position) === nearestDistance);
    return { ...nearest[Math.floor(random() * nearest.length)] };
  }

  function findMazeTarget(position, targets) {
    return targets.findIndex((target) => {
      const cells = Array.isArray(target.cells) ? target.cells : [target];
      return cells.some((cell) => cell.x === position.x && cell.y === position.y);
    });
  }

  function createWhackWave(question, holeCount = 9, activeCount = 3, random = Math.random) {
    if (!question || !question.answer || !Array.isArray(question.options)) {
      throw new Error("題目格式不完整");
    }
    if (activeCount < 1 || activeCount > holeCount) {
      throw new Error("地鼠數量超出洞口範圍");
    }

    const wrongLabels = shuffleCopy(
      [...new Set(question.options.filter((label) => label !== question.answer))],
      random
    );
    if (wrongLabels.length < activeCount - 1) throw new Error("錯誤選項不足");

    const labels = shuffleCopy([question.answer, ...wrongLabels.slice(0, activeCount - 1)], random);
    const holes = shuffleCopy(Array.from({ length: holeCount }, (_, index) => index), random).slice(0, activeCount);
    return labels.map((label, index) => ({
      hole: holes[index],
      label,
      correct: label === question.answer
    }));
  }

  global.GAME_TEMPLATES = Object.freeze({
    createChoiceQuestions,
    moveMazePlayer,
    chooseEnemyStep,
    findMazeTarget,
    createWhackWave
  });
})(window);
