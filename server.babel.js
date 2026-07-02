import express from 'express';
import rateLimit from 'express-rate-limit';
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/dist'));
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
import users from './server/routes/users';
import auth from './server/routes/auth';
import events from './server/routes/events';
import midi from './server/routes/midi';
import scrape from './server/routes/scrape';
import authenticate from './server/middlewares/authenticate';

// Throttle login/signup attempts to slow down credential-stuffing and brute force.
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/users', authRateLimiter, users);
app.use('/api/auth', authRateLimiter, auth);
app.use('/api/events', events);
app.use('/api/midi', authenticate, midi);
app.use('/api/scrape', authenticate, scrape);

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(err) {
	if (err) throw err;
	console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', PORT, PORT);
});
