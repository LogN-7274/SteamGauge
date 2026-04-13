import { Request, Response } from 'express';
import { Game } from '../entities/Game.js';
import { addGame, getAllGames, getGameById } from '../models/games.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateGameSchema, getAllGamesSchema, GetGameSchema } from '../validators/games.js';

async function createGame(req: Request, res: Response): Promise<void> {
  const result = CreateGameSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { name, price, type } = result.data;

  try {
    const newGame = await addGame(name, price, type);
    console.log(newGame);
    res.sendStatus(201);
  } catch (err) {
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
  if (!game) {
    console.log('Could not find game');
    res.status(404).json({ message: 'Game Not Found' });
    return;
  }

  console.log('Successfully retrieved game');
  res.status(200).json(game);
  return;
}

async function displayAllGames(req: Request, res: Response): Promise<void> {
  const result = getAllGamesSchema.safeParse(req.query);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { type } = result.data;

  let games: Game[];

  if (type != undefined) {
    games = await getAllGames(type);
  } else {
    games = await getAllGames();
  }

  console.log('Successfully retrieved games');
  res.status(200).json(games);
  return;
}

export { createGame, displayAllGames, displayGame };
