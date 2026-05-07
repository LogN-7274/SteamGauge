<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { onMount } from 'svelte';

  interface Game {
    gameId: string;
    title: string;
    price: number;
    boxart: string;
  }

  let game: Game | null = $state(null);
  let loading = $state(true);

  onMount(async () => {
    const gameId = page.params.gameId;
    const result = await api.get<Game>(`/games/${gameId}`);

    if (result.ok) {
      game = result.data;
    }

    loading = false;
  });

  async function handleClick(event: Event): Promise<void> {
    event.preventDefault();
    if (game) {
      goto(`/games/${game.gameId}/salehistory`);
    }
  }
</script>

{#if loading}
  <Loading />
{:else if !game}
  <p>Game not found.</p>
{:else}
  <div>
    <h1>{game.title}</h1>
    <div class="game-container">
      <img src={game.boxart} alt={game.title} width="200" />
      <div class="game-info">
        <p>Price: <strong>${game.price}</strong></p>
        <button onclick={handleClick}> View Sale History </button>
      </div>
    </div>
  </div>
{/if}
