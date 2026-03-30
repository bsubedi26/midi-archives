import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import { getUserByUsername } from '../config/db_config';

let router = express.Router();

router.post('/', (req, res) => {
  const { identifier, password } = req.body;
  console.log('console post');

  const user = getUserByUsername(identifier);

  if (user) {
    bcrypt.compare(password, user.password, function(err, response) {
      if (err) throw err;
      if (response === true) {
        console.log('right password');
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email
          },
          config.jwtSecret
        );
        res.json({ token });
      } else {
        res.json({ errors: { form: 'Invalid Credentials' } });
      }
    });
  } else {
    res.json({ errors: { form: 'Invalid Credentials' } });
  }
});

export default router;
