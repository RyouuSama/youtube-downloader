const ytdl = require('ytdl-core');
const fs = require('fs');
const inquirer = require('inquirer');
const ProgressBar = require('progress');

class YoutubeDownloader {
  async start() {
    const { urls } = await inquirer.prompt([
      {
        type: 'input',
        name: 'urls',
        message: 'Enter one or more YouTube links separated by commas:',
      },
    ]);

    const urlList = urls.split(',').map(url => url.trim());

    for (const url of urlList) {
      if (!ytdl.validateURL(url)) {
        console.log(`Invalid URL: ${url}. Shall be omitted.`);
        continue;
      }

      try {
        const info = await ytdl.getInfo(url);
        const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
        const choices = formats.map((format, index) => ({
          name: `${format.qualityLabel} - ${format.container}`,
          value: index,
        }));

        const { choice } = await inquirer.prompt([
          {
            type: 'list',
            name: 'choice',
            message: 'Select quality/resolution to download:',
            choices: choices,
          },
        ]);

        const format = formats[choice];
        const outputPath = `video-${format.qualityLabel}.${format.container}`;

        console.log(`Downloading video at ${format.qualityLabel}...`);
        await this.downloadWithProgress(url, format, outputPath);
      } catch (error) {
        console.error('Error getting information from video:', error);
      }
    }

    console.log('All downloads have been completed.');
  }

  async downloadWithProgress(url, format, outputPath) {
    const stream = ytdl(url, { format: format });

    await this.streamWithProgress(stream, fs.createWriteStream(outputPath), format.contentLength);

    console.log(`Video successfully downloaded in "${outputPath}"`);
  }

  async streamWithProgress(inputStream, outputStream, totalBytesStr) {
    const totalBytes = parseInt(totalBytesStr);
  
    if (isNaN(totalBytes)) {
      console.log("The file size could not be determined. Download will continue without displaying the progress bar.");
      inputStream.pipe(outputStream);
      return new Promise((resolve, reject) => {
        outputStream.on('finish', resolve);
        outputStream.on('error', reject);
      });
    }
  
    const progressBar = new ProgressBar('[:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: totalBytes,
    });
  
    inputStream.on('data', chunk => {
      progressBar.tick(chunk.length);
    });
  
    inputStream.pipe(outputStream);
  
    return new Promise((resolve, reject) => {
      outputStream.on('finish', resolve);
      outputStream.on('error', reject);
    });
  }
}

const downloader = new YoutubeDownloader();
downloader.start();
