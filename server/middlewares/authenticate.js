import jwt from 'jsonwebtoken';
import config from '../config';
import { getUserById } from '../config/db_config';

export default (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }

  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Failed to authenticate' });
      } else {
        const user = getUserById(decoded.id);
        if (!user) {
          console.log('no user');
          res.status(404).json({ error: 'No such user' });
        } else {
          console.log('user found');
          req.user = user;
          next();
        }
      }
    });
  } else {
    res.status(403).json({
      error: 'No token provided'
    });
  }
};
