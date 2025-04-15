const CLIENT_ID =
  "772190012442-peous61g4t8so3r9rt6gb6eb60gpu26i.apps.googleusercontent.com";
const REDIRECT_URI = encodeURIComponent(
  "http://localhost:3000/oauth/google/callback"
);
const RESPONSE_TYPE = "code";
const SCOPE = encodeURIComponent("openid profile email");

export const OAUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
