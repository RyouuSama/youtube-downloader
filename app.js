const ytdl = require('ytdl-core');
const readline = require('readline');
const fs = require('fs');
const ffmpegStatic = require('ffmpeg-static');
const { spawn } = require('child_process');

class YoutubeDownloader {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async start() {
    this.rl.question('Enter YouTube link: ', async (url) => {
      if (!ytdl.validateURL(url)) {
        console.log('Invalid URL. Please enter a valid YouTube URL.');
        this.rl.close();
        return;
      }

      try {
        const info = await ytdl.getInfo(url);
        const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
        formats.forEach((format, index) => {
          console.log(`(${index + 1}) ${format.qualityLabel} - ${format.container}`);
        });
        console.log('(3) High quality audio - mp3');

        this.rl.question('Select the quality/resolution to download (MP3 for audio only): ', async (choice) => {
          if (choice.toUpperCase() === '3') {
            await this.downloadAsMp3(url, info);
          } else {
            const formatIndex = parseInt(choice) - 1;
            if (formatIndex < 0 || formatIndex >= formats.length) {
              console.log('Invalid selection. Aborting.');
              this.rl.close();
              return;
            }

            const format = formats[formatIndex];
            const outputPath = `video-${format.qualityLabel}.${format.container}`;

            console.log(`Descargando video en ${format.qualityLabel}...`);
            ytdl(url, { format: format })
              .pipe(fs.createWriteStream(outputPath))
              .on('finish', () => {
                console.log(`Video descargado con éxito en "${outputPath}"`);
                this.rl.close();
              });
          }
        });
      } catch (error) {
        console.error('Error getting information from the video:', error);
        this.rl.close();
      }
    });
  }

  async downloadAsMp3(url, info) {
    const outputPath = `audio-${info.videoDetails.title.replace(/[^a-zA-Z0-9\s]/g, '')}.mp3`;
    const audioFormat = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });

    if (!audioFormat) {
      console.error('Audio format not found.');
      return;
    }

    console.log('Downloading in MP3 format...');

    const stream = ytdl(url, { format: audioFormat });
    const ffmpegProcess = spawn(ffmpegStatic, [
      '-i', 'pipe:3',
      '-vn',
      '-f', 'mp3',
      '-ab', '192k',
      'pipe:4',
    ], {
      windowsHide: true,
      stdio: [
        /* Standard: stdin, stdout, stderr */
        'inherit', 'inherit', 'inherit',
        /* Custom: pipe:3, pipe:4 */
        'pipe', 'pipe',
      ],
    });

    stream.pipe(ffmpegProcess.stdio[3]);
    ffmpegProcess.stdio[4].pipe(fs.createWriteStream(outputPath)).on('finish', () => {
      console.log(`Audio descargado con éxito en "${outputPath}"`);
      this.rl.close();
    });
  }
}

const downloader = new YoutubeDownloader();
downloader.start();
