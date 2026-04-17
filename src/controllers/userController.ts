// src/controllers/UserController.ts
import argon2 from 'argon2';
import { Request, Response } from 'express';
import { addUser, getUserByEmail, getUserById } from '../models/users.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { getUserIdSchema, registerUserSchema } from '../validators/users.js';

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

export { displayUser, logIn, logOut, registerUser };

