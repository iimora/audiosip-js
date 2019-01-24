"use strict";

const Busboy = require('busboy');
const cors = require('cors')({ origin: true });
const encode = require('./encode');
const fs = require("fs");

exports.convertMp3 = function(req, res) {
  try {
    // Implementing CORS on received request & responce Object 
    cors(req, res, () => {});
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the Caller to include cookies in the requests which 
    // sent to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      res.status(204).send('');
      return;
    }

    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const tmpMp3Path = '/tmp/test-encode.mp3';
      const mp3FileStream = fs.createWriteStream(tmpMp3Path);

      mp3FileStream.on('finish', () => {
        const fileStat = fs.statSync(tmpMp3Path);

        res.writeHead(200, {
          'Content-Type': 'audio/mpeg',
          'Content-Length': fileStat.size
        });
        const mp3ReadStream = fs.createReadStream(tmpMp3Path);
        mp3ReadStream.pipe(res);
      });

      encode.encodeMp3ToStream(file, mp3FileStream);
    });

    busboy.end(req.rawBody)
  } catch (error) {
    console.error("Error: ", error);
    // send back the reponse 
    res.status(417).send(`{"Main Error": "${error}"}`);
  }
}
