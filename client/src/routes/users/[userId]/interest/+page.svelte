<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth } from '$lib/auth.svelte';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { toast } from '$lib/toast.svelte';
  
  //THIS IS /users/[userId]/wishlist/self

  const userId = page.params.userId;

  let userInterest = $state<InterestList | null>(null);

  interface WishList {
    userId: string;
    displayName: string;
  }

  interface InterestList {
    userId: string;
    wishlists: WishList[];
  }

  interface PublicUser {
    userId: string;
    userName: string;
    displayName: string;
    email: string;
  }

  onMount(async () => {
    if (!auth.user) {
      goto('/');
    }
    else{
      const interestGrab = await api.get<InterestList>(`/users/${userId}/interest`);
      if (interestGrab.ok){
        userInterest = interestGrab.data;
      }
      
      if (userInterest){
        for (const wish of userInterest.wishlists) {
          const userResult = await api.get<PublicUser>(`/users/${wish.userId}`);
          if (userResult.ok) {
            wish.displayName = userResult.data.displayName;
          }
        }
    }
    }
  });

  async function removeWishList(wishUserId: string): Promise<void>{
    if (wishUserId == userId){
      toast.error('Cannot remove your own Wishlist');
    } else {
      const removal = await api.put(`/users/${userId}/wishlist/remove`, {wishUserId});
      if (removal.ok){
        if(userInterest){
          userInterest.wishlists = userInterest.wishlists.filter(wish => wish.userId !== wishUserId);
          toast.success('Removed Wishlist');
        }
      } else{
        toast.error('Failed to remove Wishlist');
      }
    }
  }
</script>

{#if auth.loading}
  <p aria-busy="true">Checking session…</p>
{:else if auth.user}
  <h1>My Interest List</h1>
  <p>Check out what games your friends are hoping go on sale, or remove them if you don't need the clutter</p>
  {#each userInterest?.wishlists as wish: WishList}
    <div>
      <a href="/users/{wish.userId}">{wish.displayName}'s Wishlist</a>
      <button onclick={() => removeWishList(wish.userId)}>Remove</button>
    </div>
  {/each}
  <a href="/users/{userId}">Back Home</a>
{:else}
  <p>Please log in</p>
  <a href="/login" role="button">Log in</a>
{/if}