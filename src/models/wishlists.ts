import { AppDataSource } from '../dataSource.js';
import { WishList } from '../entities/WishList.js';

const WishListRepository = AppDataSource.getRepository(WishList);

async function getAllWish(): Promise<WishList[]> {
  return WishListRepository.find();
}

async function getWishByUser(userId: string): Promise<WishList | null> {
  return WishListRepository.findOne({ where: { userId } });
}

async function addWishList(): Promise<WishList> {
  const newList = new WishList();

  console.log('created user interest list');
  return WishListRepository.save(newList);
}

export { addWishList, getAllWish, getWishByUser };
