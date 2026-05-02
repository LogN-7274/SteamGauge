import { AppDataSource } from '../dataSource.js';
import { WishList } from '../entities/WishList.js';
import { getUserById } from './users.js';

const WishListRepository = AppDataSource.getRepository(WishList);

async function getAllWish(): Promise<WishList[]> {
  return WishListRepository.find();
}

async function addWishList(userId: string): Promise<WishList> {
  const newList = new WishList();
  newList.userId = userId;

  console.log('created user interest list');
  return WishListRepository.save(newList);
}

async function removeWishlist(userId: string): Promise<void> {
  const foundUser = await getUserById(userId);
  if (foundUser) {
    await WishListRepository.remove(foundUser.wishlist);
  }
}
//bla

async function updateWishList(wishlist: WishList): Promise<WishList> {
  return await WishListRepository.save(wishlist);
}

export { addWishList, getAllWish, removeWishlist, updateWishList };
