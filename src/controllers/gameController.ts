import { Request, Response } from 'express';
import { addGame, getGameById } from '../models/games.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateGameSchema, GetGameSchema } from '../validators/games.js';

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

async function displayGame(req: Request, res: Response): Promise<void> {
  const result = GetGameSchema.safeParse(req.params);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { gameId } = result.data;

  const game = await getGameById(gameId);
  if(!game){
    console.log("Could not find game");
    res.status(404).json({message: 'Game Not Found'});
    return;
  }

  console.log('Successfully retrieved game');
  res.status(200).json(game);
  return;
}

export { createGame, displayGame };
