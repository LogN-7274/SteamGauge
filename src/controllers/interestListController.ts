import { Request, Response } from 'express';
import { getUserById, updateUserForCreate } from '../models/users.js';
import { addInterest, getInterestByUser } from '../models/interestlists.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { getUserIdSchema } from '../validators/users.js';

async function createInterest(req: Request, res: Response): Promise<void> {
  const reqId = getUserIdSchema.safeParse(req.body);

  if (!reqId.success) {
    console.log('createWishlist request parse failed');
    res.status(400).json({ message: reqId.error });
    return;
  }

  const foundUser = await getUserById(reqId.data.userId);

  if (!foundUser) {
    console.log('createInterestlist user not found');
    res.status(404).json({ message: 'User not found' });
    return;
  }

  try {
    const newInterest = await addInterest();
    foundUser.interestList = newInterest;
    updateUserForCreate(foundUser);
    console.log('wishlist created');
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function displayInterest(req: Request, res: Response): Promise<void> {
  const reqId = getUserIdSchema.safeParse(req.params);

  if (!reqId.success) {
    console.log('displayUserInterest request parse failed');
    res.status(400).json({ message: reqId.error });
    return;
  }

  const foundUser = await getUserById(reqId.data.userId);

  if (!foundUser) {
    console.log('displayUserWishlist user not found');
    res.status(404).json({ message: 'User not found' });
    return;
  }

  console.log('successfully retrieved user');

  const foundUserInterest = getInterestByUser(foundUser.userId);

  if (!foundUserInterest) {
    console.log('user wishlist not found');
    res.status(500).json({ message: 'Internal error, no wishlist available' });
    return;
  }

  res.status(200).json(foundUserInterest);
  return;
}

export { createInterest, displayInterest };
