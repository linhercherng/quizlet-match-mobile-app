import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("../game-templates-v1.js", import.meta.url), "utf8");
const context = { window: {} };
vm.runInNewContext(source, context);
const games = context.window.GAME_TEMPLATES;

const pairs = [
  ["apple", "蘋果"],
  ["banana", "香蕉"],
  ["cat", "貓"],
  ["dog", "狗"],
  ["elephant", "大象"],
  ["fish", "魚"]
];

test("choice questions use the current deck without mutating it", () => {
  const original = structuredClone(pairs);
  const questions = games.createChoiceQuestions(pairs, 4, 4, () => 0.25);

  assert.equal(questions.length, 4);
  for (const question of questions) {
    assert.ok(pairs.some(([term, definition]) => term === question.answer && definition === question.prompt));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.ok(question.options.includes(question.answer));
  }
  assert.deepEqual(pairs, original);
});

test("choice questions reject decks with fewer than four distinct answers", () => {
  assert.throws(
    () => games.createChoiceQuestions(pairs.slice(0, 3), 3, 4),
    /至少需要 4 個不同答案/
  );
});

test("arcade difficulty changes maze size, monster speed, and mole stay time", () => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(games.getArcadeDifficulty("easy"))),
    { key: "easy", label: "簡單", mazeSize: 7, mazeWallCount: 10, playerMoveMs: 135, enemyMoveMs: 900, whackStayMs: 3000 }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(games.getArcadeDifficulty("normal"))),
    { key: "normal", label: "普通", mazeSize: 9, mazeWallCount: 20, playerMoveMs: 115, enemyMoveMs: 680, whackStayMs: 2200 }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(games.getArcadeDifficulty("hard"))),
    { key: "hard", label: "困難", mazeSize: 11, mazeWallCount: 32, playerMoveMs: 95, enemyMoveMs: 460, whackStayMs: 1400 }
  );
  assert.equal(games.getArcadeDifficulty("unknown").key, "normal");
});

test("the player moves at least four times faster than monsters at every difficulty", () => {
  for (const key of ["easy", "normal", "hard"]) {
    const difficulty = games.getArcadeDifficulty(key);
    assert.ok(difficulty.playerMoveMs * 4 <= difficulty.enemyMoveMs, key);
  }
});

test("maze geometry expands answer zones and starts for larger odd boards", () => {
  const geometry = games.createMazeGeometry(11);

  assert.deepEqual(JSON.parse(JSON.stringify(geometry.playerStart)), { x: 5, y: 5 });
  assert.deepEqual(
    JSON.parse(JSON.stringify(geometry.enemyStarts.map(({ x, y }) => ({ x, y })))),
    [{ x: 0, y: 5 }, { x: 10, y: 5 }]
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(geometry.targets.map(({ x, y }) => ({ x, y })))),
    [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 10 }]
  );
  assert.equal(geometry.protectedPositions.some(({ x, y }) => x === 10 && y === 10), true);
});

test("maze keyboard input supports iPad and cross-browser key formats", () => {
  assert.equal(games.mazeDirectionFromKeyboardEvent({ key: "ArrowUp" }), "up");
  assert.equal(games.mazeDirectionFromKeyboardEvent({ key: "w" }), "up");
  assert.equal(games.mazeDirectionFromKeyboardEvent({ code: "KeyD" }), "right");
  assert.equal(games.mazeDirectionFromKeyboardEvent({ keyIdentifier: "Left" }), "left");
  assert.equal(games.mazeDirectionFromKeyboardEvent({ keyCode: 40 }), "down");
  assert.equal(games.mazeDirectionFromKeyboardEvent({ which: 87 }), "up");
  assert.equal(games.mazeDirectionFromKeyboardEvent({ key: "Enter" }), null);
});

