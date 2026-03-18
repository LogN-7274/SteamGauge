// src/controllers/UserController.ts
import argon2 from 'argon2';
import { Request, Response } from 'express';
import { addUser, getUserById } from '../models/users.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { createUserSchema, getUserIdSchema } from '../validators/users.js';

export async function registerUser(req: Request, res: Response): Promise<void> {
  const result = createUserSchema.safeParse(req.body);
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

export async function displayUser(req: Request, res: Response): Promise<void> {
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
