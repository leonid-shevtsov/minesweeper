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

	function handleClick(i: number, j: number, e: MouseEvent) {
		e.preventDefault();
		if (e.button == 0) {
			// open
			knownMap.update((map) => updateMap($gameMap, map, i, j, 1));
		} else {
			// set flag
			knownMap.update((map) => updateMap($gameMap, map, i, j, 2));
		}
	}

	function unclick(i: number, j: number, e: MouseEvent) {
		e.preventDefault();
		knownMap.update((map) => updateMap($gameMap, map, i, j, 0));
	}
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
							<button
								on:click={(e) => handleClick(i, j, e)}
								on:contextmenu={(e) => handleClick(i, j, e)}
							/>
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
	}

	.map-cell button {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
