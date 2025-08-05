# whimsical

A client server space exploration game. The player starts on a planet in an unexplored star system.
The player has a number of resources that can be used to build different kinds of spacecraft, from probes to starships. It is similar in feeling to larger exploratory games but smaller in scope. Not so many things to choose from. A hamster version maybe.
Spacecraft can be sent to planets within a star system and outside to other stars to build new bases and explore.

There will be three levels of scale; 1) Galactic, which is a 2d grid of all visible star systems, 2) System, which is a 2d view of star, planets and other large objects within the system, depicted as concentric orbits, with current spacecraft courses plotted on top.
The planets will be randomly generated, a bit like StarGen-II but with fewer properties. Each planet will have a number of resources that can be mined if a mining ship is sent to it. One planet in the player's starting system must be earth-like, and it is here the player has its first base.

Stars, planets and moons are given names procedurally. Stars always receive unique names, while planets and moons usually take their parent's name followed by a Roman numeral, though occasionally they are assigned unique names of their own.

The client will be HTML/CSS with less.js for any ES6 JS logic needed.

The server will be Node.js > 20.0 ES6, no build systems, no types, just basic libraries for HTTP APIs, CORS and Postgres ORM.

The server can support multiple players, which will get random player names, created in the DB on connection and removed on disconnect (unless changing names, then they're permanent). All players play in the same initially generated galaxy but with their own starting star system.

There should be a docker-compose file which can serve the front-end using npx http-server in a separate Docker container, build a Docker container of the server and start a PostgreSQL instance, then connect client, server and DB properly.

The server should have proper tests for all functionality and tests should spin up a new clean DB for each test run.



## Client

A minimal client scaffold is available under `client/`. Open `client/index.html` in a browser to see the placeholder interface.

## Development

Run `npm install` and `npm test` from within the `client` directory:

```
cd client
npm install
npm test
```
