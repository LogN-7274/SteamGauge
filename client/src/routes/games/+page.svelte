<script lang="ts">
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { onMount } from 'svelte';

  interface Game {
    gameId: string;
    title: string;
    price: number;
    boxart: string;
  }

  let q = $state('');
  let games: Game[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    const result = await api.get<Game[]>(`/games`);
    if (result.ok) {
      games = result.data;
    }

    loading = false;
  });

  let filteredGames = $derived(
    games.filter((game) => game.title.toLowerCase().includes(q.toLowerCase())),
  );
</script>

<h1>Game Search</h1>
<input type="text" bind:value={q} placeholder="Search games..." />

{#if loading}
  <Loading />
{:else if filteredGames.length === 0}
  <p>No games match your search.</p>
{:else}
  <ul>
    {#each filteredGames as game}
      <li>
        <a href="/games/{game.gameId}" class="game-link">
          <img src={game.boxart} alt={game.title} width="40" />
          <span>{game.title}</span>
        </a>
      </li>
    {/each}
  </ul>
{/if}
