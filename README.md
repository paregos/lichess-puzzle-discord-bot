# ♟️ Lichess-Discord-Bot 💻

## About

- This is a discord bot that posts chess puzzles from lichess in an interactive manner.

- This bot is currently hosted on my raspberry pi and you can add it to your discord server [here](https://discord.com/api/oauth2/authorize?client_id=711480594629918772&permissions=522240&scope=bot)

![Lichess-Discord-Bot sending a puzzle to a discord channel](https://github.com/paregos/lichess-puzzle-discord-bot/raw/master/img/bot.png "Lichess-Discord-Bot sending a puzzle to a discord channel")

## Tech stack & improvements

- The application is currently written in typescript with a sqlite3 database and is currently running in docker containers on a raspberry pi 3, any improvements are welcome, just make a PR. If you encounter any issues also feel free to make a issue here on github.

## Technical details

- !puzzle grabs a random lichess puzzle between ids 1-120000
- Each running instance of this bot (currently just my own) will at most make one request per puzzle to the lichess servers in an attempt to not be annoying and spammy, if you delete the sqlite3 db you'll need to make additional requests for puzzles you've already served before.
- More to come...

## Commands
- `!puzzle`
- `!move a1a2`
- `!help`

## How to Run

#### Docker

**Warning** The current base images are design for ARM based processor architectures e.g raspberry pis, if you are planning on running this project on another processor architecture you have two options

1. Update the base image of the Dockerfile in this repository e.g change the line `FROM node:13.14-buster as compiler` and create your own lila-gif docker image that uses a different base image (or you can bug me and I'll make one)
2. Don't run this project in docker and instead follow the Non-Docker steps

###### Docker steps

- Make sure you have docker and docker-compose https://docs.docker.com/get-docker/
- Clone this repository
- Create a `.env` file by copying the `.env.sample` file
- Fill in discord bot token with your own discord application key, and set `LILA_HOST=lilagif` as we have lila-gif in a container
- Build a local docker image for the discord bot via `docker build -t lichess-bot .`
- Run the discord bot and lila-gif server via `docker-compose up --build`

**Note** - if you plan on altering any files you will need to rebuild your local docker image via `docker build -t lichess-bot .` and then bring up the containers again to see any changes

#### Non-Docker

- Make sure you have typescript https://www.typescriptlang.org/
- Clone this repository
- Create a `.env` file by copying the `.env.sample` file
- Fill in discord bot token with your own discord application key, and set `LILA_HOST=localhost`
- Run `npm install`
- Run `nodemon`, this starts the discord bot service and will reload the service when any .ts file has been changed
- Clone the lila-gif repository https://github.com/niklasf/lila-gif
- Make sure you have rust https://www.rust-lang.org/tools/install
- Run `cargo build`
- Run `cargo run`

## Contact

If you have any issues or questions feel free to contact me at the following

- https://twitter.com/paregos_ben
- https://twitch.tv/paregos
