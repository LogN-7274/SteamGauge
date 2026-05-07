<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import Loading from '$lib/components/Loading.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface Prediction {
    predictionId: string;
    predictionPrice: number;
    predictionDate: Date;
  }

  interface Game {
    gameId: string;
    title: string;
    price: number;
    boxart: string;
    prediction: Prediction;
  }

  let game: Game | null = $state(null);
  let loading = $state(true);

  const formatter = Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  onMount(async () => {
    await auth.refresh();

    if (!auth.user) {
      goto('/login');
    }

    const gameId = page.params.gameId;
    const result = await api.get<Game>(`/games/${gameId}`);

    if (result.ok) {
      game = result.data;
    }

    loading = false;
  });

  async function handleAdd(event: Event): Promise<void> {
    event.preventDefault();

    const gameId = page.params.gameId;
    const result = await api.put(`/games/${gameId}`, { userId: auth.user?.id });

    if (!result.ok) {
      toast.error('Something went wrong');
    } else {
      toast.success('Game added to wishlist');
    }
  }
</script>

{#if loading}
  <Loading />
{:else if !game}
  <p>Game not found.</p>
{:else}
  <h1>{game.title}</h1>
  <div class="game-container">
    <img src={game.boxart} alt={game.title} width="200" />
    <div class="game-info">
      <p>Price: <strong>${game.price}</strong></p>
      {#if game.prediction}
        {#if game.prediction.predictionDate}
          <p>
            Prediction Price: <strong>${formatter.format(game.prediction.predictionPrice)}</strong>
          </p>
          <p>
            Predicted Date: <strong
              >{new Date(game.prediction.predictionDate).toLocaleDateString()}</strong
            >
          </p>
        {/if}
      {/if}
    </div>
  </div>
  <button onclick={() => goto(`/games/${game?.gameId}/salehistory`)}> View Sale History </button>
  <div class="bottom-bar">
    <button class="add-button" onclick={handleAdd}> +Add to wishlist </button>
  </div>
{/if}

<style>
  .bottom-bar {
    position: relative;
  }
  .add-button {
    margin-top: 15px;
    padding: 10px, 50px;
    background-color: green;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
  }

  .add-button {
    background-color: #22c55e;
    transform: translateY(-2px);
  }

  .game-container {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
  }
</style>
