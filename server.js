const Discord = require('discord.js');
const BoardGifGenerator = require('./BoardGifGenerator.js');

const client = new Discord.Client();

const token = process.env.DISCORD_LICHESS_TOKEN;

const gifGenerator = new BoardGifGenerator("6175");

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {

    if (message.content === '!help') {
        message.channel.send("help todo");
    }
    else if (message.content === '!p') {
        console.log("in here");
        gifGenerator.getGif("3r1bk1/p2B1pp1/1pp5/3b2qp/P1pP3B/2P2P2/5QPP/4R1K1", "a8d8");
    }
    else if (message.content === 'ping') {
        message.channel.send('pong');
    }
});
client.login(token);