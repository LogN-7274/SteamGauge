import express, { Express } from 'express';
import './config.js'; // do not remove this line
import { sessionMiddleware } from './sessionConfig.js';

const app: Express = express();

app.use(sessionMiddleware); // Setup session management middleware
app.use(express.json()); // Setup JSON body parsing middleware
app.use(express.urlencoded({ extended: false })); // Setup urlencoded (HTML Forms) body parsing middleware

// Setup static resource file middleware
// This allows the client to access any file inside the `public` directory
// Only put file that you actually want to be publicly accessibly in the `public` folder
app.use(express.static('public', { extensions: ['html'] }));

// -- Routes --------------------------------------------------
// Register your routes below this line

import { createGame, displayAllGames, displayGame } from './controllers/gameController.js';
import { createInterest, displayInterest } from './controllers/interestListController.js';
import { createPrediction, displayPrediction } from './controllers/predictionController.js';
import { createSaleHistory, displaySaleHistory } from './controllers/saleHistoryController.js';
import { displayUser, logIn, logOut, registerUser } from './controllers/userController.js';
import {
  addGameToWish,
  createWishList,
  displayWishlist,
  removeGameFromWish,
} from './controllers/wishListController.js';

app.post('/games', createGame);
app.get('/games/:gameId', displayGame);
app.get('/games', displayAllGames);

app.post('/salehistory/:gameId', createSaleHistory);
app.get('/salehistory/:gameId', displaySaleHistory);

app.post('/predictions/:gameId', createPrediction);
app.get('/predictions/:gameId', displayPrediction);

app.post('/users', registerUser);
app.get('/users/:userId', displayUser);

app.get('/users/:userId/wishlist', displayWishlist);
app.post('/users/:userId', createWishList);
app.put('/games/:gameId', addGameToWish);
app.put('/users/:userId/wishlist', removeGameFromWish);

app.get('/users/:userId/interest', displayInterest);
app.post('/users/:userId/interest', createInterest);

app.delete('/logout', logOut);
app.post('/login', logIn);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
