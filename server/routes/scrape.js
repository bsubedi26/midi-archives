import express from 'express';
var axios = require('axios');
var cheerio = require('cheerio');
const path = require('path');
var fs = require('fs');
var ytdl = require('ytdl-core');

let router = express.Router();

router.get('/test', (req,res) => {
 
  // var audio = ytdl('http://www.youtube.com/watch?v=A02s8omM_hI', {filter: 'audioonly'})
    // .pipe(fs.createWriteStream(path.join(__dirname,'../../public/videos/test.mp3')));

  var audio = ytdl('http://www.youtube.com/watch?v=A02s8omM_hI', {filter: 'audioonly'})
    .pipe(res);





})

router.get('/get', (req, res) => {

  axios
    .get('https://www.reddit.com/r/HotSamples/', {
      headers: {
        'User-Agent': 'request'
      }
    })
    .then(function(response) {
  var html = response.data;
  var results = [];
  var $ = cheerio.load(html);
    $(".thing").each(function(i, element) {

      // if statement to retrieve only the youtube links
      if ( $(this).find("a.title").attr('href').indexOf('youtube') !== -1 ) {
        var title = $(this).find("a.title").text().trim();
        var link = $(this).find("a.title").attr('href');
        link = link.replace("watch?v=", "v/");

        results.push({
          title: title,
          link: link
        })

      }

    })
    res.json(results);
    })
    .catch(function(err) {
      throw err;
    });
});

export default router;
