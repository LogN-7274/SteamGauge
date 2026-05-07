<script lang="ts">
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

  interface SaleHistory {
    saleHistoryId: string;
    dealDate: Date;
    deal: number;
    cut: number;
    game: Game;
  }

  let saleHistory: SaleHistory[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    const gameId = page.params.gameId;
    const result = await api.get<SaleHistory[]>(`/games/${gameId}/salehistory`);
    if (result.ok) {
      saleHistory = result.data;
    }

    loading = false;
  });
</script>

{#if loading}
  <Loading />
{:else if saleHistory.length === 0}
  <p>No sale history for this game.</p>
{:else}
  <h1>{saleHistory[0].game.title}'s Sale History</h1>
  <table>
    <thead>
      <tr>
        <th>Regular Price</th>
        <th>Deal</th>
        <th>Discount</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {#each saleHistory as history}
        <tr>
          <td>${history.game.price}</td>
          <td>${history.deal}</td>
          <td>{history.cut}%</td>
          <td>{new Date(history.dealDate).toLocaleDateString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
