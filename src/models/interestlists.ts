import { AppDataSource } from '../dataSource.js';
import { InterestList } from '../entities/InterestList.js';

const InterestRepository = AppDataSource.getRepository(InterestList);

async function getAllInterest(): Promise<InterestList[]> {
  return InterestRepository.find();
}

async function getInterestByUser(userId: string): Promise<InterestList | null> {
  return InterestRepository.findOne({ where: { userId }, relations: ['wishlists'] });
}

async function addInterest(): Promise<InterestList> {
  const newList = new InterestList();

  console.log('created user interest list');
  return InterestRepository.save(newList);
}

async function removeInterest(userId: string): Promise<void> {
  const interestToDelete: InterestList | null = await getInterestByUser(userId);
  if (interestToDelete) {
    await InterestRepository.remove(interestToDelete);
  }
}

async function updateInterest(interestList: InterestList): Promise<InterestList> {
  return await InterestRepository.save(interestList);
}

export { addInterest, getAllInterest, getInterestByUser, removeInterest, updateInterest };
