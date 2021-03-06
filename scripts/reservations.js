const https = require('https');
const Papa = require('papaparse');
const fs = require("fs");

const tabName = "Formulärsvar 1";
const dataFileURL = `https://docs.google.com/a/google.com/spreadsheets/d/1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
const playersApiURL = 'https://hubbe.myddns.me/Api/Players';

const players = {};
let playerList = [];

const addReservation = ([
    date,
    playerNameRaw,
    slot100,
    slot90,
    slot80,
    slot70,
    slot65,
    slot60,
    slot55,
    slot54,
    slot53,
    slot52,
]) => {
    const playerName = playerNameRaw.substr(0, 1).toUpperCase() + playerNameRaw.substr(1).toLowerCase();
    if (!(playerName in playerList)) {
        console.log("Invalid player", playerName);
        return;
    }
    if (!(playerName in players)) {
        players[playerName] = [];
    }

    players[playerName].push({
        date,
        "character": playerName,
        "100_score": slot100,
        "90_score": slot90,
        "80_score": slot80,
        "70_score": slot70,
        "65_score": slot65,
        "60_score": slot60,
        "55_score": slot55,
        "54_score": slot54,
        "53_score": slot53,
        "52_score": slot52,
    })

    players[playerName].sort((a, b) => a.date > b.date);
};

// const playerData = fs.readFileSync("../src/data/players.json", { encoding: "utf8" });
// const playerList = JSON.parse(playerData).reduce((result, player) => {
//     result[player.name] = true;
//     return result;
// }, {});

const reservationData = fs.readFileSync("../src/data/aq40_reservation.json", { encoding: "utf8" });
const reservations = JSON.parse(reservationData);

const updateDataFile = (players) => {
    Object.keys(players).forEach(playerName => {
        const newRes = players[playerName][players[playerName].length - 1];
        if (!newRes) {
            console.log(players[playerName]);
        }
        let hasOldRes = false;

        for (const i in reservations) {
            if (reservations[i].character === playerName) {
                hasOldRes = true;
                const oldRes = reservations[i];
                if (newRes.date > oldRes.date) {
                    oldRes.date = newRes.date;
                    [100, 90, 80, 70, 65, 60, 55, 54, 53, 52].forEach((score) => {
                        const key = `${score}_score`;
                        if (newRes[key]) {
                            oldRes[key] = newRes[key];
                        }
                    })
                }
                break;
            }
        }
        if (!hasOldRes) {
            reservations.push(newRes);
        }
    });
    fs.writeFile("../src/data/aq40_reservation.json", JSON.stringify(reservations, null, 2), err => {
        if (err) throw err;
        console.log('Wrote to file', "../src/data/aq40_reservation.json")
    })
};

const getReservations = () => https.get(dataFileURL, (response) => {
    let str = "";

    response.on("data", (chunk) => {
        str += chunk;
    });

    response.on("end", () => {
        Papa.parse(str, {
            complete: ({ data, errors, meta }) => {
                data.forEach((row, index) => {
                    if (index) {
                        addReservation(row)
                    }
                });

                fs.writeFile('reservations.json', JSON.stringify(players, null, 2), err => {
                    if (err) throw err;
                    console.log('Wrote to file', 'reservations.json')

                    updateDataFile(players);
                })
            }
        })
    });
});

https.get(playersApiURL, (response) => {
    let str = "";

    response.on("data", (chunk) => {
        str += chunk;
    });

    response.on("end", () => {
        const ranks = ['Guild Master', 'Officer', 'Member', 'Initiate'];
        playerList = JSON.parse(str)
            .filter(player => ranks.includes(player.guildRank))
            .reduce((result, player) => {
                result[player.name] = true;
                return result;
            }, {});
        getReservations();
    });
});
