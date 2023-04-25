
# Youtube Downloader

A command line application for downloading videos and audios from YouTube in different qualities and formats.

## Installation

Clone the repository and navigate to the project folder:

```sh
git clone https://github.com/yourusername/youtube-downloader.git
cd youtube-downloader
```
## Install dependencies:
```
npm install
```
## Usage
Run the application:
```
node app.js
```

The application will ask you to enter a YouTube link and then display a list of available formats. Select the desired format and the app will download the video or audio.

## Example
```
Enter YouTube link: https://www.youtube.com/watch?v=dQw4w9WgXcQ
1. 144p - webm
2. 240p - webm
3. 360p - webm
4. 480p - webm
5. 720p - webm
6. 1080p - webm
(7) High quality audio - mp3
Select quality/resolution for download (MP3 for audio only): 3
Downloading video in 360p 360p...
Video successfully downloaded in "video-360p.webm"
```