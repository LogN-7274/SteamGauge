import { Request, Response } from 'express';
import { getGameById } from '../models/games.js';
import { getUserById, updateUserForCreate } from '../models/users.js';
import { addWishList, removeWishlist, updateWishList } from '../models/wishlists.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { getUserIdSchema } from '../validators/users.js';
import { GetGameSchema } from '../validators/games.js';

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
    const newWish = await addWishList(reqId.data.userId);
    foundUser.wishlist = newWish;
    await updateUserForCreate(foundUser);
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

  res.status(200).json(foundUser.wishlist);
  return;
}

async function deleteWishlist(userId: string): Promise<boolean> {
  //This function will only ever be called when deleting a user account, and we return a boolean so
  //that in our delete user function we can know if this function failed, and if so we can return
  //status 500.
  console.log('deleting user wishlist');
  const foundUser = await getUserById(userId);
  let succeeded: boolean;
  succeeded = true;

  if (!foundUser) {
    console.log('cannot find user for wishlist deletion');
    succeeded = false;
  }

  console.log('successfully retrieved user for wish deletion');

  await removeWishlist(foundUser.userId);
  return succeeded;
}

async function addGameToWish(req: Request, res: Response): Promise<void> {
  try {
    const { gameId } = req.params as Record<string, string>;
    const userId = getUserIdSchema.safeParse(req.body);

    if (!gameId) {
      console.log('bad wishlist add request: gameId parameter');
      res.status(400).json({ message: 'bad request' });
      return;
    } else if (!userId.success) {
      console.log('bad wishlist add request: userId body');
      res.status(400).json({ message: userId.error });
      return;
    }

    const gameFound = await getGameById(gameId);
    const userFound = await getUserById(userId.data.userId);

    if (!gameFound) {
      console.log('attempting to add a nonexistant game to a wishlist');
      res.status(404).json({ message: 'Game not found' });
      return;
    } else if (!userFound) {
      console.log('attempting to add a game to the wishlist of a nonexistant user');
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const wishToUpdate = userFound.wishlist;

    if (!wishToUpdate) {
      console.log('server error, no wishlist for user');
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    let gameIsIn = false;
    for (const game of wishToUpdate.games) {
      if (game.gameId === gameId) {
        gameIsIn = true;
      }
    }

    if (gameIsIn) {
      console.log('attemping to add an already listed game');
      res.status(403).json({ message: 'Error, game is already in list' });
      return;
    }

    wishToUpdate.games.push(gameFound);
    await updateWishList(wishToUpdate);
    res.status(200).json({ message: 'Successfully added game to wishlist' });
    return;
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
    return;
  }
}

async function removeGameFromWish(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as Record<string, string>; //Need to ask Saldivar about this
  const gameId = GetGameSchema.safeParse(req.body);

  if (!userId) {
    console.log('bad wishlist remove request: userId parameter');
    res.status(400).json({ message: 'bad request' });
    return;
  } else if (!gameId.success) {
    console.log('bad wishlist remove request: userId body');
    res.status(400).json({ message: gameId.error });
    return;
  }

  const gameFound = await getGameById(gameId.data.gameId);
  const userFound = await getUserById(userId);

  if (!gameFound) {
    console.log('attempting to remove a nonexistant game to a wishlist');
    res.status(404).json({ message: 'Game not found' });
    return;
  } else if (!userFound) {
    console.log('attempting to remove a game to the wishlist of a nonexistant user');
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const wishToUpdate = userFound.wishlist;

  if (!wishToUpdate) {
    console.log('server error, no wishlist for user');
    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  let gameIsIn = false;
  for (const game of wishToUpdate.games) {
    if (game.gameId === gameId.data.gameId) {
      gameIsIn = true;
    }
  }

  if (!gameIsIn) {
    console.log('attemping to remove a game not in a wishlist');
    res.status(403).json({ message: 'Error, game is not list yet' });
    return;
  }

  wishToUpdate.games = wishToUpdate.games.filter((game) => {
    return game.gameId != gameFound.gameId;
  });
  await updateWishList(wishToUpdate);
  res.status(200).json({ message: 'Successfully removed game from wishlist' });
  return;
}

export { addGameToWish, createWishList, deleteWishlist, displayWishlist, removeGameFromWish };
