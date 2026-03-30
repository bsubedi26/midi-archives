import express from 'express';
import { getUserById, setFavoriteMidis } from '../config/db_config';
const fs = require('fs');
const path = require('path');

var router = express.Router();

router.get('/getFavorites', function(req, res) {
  console.log(req.user);
  const user = getUserById(req.user._id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

router.post('/addFavorites', function(req, res) {
  console.log(req.body);
  const { user, favorites } = req.body;
  try {
    setFavoriteMidis(user, favorites);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save favorites' });
  }
});

router.get('/folder/:name', function(req, res) {
  var name = req.params.name;

  fs.readdir(path.join(__dirname, '../../public/midi/' + name), (err, files) => {
    if (err) throw err;
    var arr = [];
    arr.push(files);
    res.json(arr);
  });
});

export default router;
