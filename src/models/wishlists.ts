import { AppDataSource } from '../dataSource.js';
import { WishList } from '../entities/WishList.js';

const WishListRepository = AppDataSource.getRepository(WishList);

async function getAllWish(): Promise<WishList[]> {
  return WishListRepository.find();
}

async function getWishByUser(userId: string): Promise<WishList | null> {
  return WishListRepository.findOne({ where: { userId }, relations: ['games'] });
}

async function addWishList(): Promise<WishList> {
  const newList = new WishList();

  console.log('created user interest list');
  return WishListRepository.save(newList);
}

async function removeWishlist(userId: string): Promise<void> {
  const wishToDelete: WishList | null = await getWishByUser(userId);
  if (wishToDelete) {
    await WishListRepository.remove(wishToDelete);
  }
}

async function updateWishList(wishlist: WishList): Promise<WishList> {
  return await WishListRepository.save(wishlist);
}

export { addWishList, getAllWish, getWishByUser, removeWishlist, updateWishList };
