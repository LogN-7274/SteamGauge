// src/controllers/UserController.ts
import argon2 from 'argon2';
import { Request, Response } from 'express';
import { addUser, deleteUserEntry, getUserByEmail, getUserById } from '../models/users.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { getUserIdSchema, registerUserSchema } from '../validators/users.js';
import { deleteInterest } from './interestListController.js';
import { deleteWishlist } from './wishListController.js';

async function registerUser(req: Request, res: Response): Promise<void> {
  const result = registerUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { userName, passToHash, email } = result.data;

  try {
    const passwordHash = await argon2.hash(passToHash);
    const newUser = await addUser(userName, passwordHash, email);
    console.log(newUser);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function displayUser(req: Request, res: Response): Promise<void> {
  const reqId = getUserIdSchema.safeParse(req.params);

  if (!reqId.success) {
    console.log('displayUser request parse failed');
    res.status(400).json({ message: reqId.error });
    return;
  }

  const foundUser = await getUserById(reqId.data.userId);

  if (!foundUser) {
    console.log('displayUser user not found');
    res.status(404).json({ message: 'User not found' });
    return;
  }

  console.log('successfully retrieved user');
  res.status(200).json(foundUser);
  return;
}

async function logIn(req: Request, res: Response): Promise<void> {
  const result = registerUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { email, passToHash } = result.data;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      req.session.logInAttempts = (req.session.logInAttempts ?? 0) + 1;
      res.sendStatus(403);
      return;
    }

    if (!(await argon2.verify(user.passHash, passToHash))) {
      req.session.logInAttempts = (req.session.logInAttempts ?? 0) + 1;
      res.sendStatus(403);
      return;
    }

    await req.session.clearSession();
    req.session.authenticatedUser = { userId: user.userId, email: user.email, 
                                      displayName: user.displayName };
    req.session.isLoggedIn = true;

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

// .
async function logOut(req: Request, res: Response): Promise<void> {
  await req.session.clearSession();
  res.sendStatus(204);
}

async function deleteUser(req: Request, res: Response): Promise<void> {
  //TODO need to finish
  const reqId = getUserIdSchema.safeParse(req.params);
  if (!reqId.success) {
    console.log('bad request for deleting user');
    res.status(400).json({ message: reqId.error });
    return;
  }

  const interestFail = await deleteInterest(reqId.data.userId);
  const wishFail = await deleteWishlist(reqId.data.userId);

  if (interestFail) {
    console.log('interest deletion failed');
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  } else if (wishFail) {
    console.log('interest deletion failed');
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  console.log('deleting user');
  await deleteUserEntry(reqId.data.userId);
  res.status(204);
}

export { deleteUser, displayUser, logIn, logOut, registerUser };
