<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth } from '$lib/auth.svelte';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { toast } from '$lib/toast.svelte';
  
  //THIS IS /users/[userId]/wishlist/self

  const userId = page.params.userId;

  let userWishlist = $state<WishList | null>(null);

  interface Game {
    gameId: string;
    title: string;
    price: number;
    boxart: string;
  }

  interface WishList {
    userId: string;
    games: Game[];
  }

  onMount(async () => {
    if (!auth.user) {
      goto('/');
    }
    else{
      const wishGrab = await api.get<WishList>(`/users/${userId}/wishlist`);
      if (wishGrab.ok){
        userWishlist = wishGrab.data;
      }
    }
  });

  async function removeGame(gameId: string): Promise<void>{
    const removal = await api.put(`/users/${userId}/wishlist/remove`, {gameId});
    if (removal.ok){
      if(userWishlist){
        userWishlist.games = userWishlist.games.filter(game => game.gameId !== gameId);
        toast.success('Removed Game');
      }
    } else{
      toast.error('Failed to remove Game');
    }
  }
</script>

{#if auth.loading}
  <p aria-busy="true">Checking session…</p>
{:else if auth.user}
  {#each userWishlist?.games as game: Game}
    <div>
      <a href="games/{game.gameId}">{game.title}</a>
      <button onclick={() => removeGame(game.gameId)}>Remove</button>
    </div>
  {/each}
  <a href="user/{userId}">Back Home</a>
{:else}
  <p>Please log in</p>
  <a href="/login" role="button">Log in</a>
{/if}