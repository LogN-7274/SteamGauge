import axios from 'axios';
import { Request, Response } from 'express';
import { Game } from '../entities/Game.js';
import { addGame, getAllGames, getGameById } from '../models/games.js';
import { addSaleHistory } from '../models/salehistory.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { GetGameSchema } from '../validators/games.js';

async function logGames(req: Request, res: Response) : Promise<void> {
  const result = await axios.get('https://api.isthereanydeal.com/games/history/v2', 
       { params: { key: process.env.API_KEY, limit: 200 } });

  if(!result){
    res.status(404);
    return;
  }

  const ids = Array.from(result.data, (game: any) => game.id);
  const titles = Array.from(result.data, (game: any) => game.title);

  const priceResults = await axios.post('https://api.isthereanydeal.com/games/prices/v3', ids, 
    { params: { key: process.env.API_KEY } }
  )

  if(!priceResults){
    res.status(404);
    return;
  }

  const amounts = priceResults.data.flatMap((price: any) => price.deals.map(
    (deal: any) => deal.regular.amount));

  try { 
    for(let i = 0; i < 200; i++){
      console.log(ids[i], titles[i], amounts[i])
      const infoResult = await axios.get('https://api.isthereanydeal.com/games/info/v2',
        { params: { key: process.env.API_KEY, id: ids[i] }}
      )
      const boxart = infoResult.data.assets.boxart;
      await addGame(ids[i], titles[i], amounts[i], boxart);

      const historylogResult = await axios.get('https://api.isthereanydeal.com/games/history/v2',
        { params: { key: process.env.API_KEY, id: ids[i], shops: 61, 
          since:"2000-12-27T11:21:08+01:00"}}
      )

      const historyData = historylogResult.data;

      for(let j = 0; j < historylogResult.data.length; j++){
        console.log(historyData[j].deal.price.amount);
        console.log(historyData[j].timestamp);
        console.log(historyData[j].deal.cut)

        await addSaleHistory(historyData[j].deal.price.amount, 
                       historyData[j].timestamp,
                       historyData[j].deal.cut,
                       ids[i]
        )
      }
      
      // await calculatePredictions();

    }
    res.sendStatus(201);
    return;
  } catch(err){
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
    return;
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
  
  let games: Game[];

  games = await getAllGames();

  console.log('Successfully retrieved games');
  res.status(200).json(games);
  return;
}

export { displayAllGames, displayGame, logGames };

