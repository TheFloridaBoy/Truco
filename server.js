const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);
let players = [];
var readTheFile = true;
var fs = require("fs");
var fileContent = "";

const cardDeck = ['01o', '02o', '03o', '04o', '05o', '06o', '07o', '10o', '11o', '12o', '01c', '02c', '03c', '04c', '05c', '06c', '07c', '10c', '11c', '12c', '01e', '02e', '03e', '04e', '05e', '06e', '07e', '10e', '11e', '12e', '01b', '02b', '03b', '04b', '05b', '06b', '07b', '10b', '11b', '12b'];
//console.log(cardDeck);

shuffle(cardDeck);

//console.log('*******************************');
//console.log(cardDeck);

//const shuffledCardDeck = this.Phaser.ArrayUtils.shuffle(cardDeck);


io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    players.push(socket.id);

    console.log('Players ' + players.length);

    if (players.length === 1) {
        io.emit('isPlayerA');
    };

    if (players.length === 2) {
        io.emit('isPlayerB');
    };

    if (players.length === 3) {
        io.emit('isPlayerC');
    };

    if (players.length === 4) {
        io.emit('isPlayerD');
    };


    socket.on('dealCards', function () {
        //io.emit('setPlayerNumber');
        shuffle(cardDeck);
        //console.log('*******************************');
        //console.log(cardDeck);
        io.emit('getDeck', cardDeck);
        io.emit('dealCards');
    });

    socket.on('mostrarFlor', function (jugadorMostrando, primeraCarta) {
        //io.emit('setPlayerNumber');
        //shuffle(cardDeck);
        //console.log('*******************************');
        //console.log(cardDeck);
        io.emit('mostrarFlor', jugadorMostrando, primeraCarta);
        //io.emit('dealCards');
    });

    socket.on('updateScore', function (joseScore, miguelScore, playerChangedScore) {
        //io.emit('setPlayerNumber');
        //shuffle(cardDeck);
        //console.log('*******************************');
        //console.log(cardDeck);
        io.emit('updateScore', joseScore, miguelScore, playerChangedScore);
        //io.emit('dealCards');
    });

    socket.on('cardPlayed', function (gameObject, isPlayerA, isPlayerB, isPlayerC, isPlayerD) {
        io.emit('cardPlayed', gameObject, isPlayerA, isPlayerB, isPlayerC, isPlayerD);
    });

    socket.on('voltearCartaJugada', function (jugadorVolteandoCarta, cartaVolteada, numeroCartaVolteada) {
        io.emit('voltearCartaJugada', jugadorVolteandoCarta, cartaVolteada, numeroCartaVolteada);
    });

    socket.on('destroyCards', function (playerDestroyedCards) {
        shuffle(cardDeck);
        io.emit('getDeck', cardDeck);
        io.emit('destroyCards', playerDestroyedCards);
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });



    socket.on('updateFile', function (string2Bsaved) {
        console.log('Saving: ' + string2Bsaved);
        fs.writeFile('file.txt', string2Bsaved, function (err) {
            console.log("Data written successfully!");
        });
        fileContent = string2Bsaved;
        io.emit('displayRecord', string2Bsaved);
    });


    socket.on('readStats', function () {
        //console.log("readStats");
        if (fileContent == "") {
            console.log("reading");
            fs.readFile('file.txt', function (err, data) {
                console.log("opening");
                if (err) {
                    console.log("error");
                    return console.error(err);
                }
                console.log("Asynchronous read: " + data.toString());
                fileContent = data.toString();
                //valuesRecords = fileContent.split(',');
            });

            //readTheFile = false;
        }
        io.emit('displayRecord', fileContent);
    });



});

//http.listen(3000, function () {

http.listen(process.env.PORT || 3000, function () {
    console.log('Server started!');
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//server.use(serveStatic("client/"));