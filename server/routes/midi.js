import express from 'express';
import { getUserById, setFavoriteMidis } from '../config/db_config';
const fs = require('fs');
const path = require('path');

var router = express.Router();

router.get('/getFavorites', function(req, res) {
  const user = getUserById(req.user._id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

router.post('/addFavorites', function(req, res) {
  const { favorites } = req.body;
  if (!Array.isArray(favorites)) {
    return res.status(400).json({ error: 'favorites must be an array' });
  }
  try {
    setFavoriteMidis(req.user.username, favorites);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save favorites' });
  }
});

const MIDI_ROOT = path.join(__dirname, '../../public/midi');

router.get('/folder/:name', function(req, res) {
  var name = req.params.name;

  // Only allow a single path segment (no separators, no traversal).
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return res.status(400).json({ error: 'Invalid folder name' });
  }

  var folderPath = path.join(MIDI_ROOT, name);

  // Defense in depth: ensure the resolved path never escapes MIDI_ROOT.
  if (path.relative(MIDI_ROOT, folderPath).startsWith('..')) {
    return res.status(400).json({ error: 'Invalid folder name' });
  }

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    var arr = [];
    arr.push(files);
    res.json(arr);
  });
});

export default router;
