const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

ffmpeg.setFfmpegPath(ffmpegPath);

function encodeMp3Command(srcPath) {
  return ffmpeg(srcPath)
      .withAudioChannels(2)
      .withAudioFrequency(44100)
      .withAudioBitrate(320)
      .withOutputFormat('mp3')
      .on('start', (commandLine) => {
        //console.log('ffmpeg conversion start: ', commandLine);
      })
      .on('progress', function(progress) {
        //console.log('Processing: ' + progress.percent + '% done');
      })
      .on('stderr', function(stderrLine) {
        //console.log('Stderr output: ' + stderrLine);
      })
      .on('codecData', function(data) {
        //console.log('Input is ' + data.audio + ' audio ' + 'with ' + data.video + ' video');
      })
      .on('end', () => {
        console.log('ffmpeg file has been locally converted successfully!...');
      })
      .on('error', (error) => {
        console.log('ffmpeg Error: ', error);
      });
};

exports.encodeMp3ToStream = function encodeMp3ToStream(srcPath, toStream) {
  encodeMp3Command(srcPath)
      .pipe(toStream, {
        end: true,
      });
};
