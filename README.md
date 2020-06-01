# Express server sent event

Simple Express project which use authentication middleware based on JWT and implements Server-sent event. This project is a example to illustrate my post in my [blog](https://www.codeheroes.fr).

## Getting Started

#### Clone the repo :

```bash
git clone https://github.com/arkerone/express-server-sent-event.git
cd express-server-sent-event
```

#### Install dependencies:

```bash
npm install
```

#### Set environment variables:

Create the .env file :

```bash
cp .env.example .env
```

And set the environment variables :

```
HOST='localhost'                    # Server host
PORT=9001                           # Server port
CERTIFICATE=''                      # Path of the certificate (by default is the folder certificate)
PRIVATE_KEY=''                      # Path of the private key (by default is the folder certificate)
ACCESS_TOKEN_TYPE='Bearer'          # Token type
ACCESS_TOKEN_ALGORITHM='HS256'      # Algorithm used to create the JWT signature
ACCESS_TOKEN_SECRET=''              # Secret used to create the JWT signature
ACCESS_TOKEN_EXPIRES_IN=3600000     # Access token expiration in millisecond
REFRESH_TOKEN_EXPIRES_IN=2592000000 # Refresh token expiration in millisecond
ACCESS_TOKEN_AUDIENCE=''            # Audience claim of the JWT
ACCESS_TOKEN_ISSUER=''              # Issuer claim of the JWT
STREAM_TOKEN_EXPIRES_IN=''          # Stream token expiration in millisecond
DB_NAME=''                          # Name of the database
DB_USERNAME=''                      # Username of the database
DB_PASSWORD=''                      # Password of the database
DB_HOST=''                          # Host of the database
DB_PORT=                            # Port of the database
DB_DIALECT=''                       # Dialect of the database ('mysql', 'mariadb' or 'postgres')
LOG_PATH=''                         # Path of the logs (by default is the logs folder)
```

#### Create the database tables:

```bash
npm run sync
```

#### Create the demo user:

```bash
npm run seed
```

You can change it in `fixtures/demoUser.js`

#### Launch the server:

```bash
npm start
```

#### login route :

To get a JWT you must send a HTTP POST request on the route `/login` with the `'username'` and `'password'`.

##### Request :

```
POST /login
Content-Type: application/json
{
"username": "test",
"password": "test"
}
```

##### Response :

```
{
"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJEb2UiLCJpYXQiOjE1ODA0MTk3MzgsImV4cCI6MTU4NDAxOTczOCwiYXVkIjoidGVzdCIsImlzcyI6InRlc3QiLCJzdWIiOiIxIn0.TsNAqsUxL67mE4EwkwWx0sIcAnONMCRDdXOZmlNxqCA",
"tokenType": "Bearer",
"accessTokenExpiresIn": 3600000,
"refreshToken": "3zHL0Lgjy3gEL8S78yG+HrWGo5Httg7bUNDrrO2q1vVma9Azb5jE0Kg6BVET2i3rvzmV5MFpKbhKHsaD+FMcuq5AH4cxyn9cVzcOU07IqJOZ8vQ/GtZteWf+dZC7WwyTJA2pTeKftKIZA1j26nJ3vSXcBvnHTPbPsuaQNSOyveM=",
"refreshTokenExpiresIn": 2592000000
}
```

#### refresh token route :

To get a new JWT, in exchange of the refresh token, you must send a HTTP POST request on the route `/token` with the `'token'`.

##### Request :

```
POST /token
Content-Type: application/json
{
"token": "3zHL0Lgjy3gEL8S78yG+HrWGo5Httg7bUNDrrO2q1vVma9Azb5jE0Kg6BVET2i3rvzmV5MFpKbhKHsaD+FMcuq5AH4cxyn9cVzcOU07IqJOZ8vQ/GtZteWf+dZC7WwyTJA2pTeKftKIZA1j26nJ3vSXcBvnHTPbPsuaQNSOyveM="
}
```

##### Response :

```
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJEb2UiLCJpYXQiOjE1ODA0NjUzMDEsImV4cCI6MTU4NDA2NTMwMSwiYXVkIjoidGVzdCIsImlzcyI6InRlc3QiLCJzdWIiOiIxIn0.kHydxVWGZ0HBxzL68VCtS27W3CnPuFItZdmHm5a3ZI8",
  "tokenType": "Bearer",
  "accessTokenExpiresIn": 3600000,
  "refreshToken": "Nm63WORBZpX0xOpXHFcZdxFATNnsf2eOaOPmzl6jNFGD3n+svT4V+Po7iTV0E5Hi/LaedP8E4XEEXb1oahYzTPpnGBTM1d8s/etooCjprDoJ0LwLdeHZYs7ulK4yZOd4ELMWOeqGmoOLIJl15e0efrt3BezMxBlDSd3bxsnv6XQ=",
  "refreshTokenExpiresIn": 2592000000
}
```

#### Server-sent event route :

First you must get a stream token with the JWT, just send a HTTP POST request on the route `/stream/token` with the JWT in the header.

##### Request :

```
POST /stream/token
Authorization: Bearer xxx.yyy.zzz
```

##### Response :

```
{
  "streamToken": "41e1253d890ec00ce753803f393dd1cd8994396d40a09011fc411ef43e342151a9fb0cc08e1d5476fa023949e850a938e563562c4bc87f4205b99d832d4ee455",
  "expiresIn": 300000
}
```

Then you can connect with the client on the route `/stream/live/:token` with the `streamToken` in URL params using the EventSource objet :

```
const eventSource = new EventSource(
'http://localhost:8080/stream/live/41e1253d890ec00ce753803f393dd1cd8994396d40a09011fc411ef43e342151a9fb0cc08e1d5476fa023949e850a938e563562c4bc87f4205b99d832d4ee455'
);
```
