var http = require('http');

class BoardGifGenerator {

    constructor(lilaPort) {
        this.lilaPort = lilaPort;
    }

    getGif(fen, lastmove) {

        const options = {
            hostname: 'localhost',
            port: this.lilaPort,
            path: '/image.gif?fen=' + fen + '&lastMove=' + lastmove,
            method: 'GET'
        }

        const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)

            res.on('data', d => {
                console.log("Got data");
                process.stdout.write(d)
            })
        })

        req.on('error', error => {
            console.error(error)
        })

        req.end()
    }

}

module.exports = BoardGifGenerator;