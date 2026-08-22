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

  const ARCADE_DIFFICULTIES = Object.freeze({
    easy: Object.freeze({ key: "easy", label: "簡單", mazeSize: 7, mazeWallCount: 10, enemyMoveMs: 900, whackStayMs: 3000 }),
    normal: Object.freeze({ key: "normal", label: "普通", mazeSize: 9, mazeWallCount: 20, enemyMoveMs: 680, whackStayMs: 2200 }),
    hard: Object.freeze({ key: "hard", label: "困難", mazeSize: 11, mazeWallCount: 32, enemyMoveMs: 460, whackStayMs: 1400 })
  });

  function getArcadeDifficulty(key) {
    return { ...(ARCADE_DIFFICULTIES[key] || ARCADE_DIFFICULTIES.normal) };
  }

  function createMazeGeometry(size) {
    if (!Number.isInteger(size) || size < 7 || size % 2 === 0) {
      throw new Error("迷宮尺寸必須是至少 7 的奇數");
    }
    const last = size - 1;
    const center = Math.floor(size / 2);
    const targets = [
      { x: 0, y: 0, edge: "left-edge top-edge", cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] },
      { x: last, y: 0, edge: "right-edge top-edge", cells: [{ x: last - 1, y: 0 }, { x: last, y: 0 }, { x: last - 1, y: 1 }, { x: last, y: 1 }] },
      { x: 0, y: last, edge: "left-edge bottom-edge", cells: [{ x: 0, y: last - 1 }, { x: 1, y: last - 1 }, { x: 0, y: last }, { x: 1, y: last }] },
      { x: last, y: last, edge: "right-edge bottom-edge", cells: [{ x: last - 1, y: last - 1 }, { x: last, y: last - 1 }, { x: last - 1, y: last }, { x: last, y: last }] }
    ];
    const playerStart = { x: center, y: center };
    const enemyStarts = [{ x: 0, y: center, emoji: "👾" }, { x: last, y: center, emoji: "👻" }];
    const protectedPositions = [
      ...targets.flatMap((target) => target.cells), playerStart,
      { x: center, y: center - 1 }, { x: center, y: center + 1 }, ...enemyStarts
    ];
    return { targets, playerStart, enemyStarts, protectedPositions };
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
    if (enemy.x === player.x && enemy.y === player.y) return { ...enemy };
    const directions = shuffleCopy(Object.values(DIRECTIONS), random);
    const queue = [{ position: { ...enemy }, firstStep: null }];
    const visited = new Set([positionKey(enemy)]);

    while (queue.length) {
      const current = queue.shift();
      for (const delta of directions) {
        const next = { x: current.position.x + delta.x, y: current.position.y + delta.y };
        const key = positionKey(next);
        if (visited.has(key) || !legalPosition(next, size, walls, occupied)) continue;
        const firstStep = current.firstStep || next;
        if (next.x === player.x && next.y === player.y) return { ...firstStep };
        visited.add(key);
        queue.push({ position: next, firstStep });
      }
    }
    return { ...enemy };
  }

  function isMazeConnected(size, walls) {
    let start = null;
    for (let y = 0; y < size && !start; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (!walls.has(`${x},${y}`)) { start = { x, y }; break; }
      }
    }
    if (!start) return false;

    const queue = [start];
    const visited = new Set([positionKey(start)]);
    while (queue.length) {
      const current = queue.shift();
      for (const delta of Object.values(DIRECTIONS)) {
        const next = { x: current.x + delta.x, y: current.y + delta.y };
        const key = positionKey(next);
        if (visited.has(key) || !legalPosition(next, size, walls)) continue;
        visited.add(key); queue.push(next);
      }
    }
    return visited.size === size * size - walls.size;
  }

  function createRandomMazeWalls(size, wallCount, protectedPositions = [], random = Math.random) {
    const protectedKeys = new Set(protectedPositions.map(positionKey));
    const candidates = [];
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const key = `${x},${y}`;
        if (!protectedKeys.has(key)) candidates.push(key);
      }
    }

    const walls = new Set();
    for (const key of shuffleCopy(candidates, random)) {
      if (walls.size >= wallCount) break;
      const trial = new Set(walls); trial.add(key);
      if (isMazeConnected(size, trial)) walls.add(key);
    }
    return walls;
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
    getArcadeDifficulty,
    createMazeGeometry,
    moveMazePlayer,
    chooseEnemyStep,
    isMazeConnected,
    createRandomMazeWalls,
    findMazeTarget,
    createWhackWave
  });
})(window);
