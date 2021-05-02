var stateKey = 'spotify_auth_state';

var fetch = require('node-fetch');

var redirect_uri = 'http://localhost:8889/.netlify/functions/spotify-callback'; // Your redirect uri

exports.handler = async function(event, context) {
    // your application requests refresh and access tokens
    // after checking the state parameter
  
    const code = event.queryStringParameters.code || null;
    const state = event.queryStringParameters.state || null;

    const headers = event.headers;
    const cookie = headers ? headers.cookie : null;
    let storedState = '';
    if (cookie) {
        const parts = cookie.split('=');
        if (parts.length === 2 && parts[0] === stateKey) {
            storedState = parts[1];
        }
    }

    if (state === null || state !== storedState) {
        return {
            statusCode: 400,
            body: `state mismatch - state: ${state}, stored state: ${storedState}`
        };
    }

    const body = {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    };

    const params = new URLSearchParams();
    params.append('code', code);
    params.append('redirect_uri', redirect_uri);
    params.append('grant_type', 'authorization_code');

    const response = await fetch('https://accounts.spotify.com/api/token', {
    	method: 'post',
    	body: params,
    	headers: {
            'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
        }
    });

    const data = await response.json();

    console.log(data);

    const access_token = data.access_token,
            refresh_token = data.refresh_token;

    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
    	method: 'get',
    	headers: { 
            'Authorization': 'Bearer ' + access_token,
            'Accept': 'application/json'
        }
    });

    const profileData = await profileResponse.json();

    console.log(profileData);
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            access_token: access_token,
            refresh_token: refresh_token
        })
    };
}