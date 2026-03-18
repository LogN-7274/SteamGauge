import { AppDataSource } from '../dataSource.js';
import { User } from '../entities/User.js';

const userRepository = AppDataSource.getRepository(User);

async function getAllUsers(): Promise<User[]> {
  return userRepository.find();
}

async function getUserById(userId: string): Promise<User | null> {
  return userRepository.findOne({ where: { userId } });
}

async function addUser(
  userName: string,
  passwordHash: string,
  email: string,
  saltForHash: string,
): Promise<User> {
  const newUser = new User();
  newUser.email = email;
  newUser.passHash = passwordHash;
  newUser.userName = userName;
  newUser.passSalt = saltForHash;

  return userRepository.save(newUser);
}

export { getAllUsers, getUserById, addUser };
