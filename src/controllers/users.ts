// src/controllers/UserController.ts
import argon2 from 'argon2';
import { Request, Response } from 'express';
import { createUserSchema } from '../validators/users.js';
import { addUser } from '../models/users.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { v7 as uuidv7 } from 'uuid';

export async function registerUser(req: Request, res: Response): Promise<void> {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { userName, passToHash, email } = result.data;

  try {
    const saltForHash = uuidv7(); //Need to check with Saldivar if this is ok for salt
    const passwordHash = await argon2.hash(passToHash + saltForHash);
    const newUser = await addUser(userName, passwordHash, email, saltForHash);
    console.log(newUser);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}
// import { Request, Response } from 'express';
// import { createUserSchema } from '../validators/users.js';

// export async function createUser(req: Request, res: Response): Promise<void> {
//   const body = createUserSchema.safeParse(req.body);

//   if (!body.success) {
//     console.log('Status 400, req.body:', req.body);
//     res.status(400).json({ message: body.error });
//     return;
//   }

//   const madeUser = await
// }
