import { Request, Response } from 'express';
import {
  addInterest,
  getInterestByUser,
  removeInterest,
  updateInterest,
} from '../models/interestlists.js';
import { getUserById, updateUserForCreate } from '../models/users.js';
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
    const newInterest = await addInterest(foundUser.userId);
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

async function deleteInterest(userId: string): Promise<boolean> {
  //This function will only ever be called when deleting a user account, and we return a boolean so
  //that in our delete user function we can know if this function failed, and if so we can return
  //status 500.
  console.log('deleting user interestlist');
  const foundUser = await getUserById(userId);
  let succeeded: boolean;
  succeeded = true;

  if (!foundUser) {
    console.log('cannot find user for wishlist deletion');
    succeeded = false;
  }

  console.log('successfully retrieved user for wish deletion');

  const foundUserInterest = await getInterestByUser(foundUser.userId);

  if (!foundUserInterest) {
    console.log('user wishlist for deltion not found');
    succeeded = false;
  }

  await removeInterest(foundUser.userId);
  return succeeded;
}

async function addWishToInterest(req: Request, res: Response): Promise<void> {
  const { InterestUserId } = req.params as Record<string, string>; //Need to ask Saldivar about this
  const wishUserId = getUserIdSchema.safeParse(req.body);

  if (!InterestUserId) {
    console.log('bad interest list add request: interest userId parameter');
    res.status(400).json({ message: 'bad request' });
    return;
  } else if (!wishUserId.success) {
    console.log('bad interest list add request: wish userId body');
    res.status(400).json({ message: wishUserId.error });
    return;
  }

  const userFound = await getUserById(wishUserId.data.userId);

  if (!userFound) {
    console.log('attempting to add a nonexistant wishlist to an interest list');
    res.status(404).json({ message: 'wishlist not found' });
    return;
  }

  const interestFound = userFound.interestList;
  if (!interestFound) {
    console.log('attempting to add a wishlist to a nonexistant interest list');
    res.status(404).json({ message: 'Interest list not found' });
    return;
  }

  let wishIsIn = false;
  for (const wishlist of interestFound.wishLists) {
    if (wishlist.userId === wishUserId.data.userId) {
      wishIsIn = true;
    }
  }

  if (wishIsIn) {
    console.log('attemping to add an already listed wishlist');
    res.status(403).json({ message: 'Error, wishlist is already in list' });
    return;
  }

  interestFound.wishLists.push(userFound.wishlist);
  await updateInterest(interestFound);
  res.status(200).json({ message: 'Successfully added wishlist to interest list' });
  return;
}

async function removeWishFromInterest(req: Request, res: Response): Promise<void> {
  const { InterestUserId } = req.params as Record<string, string>; //Need to ask Saldivar about this
  const wishUserId = getUserIdSchema.safeParse(req.body);

  if (!InterestUserId) {
    console.log('bad interest list add request: interest userId parameter');
    res.status(400).json({ message: 'bad request' });
    return;
  } else if (!wishUserId.success) {
    console.log('bad interest list add request: wish userId body');
    res.status(400).json({ message: wishUserId.error });
    return;
  }

  const userFound = await getUserById(wishUserId.data.userId);
  const wishFound = userFound.wishlist;
  const interestFound = await getInterestByUser(InterestUserId);

  if (!wishFound) {
    console.log('attempting to add a nonexistant wishlist to an interest list');
    res.status(404).json({ message: 'wishlist not found' });
    return;
  } else if (!interestFound) {
    console.log('attempting to remove a wishlist from a nonexistant interest list');
    res.status(500).json({ message: 'Interest list not found' });
    return;
  }
  if (wishUserId.data.userId === interestFound.userId) {
    console.log('attempting to remove own wishlist from interest');
    res.status(403).json({ message: 'Error, cannot remove own wishlist' });
    return;
  }

  let wishIsIn = false;
  for (const wishlist of interestFound.wishLists) {
    if (wishlist.userId === wishUserId.data.userId) {
      wishIsIn = true;
    }
  }

  if (!wishIsIn) {
    console.log('attemping to remove a wishlist that is not added yet');
    res.status(403).json({ message: 'Error, wishlist not in interest list' });
    return;
  }

  interestFound.wishLists = interestFound.wishLists.filter((wishlist) => {
    return wishlist.userId != wishUserId.data.userId;
  });
  await updateInterest(interestFound);
  res.status(200).json({ message: 'Successfully removed wishlist from interest list' });
  return;
}

export {
  addWishToInterest,
  createInterest,
  deleteInterest,
  displayInterest,
  removeWishFromInterest,
};
