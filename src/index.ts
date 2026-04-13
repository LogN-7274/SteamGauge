import express, { Express } from 'express';
import './config.js'; // do not remove this line
import { sessionMiddleware } from './sessionConfig.js';

const app: Express = express();

// bla
app.use(sessionMiddleware); // Setup session management middleware
app.use(express.json()); // Setup JSON body parsing middleware
app.use(express.urlencoded({ extended: false })); // Setup urlencoded (HTML Forms) body parsing middleware

// Setup static resource file middleware
// This allows the client to access any file inside the `public` directory
// Only put file that you actually want to be publicly accessibly in the `public` folder
app.use(express.static('public', { extensions: ['html'] }));

// -- Routes --------------------------------------------------
// Register your routes below this line
//bla

import { createGame, displayGame } from './controllers/gameController.js';
app.post('/games', createGame);
app.get('/games/:gameId', displayGame);

import { displayAllGames } from './controllers/gameController.js';
app.get('/games', displayAllGames);

import { createSaleHistory } from './controllers/saleHistoryController.js';
app.post('/salehistory/:gameId', createSaleHistory);

import { displaySaleHistory } from './controllers/saleHistoryController.js';
app.get('/salehistory/:gameId', displaySaleHistory);

import { createPrediction } from './controllers/predictionController.js';
app.post('/predictions/:gameId', createPrediction);

import { displayPrediction } from './controllers/predictionController.js';
app.get('/predictions/:gameId', displayPrediction);

import { registerUser } from './controllers/userController.js';
app.post('/users', registerUser);

import { displayUser } from './controllers/userController.js';
app.get('/users/:userId', displayUser);

import { displayWishlist } from './controllers/wishListController.js';
app.get('/users/:userId/wishlist', displayWishlist);

import { createWishList } from './controllers/wishListController.js';
app.post('/users/:userId', createWishList);

// import { displayInterest } from './controllers/interestListController.js';
// app.get('/users/:userId/interest', displayInterest);

// import { createInterest } from './controllers/interestListController.js';
// app.post('/users/:userId/interest', createInterest);

import { logOut } from './controllers/userController.js';
app.delete('/logout', logOut);

import { logIn } from './controllers/userController.js';
app.post('/login', logIn);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
