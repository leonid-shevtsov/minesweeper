<script lang="ts">
	export let pickerCoordinates: { i: number; j: number } | null;
	export let i: number, j: number;
	export let cellValue: number, cellState: number, gameState: string;
	export let probability: number;
	export let seeProbabilities: boolean;

	export let unclick: (e: MouseEvent) => void;
	export let handlePicker: (value: number) => void;

	let cellPicked: boolean;
	$: cellPicked =
		pickerCoordinates !== null && pickerCoordinates.i == i && pickerCoordinates.j == j;
</script>

<div class={`map-cell ${cellPicked ? 'picked' : ''}`}>
	{#if cellState == 1 || gameState == '💀'}
		{#if cellValue == -1}
			<span class="icon">💣</span>
		{:else if cellValue != 0}
			{cellValue}
		{/if}
	{:else if cellState == 2}
		{#if gameState == '🙂'}
			<button on:click={unclick}><span class="icon">🚩</span></button>
		{:else}
			<span class="icon">🚩</span>
		{/if}
	{:else}
		<button on:click={(e) => (pickerCoordinates = pickerCoordinates ? null : { i, j })}>
			{#if seeProbabilities}
				<span style={`color:color-mix(in hsl, green, red ${probability}%)`}>{probability}</span>
			{/if}
		</button>
	{/if}
	{#if cellPicked}
		<div class={`picker ${j <= 1 ? 'right' : j >= 8 ? 'left' : ''} ${i >= 7 ? 'bottom' : ''}`}>
			<button class="action" on:click={() => handlePicker(2)}>🚩</button>
			<!-- <button on:click={() => (pickerCoordinates = null)}>❌</button> -->
			<button class="action" on:click={() => handlePicker(1)}>⛏️</button>
		</div>
	{/if}
</div>

<style>
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

	.map-cell > button {
		width: 100%;
		height: 100%;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.map-cell.picked > button {
		background-color: #ffc414;
	}

	span.icon {
		font-size: 1.5em;
	}

	.picker {
		z-index: 1000;
		/* background-color: #fef57e; */
		height: 2em;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		gap: 2em;
		/* border: solid 2px black; */
		font-size: 2em;
		top: 2.5em;
		animation: animate-fade 0.1s;
	}

	@keyframes animate-fade {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.picker button {
		background: #ffc414;
		border: none;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.6);
		width: 2em;
		height: 2em;
		border-radius: 1em;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.picker.right {
		left: -0.2em;
	}

	.picker.left {
		right: -0.2em;
	}

	.picker.bottom {
		top: -3.7em;
	}

	.picker button {
		cursor: pointer;
	}

	.picker button.action {
		font-size: 1.2em;
	}
</style>
