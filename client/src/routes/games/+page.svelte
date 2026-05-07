<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
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
  let userId = $state('');

  onMount(async () => {
    await auth.refresh();

    if (!auth.user) {
      goto('/login');
    }
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
<a href="/users/{auth.user?.id}" role="button">Home</a>
<input type="text" bind:value={q} placeholder="Search games..." />

{#if loading}
  <Loading />
{:else if filteredGames.length === 0}
  <p>No games match your search.</p>
{:else}
  <div class="top-bar">
    <button
      class="wishlist-button"
      onclick={() => {
        if (auth.user?.id) {
          goto(`/users/${auth.user.id}/wishlist`);
        } else {
          console.error('No user session found');
        }
      }}
    >
      View Wishlist
    </button>
    <button
      class="interestlist-button"
      onclick={() => {
        if (auth.user?.id) {
          goto(`/users/${auth.user.id}/interest`);
        } else {
          console.error('No user session found');
        }
      }}
    >
      View Interestlist
    </button>
    <button class="logout-button" onclick={() => goto('/logout')}> Log Out </button>
  </div>
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

<style>
  .top-bar {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 100;
  }

  .wishlist-button {
    padding: 10px, 20px;
    background-color: green;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
  }

  .wishlist-button {
    background-color: #22c55e;
    transform: translateY(-2px);
  }

  .interestlist-button {
    padding: 10px, 20px;
    background-color: green;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
  }

  .interestlist-button {
    background-color: #22c55e;
    transform: translateY(-2px);
  }

  .logout-button {
    padding: 10px, 20px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
  }

  .logout-button {
    background-color: #c52222;
    transform: translateY(-2px);
  }
</style>
