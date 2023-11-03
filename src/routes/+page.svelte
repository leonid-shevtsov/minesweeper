<script lang="ts">
	import {
		buildProbabilityMap,
		calcGameState,
		countRemainingMines,
		gameMap,
		knownMap,
		updateMap,
		type Mode,
		generateMap,
		generateKnownMap
	} from '$lib/stores/map';
	import Cell from '$lib/components/cell.svelte';

	let mode: Mode = 'easy';
	let remainingMines: number;
	let gameState: string;
	let probabilityMap: number[][];
	$: remainingMines = countRemainingMines(mode, $knownMap);
	$: gameState = calcGameState($gameMap, $knownMap);
	$: probabilityMap = buildProbabilityMap($gameMap, $knownMap, remainingMines);

	let seeProbabilities: boolean;

	function handlePicker(i: number, j: number, value: number) {
		knownMap.update((map) => updateMap($gameMap, map, i, j, value));
		pickerCoordinates = null;
	}

	function unclick(i: number, j: number, e: MouseEvent) {
		e.preventDefault();
		knownMap.update((map) => updateMap($gameMap, map, i, j, 0));
	}

	let pickerCoordinates: { i: number; j: number } | null = null;

	function resetMap(newMode: Mode) {
		mode = newMode;
		pickerCoordinates = null;
		gameMap.set(generateMap(mode));
		knownMap.set(generateKnownMap(mode));
	}
</script>

<div class="game-screen">
	<h1>Minesweeper</h1>
	<div class="status">
		<div class="left">
			💣 {remainingMines}
		</div>
		<div class="face">
			{pickerCoordinates ? '😮' : gameState}
		</div>
		<div class="right">
			<button on:click={() => resetMap(mode)}>Reset</button>
		</div>
	</div>
	<div class="map">
		{#each $gameMap as row, i}
			<div class="map-row">
				{#each row as cell, j}
					<Cell
						bind:pickerCoordinates
						{i}
						{j}
						cellValue={cell}
						cellState={$knownMap[i][j]}
						probability={probabilityMap[i][j]}
						{seeProbabilities}
						{gameState}
						unclick={(e) => unclick(i, j, e)}
						handlePicker={(v) => handlePicker(i, j, v)}
					/>
				{/each}
			</div>
		{/each}
	</div>
	<div class="status bottom">
		<div class="left">
			<select bind:value={mode} on:change={(e) => resetMap(e.target.value)}>
				<option value="easy">🦊 Easy</option>
				<option value="medium">🐻 Medium</option>
				<option value="hard">👹 Hard</option>
			</select>
		</div>
		<div class="right">
			<label>
				<input type="checkbox" bind:checked={seeProbabilities} /> radar 🪄
			</label>
		</div>
	</div>
</div>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-family: monospace;
	}

	:global(html) {
		height: 100%;
	}

	h1 {
		font-size: 2em;
		font-weight: bold;
	}

	.status {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-size: 1.5em;
		margin-bottom: 1em;
	}

	.status div {
		flex: 1;
	}

	.status .left {
		text-align: left;
	}

	.status .face {
		font-size: 2em;
		text-align: center;
	}

	.status .right {
		text-align: right;
	}

	.status button {
		padding: 0.5em 2em 0.5em 2em;
	}

	.status.bottom {
		margin-top: 1em;
		font-size: 0.7em;
	}

	.map {
		display: flex;
		flex-direction: column;
	}

	.map-row {
		display: flex;
		flex-direction: row;
	}
</style>
