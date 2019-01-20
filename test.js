const encode = require('./encode');
const fs = require('fs');

const mp3FileStream = fs.createWriteStream('/tmp/test-encode.mp3');

encode.encodeMp3ToStream('test/test.wav', mp3FileStream);
