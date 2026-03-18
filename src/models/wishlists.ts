import { AppDataSource } from '../dataSource.js';
import { WishList } from '../entities/WishList.js';

const InterestRepository = AppDataSource.getRepository(WishList);

async function getAllInterest(): Promise<WishList[]> {
  return InterestRepository.find();
}

async function getInterestByUser(userId: string): Promise<WishList | null> {
  return InterestRepository.findOne({ where: { userId } });
}

async function addInterest(): Promise<WishList> {
  const newList = new WishList();

  console.log('created user interest list');
  return InterestRepository.save(newList);
}

export { addInterest, getAllInterest, getInterestByUser };
