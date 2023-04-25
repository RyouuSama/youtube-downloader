# Youtube Downloader

Youtube Downloader is a command line application for downloading videos and audios from YouTube in different qualities and formats.

## Features

- Download videos in different qualities and formats.
- Download high quality audio.
- Displays a progress bar during download.
- Supports downloading multiple videos at once.

## Installation

1. Clone the repository and navigate to the project folder:

```sh
git clone https://github.com/yourusername/youtube-downloader.git
cd youtube-downloader 
```

## Install dependencies:

```
npm install
```

## Use

```
node app.js
```
The application will ask you to enter one or more YouTube links separated by commas. It will then display a list of available formats. Select the desired format and the application will download the video or audio.

## Example

```
Enter one or more YouTube links separated by commas: https://www.youtube.com/watch?v=dQw4w9WgXcQ
1. 144p - webm
2. 240p - webm
3. 360p - webm
4. 480p - webm
5. 720p - webm
6. 1080p - webm
Selecciona la calidad/resolución para descargar: 3
Descargando video en 360p...
Video descargado con éxito en "video-360p.webm"
```

## Licence

This project is licensed under the MIT licence. See the LICENSE file for more information.


