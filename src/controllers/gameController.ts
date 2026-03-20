import { Request, Response } from 'express';
import { addGame } from '../models/games.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateGameSchema } from '../validators/games.js';

async function createGame(req: Request, res: Response): Promise<void> {
  const result = CreateGameSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { name, price } = result.data;

  try{
    const newGame = await addGame(name, price);
    console.log(newGame);
    res.sendStatus(201);
  } catch(err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export { createGame };
