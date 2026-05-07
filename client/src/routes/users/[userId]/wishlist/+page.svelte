<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  //THIS IS /users/[userId]/wishlist

  const userId = page.params.userId;

  let submitting = $state(false);
  let foundWishlist = $state<WishList | null>(null);
  let hasInterest = $state(false);
  let otherUserName = $state('');

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

  interface PublicUser {
    userId: string;
    userName: string;
    displayName: string;
    email: string;
  }

  async function takeInterest(): Promise<void> {
    const added = await api.put(`/users/${userId}/wishlist/interest`, { userId: auth.user?.id });
    if (added.ok) {
      hasInterest = true;
      toast.success('Added Wishlist to Interest');
    } else {
      toast.error('Failed to add Wishlist to Interest List');
    }
  }

  onMount(async () => {
    await auth.refresh();
    if (!auth.user) {
      goto('/');
    } else {
      const wishGrab = await api.get<WishList>(`/users/${userId}/wishlist`);
      if (wishGrab.ok) {
        foundWishlist = wishGrab.data;
      }

      const userResult = await api.get<PublicUser>(`/users/${userId}`);
      if (userResult.ok) {
        otherUserName = userResult.data.displayName;
      }
    }
  });
</script>

{#if auth.loading}
  <p aria-busy="true">Checking session…</p>
{:else if auth.user}
  <h1>{otherUserName}'s Wishlist</h1>
  {#if !hasInterest}
    <button onclick={takeInterest}>Add to My Interest List</button>
  {:else}
    <p>Already in your interest list</p>
  {/if}
  {#each foundWishlist?.games as game: Game}
    <div>
      <a href="/games/{game.gameId}">{game.title}</a>
    </div>
  {/each}
  <a href="/users/{auth.user.id}">Back Home</a>
{:else}
  <p>Please log in</p>
  <a href="/login" role="button">Log in</a>
{/if}
