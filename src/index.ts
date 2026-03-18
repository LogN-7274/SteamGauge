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
// import { createGameProto } from './controllers/games.js';
// app.post('/games', createGameProto);
//TO BE CHANGED: will use the actual create when we can get the actual data

// import { displayGames } from './controllers/games.js';
// app.get('/games', displayGames);

// import { createSaleHistoryProto } from './controllers/saleHistories.js';
// app.post('/game/:gameId', createSaleHistoryProto);

// import { displaySaleHistory } from './controllers/saleHistories.js';
// app.get('/game/:gameId', displaySaleHistory);

import { registerUser } from './controllers/userController.js';
app.post('/users', registerUser);

// import { displayUser } from './controllers/users.js';
// app.get('/users/:userId', displayUser);

// import { displayWishlist } from './controllers/wishlists.js';
// app.get('/users/:userId/wishlist', displayWishlist);

// import { displayInterest } from './controllers/interetLists.js';
// app.get('/users/:userId/interest', displayInterest);

//uncomment
app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
