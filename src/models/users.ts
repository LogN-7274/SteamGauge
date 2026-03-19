import { AppDataSource } from '../dataSource.js';
import { User } from '../entities/User.js';

const userRepository = AppDataSource.getRepository(User);

async function getAllUsers(): Promise<User[]> {
  return userRepository.find();
}

async function getUserById(userId: string): Promise<User | null> {
  return userRepository.findOne({ where: { userId } });
}

async function addUser(userName: string, passwordHash: string, email: string): Promise<User> {
  const newUser = new User();
  newUser.email = email;
  newUser.passHash = passwordHash;
  newUser.userName = userName;

  console.log('new user created. ID: ', newUser.userId);
  return userRepository.save(newUser);
}

async function getUserByEmail(email: string): Promise<User | null> {
  return userRepository.findOne({ where: { email } });
}

async function updateUserForCreate(user: User): Promise<User> {
  return userRepository.save(user);
}

export { addUser, getAllUsers, getUserById, getUserByEmail, updateUserForCreate };
