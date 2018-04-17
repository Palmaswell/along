const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const fetch = require('node-fetch');
const Headers = require('node-fetch').Headers;
const http = require('http');
const next = require('next');
const { parse, URLSearchParams } = require('url');

/**
 * Code from Spotify https://github.com/spotify/web-api-auth-examples
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
  const redirectUri = `http://0.0.0.0:${NEXT_PORT}/callback`;

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
        res.cookie('tokens', {
          access: json.access_token,
          refresh: json.refresh_token,
          expiration: json.expires_in
        })
        if (res.cookies) {
          console.log(`> 🍪 Cookies: ${JSON.stringify(res.cookies)}`);
        }
        nextApp.render(req, res, '/callback', req.query);
      });
    }
  })

  /**
   * Refresh the access token
   * @return {void}
   */
  app.get('/refresh_token', (req, res) => {
    res.redirect('/');
    if (req.cookies) {
      console.log(`> 🍪 : ${JSON.stringify(req.cookies)}`);
    }
    const searchParamsOptions = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: req.cookies.refresh_token
    });
    const headers = new Headers({
      'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT}:${SPOTIFY_SEC}`).toString('base64')}`
    });
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: searchParamsOptions,
      headers: headers
    }).then(response => {
      if (response.status === 200 && response.ok) {
        console.log(`>  Refresh fetch status Code: ${response.status}`);
        return response.json();
      } else {
        console.log(`> 💥 Status Code: ${response.statusCode}`)
      }
    })
    .then(json => {
      res.send({
        'access_token': json.access_token
      });
      res.redirect('/');
    })
  });

  app.get('/user/:id', (req, res) => {
    const queryParams = { id: req.params.id }
    nextApp.render(req, res, '/playlists', queryParams);
  });

  app.get('/playlist/:id/:play_id', (req, res) => {
    const queryParams = {
      id: req.params.id,
      playListId: req.params.play_id
    }
    nextApp.render(req, res, '/playlist', queryParams);
  });

  app.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    handle(req, res, parsedUrl);
  });

  server.listen(NEXT_PORT, '0.0.0.0', err => {
    if (err) {
      console.log(`> ▲ Next Js server error ${err}`);
    }
    console.log(`
    > ▲ Next Js server is running
    > ▲ Server started on port:  ${server.address().port}
    `);
  })
})
