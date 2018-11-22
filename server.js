const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const fetch = require('node-fetch');
const Headers = require('node-fetch').Headers;
const http = require('http');
const next = require('next');
const { parse, URLSearchParams } = require('url');

/**
 * generateRandomString from Spotify
 * https://github.com/spotify/web-api-auth-examples
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = length => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const {
  NEXT_PORT,
  SPOTIFY_CLIENT,
  SPOTIFY_SEC
} = process.env;

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

/**
 * Prepare, start and handles the Express server
 * @return {void}
 */
nextApp.prepare().then(() => {
  const app = express().use(cookieParser());
  const server = http.createServer(app);

  // Spotify Authentification
  const stateKey = 'spotify_auth_state';
  const state = generateRandomString(16);
  const redirectUri = `http://localhost:${NEXT_PORT}/callback`;

  /**
   * User logs in and gives permission
   * @return {void}
   */
  app.get('/login', (req, res) => {
    const scope = 'user-read-private playlist-read-private playlist-read-collaborative user-read-playback-state user-modify-playback-state user-read-currently-playing';
    const loginParams = new URLSearchParams({
      response_type: 'code',
      client_id: `${SPOTIFY_CLIENT}`,
      scope: scope,
      redirect_uri: redirectUri,
      state: state
    });
    res.cookie('spotify_auth_state', state);

    res.redirect(`https://accounts.spotify.com/authorize?${loginParams}`);
    nextApp.render(req, res, '/login', req.query)
  })

  /**
   * Redirect and get access and refresh tokens
   * Set token as cookie.
   * @return {void}
   */
  app.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;

    if (state === null && state !== storedState) {
      const misParams =  new URLSearchParams({
        error: 'state_mismatch'
      })
      res.redirect(`/#${misParams}`)
    }
    else {
      res.clearCookie(stateKey, state);
      const searchParamsOptions = new URLSearchParams({
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      });
      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: new Headers({
          'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT}:${SPOTIFY_SEC}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        body: searchParamsOptions
      }).then(response => {
        if (response.status === 200 && response.ok) {
          console.log(`> ⏆ Token fetch status Code: ${response.status}`);
          return response.json();
        } else {
          console.log(`> 💥 Status Code: ${response.statusCode}`)
        }
      }).then(json => {
        res.cookie('access', json.access_token);
        res.cookie('refresh', json.refresh_token);
        res.cookie('expiration', json.expires_in);

        nextApp.render(req, res, '/callback', req.query);
      });
    }
  })

  app.get('/playlists/:id', (req, res) => {
    const queryParams = {
      id: req.params.id,
      lang: req.cookies.lang
    }
    res.cookie('user_id', req.params.id);
    nextApp.render(req, res, '/playlists', queryParams);
  });

  app.get('/tracks/:play_id', (req, res) => {
    const queryParams = {
      lang: req.cookies.lang,
      play_id: req.params.play_id
    };
    nextApp.render(req, res, '/tracks', queryParams);
  });

  app.get('/', (req, res) => {
    if (!req.cookies.access) {
      res.redirect('/login')
    }
    const queryParams = {
      lang: req.cookies.lang
    }
    nextApp.render(req, res, '/', queryParams);
  });

  app.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    handle(req, res, parsedUrl);
  });

  server.listen(NEXT_PORT, 'localhost', err => {
    if (err) {
      console.log(`> ▲ Next Js server error ${err}`);
    }
    console.log(`
    > ▲ Next Js server is running
    > ▲ Server started on port:  ${server.address().port}
    `);
  })
})
