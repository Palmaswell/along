# Along
> 🎙 Your Spotify playlists with voice interface.
> 🔬 Empathy, accessibility and the Web Speech Recognition API.

## Prerequisites
* Dependencies are maintained via `yarn`
* A local or cloud redis server `brew install redis`
* Spotify developer account

### Set your environment variables
Create a `.env` file and fill the following variables.
Remember not to push application sensitive information in your repo.

```
EXPRESS_PORT=3001
NEXT_PORT=1337
REDIS_HOST=xxxxxxxx
REDIS_PASS=xxxxxxxx
REDIS_PORT=xxxxxxxx
SPOTIFY_CLIENT=xxxxxxxx
SPOTIFY_SEC=xxxxxxxx
```

## Getting Started
```sh
git clone https://github.com/Palmaswell/along.git
cd along
yarn
yarn dev
```

## Command Reference

| Command       | Description
|:--------------|:-------------
| `build`       | Build NextJS App
| `start`       | Start application in production mode
| `dev`         | Start application in development mode
| `dev:off`     | Start application in dev mode with local redis server
| `server:next` | Start NextJS server separately
| `server:rx`   | Start RxJS Websockets server separately
| `server:off`  | Start RxJS Websockets server with local redis

