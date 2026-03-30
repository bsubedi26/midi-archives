import express from 'express';
import bcrypt from 'bcryptjs';
import { createUser } from '../config/db_config';

var router = express.Router();

router.post('/', (req, res) => {
  console.log('new user sign up post received');
  const { username, password, email } = req.body;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) throw err;
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) throw err;
      try {
        createUser(username, hash, email);
        res.redirect('/');
      } catch (e) {
        if (e && e.message && e.message.indexOf('UNIQUE constraint') !== -1) {
          return res.status(400).json({ errors: { username: 'Username or email already taken' } });
        }
        throw e;
      }
    });
  });
});

export default router;
