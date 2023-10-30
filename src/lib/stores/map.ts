import { readable, writable } from 'svelte/store';

export const gameMap = readable(generateMap());

function generateMap() {
	const cells = [];

	for (let i = 0; i < 10; i++) {
		const row = [];
		for (let j = 0; j < 10; j++) {
			row.push(0);
		}
		cells.push(row);
	}

	let mineCount = 0;
	while (mineCount < 10) {
		const mineI = Math.floor(Math.random() * 10);
		const mineJ = Math.floor(Math.random() * 10);
		if (cells[mineI][mineJ] != -1) {
			cells[mineI][mineJ] = -1;
			for (let i = mineI - 1; i <= mineI + 1; i++) {
				for (let j = mineJ - 1; j <= mineJ + 1; j++) {
					if (
						(i != mineI || j != mineJ) &&
						i >= 0 &&
						j >= 0 &&
						i < 10 &&
						j < 10 &&
						cells[i][j] != -1
					) {
						cells[i][j] += 1;
					}
				}
			}
			mineCount += 1;
		}
	}

	return cells;
}

export const knownMap = writable(generateKnownMap());

function generateKnownMap() {
	const cells = [];

	for (let i = 0; i < 10; i++) {
		const row = [];
		for (let j = 0; j < 10; j++) {
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
						i < 10 &&
						j < 10 &&
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

export function countRemainingMines(knownMap: number[][]) {
	let mineCount = 10;
	for (let i = 0; i < knownMap.length; i++) {
		for (let j = 0; j < knownMap[i].length; j++) {
			if (knownMap[i][j] == 2) {
				mineCount -= 1;
			}
		}
	}

	if (mineCount < 0) {
		return 0;
	}

	return mineCount;
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
