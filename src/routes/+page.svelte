<script lang="ts">
	import {
		calcGameState,
		countRemainingMines,
		gameMap,
		knownMap,
		updateMap
	} from '$lib/stores/map';

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
		<div>
			💣 {remainingMines}
		</div>
		<div>
			{gameState}
		</div>
		<div>
			<button on:click={() => window.location.reload()}>Reset</button>
		</div>
	</div>
	<div class="map">
		{#each $gameMap as row, i}
			<div class="map-row">
				{#each row as cell, j}
					<div class="map-cell">
						{#if $knownMap[i][j] == 1 || gameState == '💀'}
							{#if cell == -1}
								💣
							{:else if cell != 0}
								{cell}
							{/if}
						{:else if $knownMap[i][j] == 2}
							{#if gameState == '🙂'}
								<button on:click={(e) => unclick(i, j, e)}>⛳</button>
							{:else}
								⛳
							{/if}
						{:else}
							<button on:click={(e) => (pickerCoordinates = { i, j })} />
						{/if}
						{#if pickerCoordinates !== null && pickerCoordinates.i == i && pickerCoordinates.j == j}
							<div class="picker">
								<button class="action" on:click={() => handlePicker(i, j, 2)}>⛳</button>
								<button on:click={() => (pickerCoordinates = null)}>❌</button>
								<button class="action" on:click={() => handlePicker(i, j, 1)}>⛏️</button>
							</div>
						{/if}
					</div>
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
		font-size: 1.5em;
		margin-bottom: 1em;
	}

	.map {
		display: flex;
		flex-direction: column;
	}

	.map-row {
		display: flex;
		flex-direction: row;
	}

	.map-cell {
		width: 2em;
		height: 2em;
		border: solid 1px black;
		margin: 3px;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.map-cell button {
		width: 100%;
		height: 100%;
		border: none;
	}

	.picker {
		z-index: 1000;
		background: white;
		width: 6em;
		height: 2em;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		border: solid 2px black;
		font-size: 2em;
	}

	.picker button {
		cursor: pointer;
	}

	.picker button.action {
		font-size: 1.2em;
	}
</style>
