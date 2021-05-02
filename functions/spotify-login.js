var querystring = require('querystring');

var redirect_uri = `${process.env.BASE_URL}/.netlify/functions/spotify-callback`; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
 var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

var stateKey = 'spotify_auth_state';

exports.handler = async function(event, context) {
    console.log(context);
  
    const state = generateRandomString(16);
    const cookie = `${stateKey}=${state}`;

    // your application requests authorization
    const scope = 'user-read-private user-read-email';

    const location = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: process.env.SPOTIFY_CLIENT_ID,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state
        });
    
    const response = {
        statusCode: 301,
        headers: {
            Location: location,
            "Set-Cookie": cookie
        }
    };
    
    return response;
}

