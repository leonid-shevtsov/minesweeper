<script lang="ts">
	import {
		calcGameState,
		countRemainingMines,
		gameMap,
		knownMap,
		updateMap
	} from '$lib/stores/map';
	import Cell from '$lib/components/cell.svelte';

	let remainingMines: number;
	let gameState: string;
	$: remainingMines = countRemainingMines($knownMap);
	$: gameState = calcGameState($gameMap, $knownMap);

	function handlePicker(i: number, j: number, value: number) {
		knownMap.update((map) => updateMap($gameMap, map, i, j, value));
		pickerCoordinates = null;
	}

	function unclick(i: number, j: number, e: MouseEvent) {
		e.preventDefault();
		knownMap.update((map) => updateMap($gameMap, map, i, j, 0));
	}

	let pickerCoordinates: { i: number; j: number } | null = null;
</script>

<div class="game-screen">
	<h1>Minesweeper</h1>
	<div class="status">
		<div class="score">
			💣 {remainingMines}
		</div>
		<div class="face">
			{pickerCoordinates ? '😮' : gameState}
		</div>
		<div class="reset">
			<button on:click={() => window.location.reload()}>Reset</button>
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
						{gameState}
						unclick={(e) => unclick(i, j, e)}
						handlePicker={(v) => handlePicker(i, j, v)}
					/>
				{/each}
			</div>
		{/each}
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

	.status .score {
		text-align: left;
	}

	.status .face {
		font-size: 2em;
		text-align: center;
	}

	.status .reset {
		text-align: right;
	}

	.status button {
		padding: 0.5em 2em 0.5em 2em;
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
