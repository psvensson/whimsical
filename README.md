# whimsical

A client server space exploration game. The player starts on a planet in an unexplored star system.
The player has a number of resources that can be used to build different kinds of spacecraft, from probes to starships.It is similar in feeling to larger exploratopry games but smaller inscope. Not so many thingstochoose from. A hamster version maybe.
Spacecrafts can be sent toplanets within a star system and outside to other stars to build new bases and explore.

There willbe three levels of scale; 1) Galactic, which is a 2d grid of all visible star systems, 2) System, which is a 2d view of star, planets and other large objects within the syste, depicted as concentric orbits, withcurrent spacecraft courses plotted on top.
The planets will be randomly generated,a bit like StarGen-II but not so many properties. Eachplanet will have a number of resources that can be mined, if a mining ship is sent to it. One planet in the players starting system must be earth-like and it is here the player has its first base.

The client will be HTML/CSS with less.js for any ES6 JS logic needed.

The server will be node.js > 20.0 ES6, no build systems, no types, just basic libraries for http APIs, CORS and Postgress ORM. 

The server cansupport multiple players, which will get random player names,created in the DB on connection and removed on disconnect (unless changing names, then they're permanent). Allplayersplay in the same initially generated galaxy, but with their own starting star system.

The should be a docker-compose file which can serve the front-end using npx http-server in a separate Docekr container, build a Docker container of the server and start a PostgreSQL instance, thenconnect client server and DB properly.

The server should have proper tests for all functionality and tests should spin up a new clean DB for each test run.


