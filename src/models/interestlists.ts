import { AppDataSource } from '../dataSource.js';
import { InterestList } from '../entities/InterestList.js';

const InterestRepository = AppDataSource.getRepository(InterestList);

async function getAllInterest(): Promise<InterestList[]> {
  return InterestRepository.find();
}

async function getInterestByUser(userId: string): Promise<InterestList | null> {
  return InterestRepository.findOne({ where: { userId } });
}

async function addInterest(): Promise<InterestList> {
  const newList = new InterestList();

  console.log('created user interest list');
  return InterestRepository.save(newList);
}

export { addInterest, getAllInterest, getInterestByUser };
