import { writable } from 'svelte/store';

const modeSettings = {
	easy: { width: 10, height: 10, mineCount: 10 },
	medium: { width: 15, height: 15, mineCount: 40 },
	hard: { width: 22, height: 22, mineCount: 99 }
};

export type Mode = keyof typeof modeSettings;

export const gameMap = writable(generateMap('easy'));

export function generateMap(mode: Mode) {
	const { width, height, mineCount } = modeSettings[mode];

	const cells = [];

	for (let i = 0; i < height; i++) {
		const row = [];
		for (let j = 0; j < width; j++) {
			row.push(0);
		}
		cells.push(row);
	}

	let minesPlaced = 0;
	while (minesPlaced < mineCount) {
		const mineI = Math.floor(Math.random() * height);
		const mineJ = Math.floor(Math.random() * width);
		if (cells[mineI][mineJ] != -1) {
			cells[mineI][mineJ] = -1;
			for (let i = mineI - 1; i <= mineI + 1; i++) {
				for (let j = mineJ - 1; j <= mineJ + 1; j++) {
					if (
						(i != mineI || j != mineJ) &&
						i >= 0 &&
						j >= 0 &&
						i < height &&
						j < width &&
						cells[i][j] != -1
					) {
						cells[i][j] += 1;
					}
				}
			}
			minesPlaced += 1;
		}
	}

	return cells;
}

export const knownMap = writable(generateKnownMap('easy'));

export function generateKnownMap(mode: Mode) {
	const { width, height } = modeSettings[mode];

	const cells = [];

	for (let i = 0; i < height; i++) {
		const row = [];
		for (let j = 0; j < width; j++) {
			row.push(0);
		}
		cells.push(row);
	}

	return cells;
}

export function updateMap(
	gameMap: number[][],
	map: number[][],
	vI: number,
	vJ: number,
	value: number
) {
	const newmap = [];

	for (let i = 0; i < map.length; i++) {
		newmap.push([...map[i]]);
	}
	newmap[vI][vJ] = value;
	if (gameMap[vI][vJ] == 0) {
		const cellsToCheck = [{ i: vI, j: vJ }];
		while (cellsToCheck.length > 0) {
			const { i: checkI, j: checkJ } = cellsToCheck.pop();
			for (let i = checkI - 1; i <= checkI + 1; i++) {
				for (let j = checkJ - 1; j <= checkJ + 1; j++) {
					if (
						(i != checkI || j != checkJ) &&
						i >= 0 &&
						j >= 0 &&
						i < map.length &&
						j < map[i].length &&
						newmap[i][j] == 0
					) {
						newmap[i][j] = 1;
						if (gameMap[i][j] == 0) {
							cellsToCheck.push({ i, j });
						}
					}
				}
			}
		}
	}
	return newmap;
}

export function countRemainingMines(mode: Mode, knownMap: number[][]) {
	const { mineCount } = modeSettings[mode];
	let remainingMines = mineCount;
	for (let i = 0; i < knownMap.length; i++) {
		for (let j = 0; j < knownMap[i].length; j++) {
			if (knownMap[i][j] == 2) {
				remainingMines -= 1;
			}
		}
	}

	if (remainingMines < 0) {
		return 0;
	}

	return remainingMines;
}

export function calcGameState(gameMap: number[][], knownMap: number[][]) {
	let allOpen = true;
	for (let i = 0; i < knownMap.length; i++) {
		for (let j = 0; j < knownMap[i].length; j++) {
			if (knownMap[i][j] == 0) {
				allOpen = false;
			} else if (knownMap[i][j] == 1 && gameMap[i][j] == -1) {
				return '💀';
			}
		}
	}

	return allOpen ? '😎' : '🙂';
}

export function buildProbabilityMap(
	gameMap: number[][],
	knownMap: number[][],
	remainingMines: number
): number[][] {
	let remainingCells = 0;
	for (let i = 0; i < gameMap.length; i++) {
		for (let j = 0; j < gameMap[i].length; j++) {
			if (knownMap[i][j] == 0) {
				remainingCells += 1;
			}
		}
	}

	const averageProbability = Math.round((remainingMines * 100) / remainingCells);

	// set initial probability based on average
	const probabilityMap: number[][] = [];
	for (let i = 0; i < gameMap.length; i++) {
		const row: number[] = [];
		for (let j = 0; j < gameMap[i].length; j++) {
			if (knownMap[i][j] == 0) {
				row.push(averageProbability);
			} else {
				row.push(0);
			}
		}
		probabilityMap.push(row);
	}

	// update probability with values of known open cells
	for (let checkI = 0; checkI < gameMap.length; checkI++) {
		for (let checkJ = 0; checkJ < gameMap[checkI].length; checkJ++) {
			// for 0 cells we already opened everything around them
			if (knownMap[checkI][checkJ] == 1 && gameMap[checkI][checkJ] != 0) {
				let closedCells = 0,
					mines = 0;
				for (let i = checkI - 1; i <= checkI + 1; i++) {
					for (let j = checkJ - 1; j <= checkJ + 1; j++) {
						if (
							(i != checkI || j != checkJ) &&
							i >= 0 &&
							j >= 0 &&
							i < gameMap.length &&
							j < gameMap[i].length
						) {
							if (knownMap[i][j] == 0) {
								closedCells++;
							} else if (knownMap[i][j] == 2) {
								mines++;
							}
						}
					}
				}
				if (mines >= gameMap[checkI][checkJ]) {
					for (let i = checkI - 1; i <= checkI + 1; i++) {
						for (let j = checkJ - 1; j <= checkJ + 1; j++) {
							if (
								(i != checkI || j != checkJ) &&
								i >= 0 &&
								j >= 0 &&
								i < gameMap.length &&
								j < gameMap[i].length
							) {
								probabilityMap[i][j] = 0;
							}
						}
					}
					continue;
				}
				const localProbability = Math.round(
					((gameMap[checkI][checkJ] - mines) * 100) / closedCells
				);
				for (let i = checkI - 1; i <= checkI + 1; i++) {
					for (let j = checkJ - 1; j <= checkJ + 1; j++) {
						if (
							(i != checkI || j != checkJ) &&
							i >= 0 &&
							j >= 0 &&
							i < gameMap.length &&
							j < gameMap[i].length
						) {
							if (localProbability > probabilityMap[i][j] && probabilityMap[i][j] != 0) {
								probabilityMap[i][j] = localProbability;
							}
						}
					}
				}
			}
		}
	}

	return probabilityMap;
}
