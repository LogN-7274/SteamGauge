import { Request, Response } from 'express';
import { getUserById, updateUserForCreate } from '../models/users.js';
import { addWishList, getWishByUser } from '../models/wishlists.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { getUserIdSchema } from '../validators/users.js';

async function createWishList(req: Request, res: Response): Promise<void> {
  const reqId = getUserIdSchema.safeParse(req.body);

  if (!reqId.success) {
    console.log('createWishlist request parse failed');
    res.status(400).json({ message: reqId.error });
    return;
  }

  const foundUser = await getUserById(reqId.data.userId);

  if (!foundUser) {
    console.log('createWishlist user not found');
    res.status(404).json({ message: 'User not found' });
    return;
  }

  try {
    const newWish = await addWishList();
    foundUser.wishlist = newWish;
    updateUserForCreate(foundUser);
    console.log('wishlist created');
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function displayWishlist(req: Request, res: Response): Promise<void> {
  const reqId = getUserIdSchema.safeParse(req.params);

  if (!reqId.success) {
    console.log('displayUserWishlist request parse failed');
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

  const foundUserWish = getWishByUser(foundUser.userId);

  if (!foundUserWish) {
    console.log('user wishlist not found');
    res.status(500).json({ message: 'Internal error, no wishlist available' });
    return;
  }

  res.status(200).json(foundUserWish);
  return;
}

export { createWishList, displayWishlist };
