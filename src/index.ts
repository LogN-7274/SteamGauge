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

app.post('/api/games', createGame);
app.get('/api/games/:gameId', displayGame);
app.get('/api/games', displayAllGames);

app.post('/api/salehistory/:gameId', createSaleHistory);
app.get('/api/salehistory/:gameId', displaySaleHistory);

app.post('/api/predictions/:gameId', createPrediction);
app.get('/api/predictions/:gameId', displayPrediction);

app.post('/api/users', registerUser);
app.get('/api/users/:userId', displayUser);

app.get('/api/users/:userId/wishlist', displayWishlist);
app.post('/api/users/:userId/wishlist', createWishList);
app.put('/api/games/:gameId', addGameToWish);
app.put('/api/users/:userId/wishlist/remove', removeGameFromWish);

app.get('/api/users/:userId/interest', displayInterest);
app.post('/api/users/:userId/interest', createInterest);

app.delete('/api/logout', logOut);
app.post('/api/login', logIn);
app.get('/api/me', (req, res) => {
  if (!req.session.isLoggedIn || !req.session.authenticatedUser) {
    res.sendStatus(401);
    return;
  }

  const { userId, email, displayName } = req.session.authenticatedUser;
  res.json({ id: userId, email, displayName });
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