test("maze movement stays in bounds and cannot enter a wall", () => {
  const walls = new Set(["2,1"]);

  assert.deepEqual(
    JSON.parse(JSON.stringify(games.moveMazePlayer({ x: 1, y: 1 }, "right", 7, walls))),
    { x: 1, y: 1 }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(games.moveMazePlayer({ x: 0, y: 0 }, "left", 7, walls))),
    { x: 0, y: 0 }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(games.moveMazePlayer({ x: 1, y: 1 }, "down", 7, walls))),
    { x: 1, y: 2 }
  );
});

test("maze enemy chooses a legal step that approaches the player", () => {
  const next = games.chooseEnemyStep(
    { x: 0, y: 0 },
    { x: 3, y: 3 },
    7,
    new Set(["1,0"]),
    new Set(),
    () => 0
  );

  assert.deepEqual(JSON.parse(JSON.stringify(next)), { x: 0, y: 1 });
});

test("maze enemy follows the shortest route around a wall instead of oscillating", () => {
  const wallColumn = new Set(["2,0", "2,1", "2,2", "2,3"]);
  const next = games.chooseEnemyStep(
    { x: 1, y: 2 },
    { x: 3, y: 2 },
    5,
    wallColumn,
    new Set(),
    () => 0
  );

  assert.deepEqual(JSON.parse(JSON.stringify(next)), { x: 1, y: 3 });
});

test("random maze walls vary while preserving protected cells and connectivity", () => {
  const protectedCells = [
    { x: 3, y: 3 }, { x: 0, y: 3 }, { x: 6, y: 3 },
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 },
    { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 5, y: 1 }, { x: 6, y: 1 },
    { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 0, y: 6 }, { x: 1, y: 6 },
    { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 6 }, { x: 6, y: 6 }
  ];
  const seededRandom = (seed) => () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const first = games.createRandomMazeWalls(7, 10, protectedCells, seededRandom(11));
  const second = games.createRandomMazeWalls(7, 10, protectedCells, seededRandom(29));

  assert.equal(first.size, 10);
  assert.equal(second.size, 10);
  assert.notDeepEqual([...first].sort(), [...second].sort());
  assert.ok(protectedCells.every(({ x, y }) => !first.has(`${x},${y}`)));
  assert.equal(games.isMazeConnected(7, first), true);
  assert.equal(games.isMazeConnected(7, second), true);
});

test("a monster can reach a stationary player in a generated maze", () => {
  const player = { x: 3, y: 3 };
  const protectedCells = [player, { x: 0, y: 3 }, { x: 6, y: 3 }];
  const walls = games.createRandomMazeWalls(7, 10, protectedCells, () => 0.37);
  let enemy = { x: 0, y: 3 };

  for (let turn = 0; turn < 20 && (enemy.x !== player.x || enemy.y !== player.y); turn += 1) {
    enemy = games.chooseEnemyStep(enemy, player, 7, walls, new Set(), () => 0);
  }

  assert.deepEqual(JSON.parse(JSON.stringify(enemy)), player);
});

test("every visibly covered maze cell activates its answer zone", () => {
  const targets = [
    { cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] },
    { cells: [{ x: 5, y: 0 }, { x: 6, y: 0 }, { x: 5, y: 1 }, { x: 6, y: 1 }] }
  ];

  assert.equal(games.findMazeTarget({ x: 1, y: 1 }, targets), 0);
  assert.equal(games.findMazeTarget({ x: 5, y: 1 }, targets), 1);
  assert.equal(games.findMazeTarget({ x: 3, y: 3 }, targets), -1);
});

test("whack wave has one correct mole, distinct holes, and wrong distractors", () => {
  const question = {
    prompt: "蘋果",
    answer: "apple",
    options: ["apple", "banana", "cat", "dog"]
  };
  const wave = games.createWhackWave(question, 9, 3, () => 0.4);

  assert.equal(wave.length, 3);
  assert.equal(new Set(wave.map((mole) => mole.hole)).size, 3);
  assert.equal(wave.filter((mole) => mole.correct).length, 1);
  assert.equal(wave.find((mole) => mole.correct).label, "apple");
  assert.ok(wave.filter((mole) => !mole.correct).every((mole) => mole.label !== "apple"));
});
