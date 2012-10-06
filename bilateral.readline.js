var Worker = require("./worker").Worker;
var readline = require("readline");

var STOID = 1000;
var LONID = 2000;

var lonWorkers = [];
var stoWorkers = [];

console.log("Welcome in Bilateral");

rl = readline.createInterface(process.stdin, process.stdout);

rl.on("line", function(line) {

    var nbTeams;
    var teams = [];

    // team
    if(line.contains(" ")) {
        processTeam(line);
        if(teams.length == nbTeams) {
            process.nextTick(main(teams))
        }
    } else {    // nbTeams
        nbTeams = line.trim();
    }
});


function processTeam(val) {

    var sto = val.split(" ")[0];
    var lon = val.split(" ")[1];

    if(!stoWorkers[sto - STOID]) stoWorkers[sto - STOID] = new Worker(sto, STOID);
    if(!lonWorkers[lon - LONID]) lonWorkers[lon - LONID] = new Worker(lon, LONID);

    stoWorkers[sto - STOID].addLinked(lonWorkers[lon - LONID]);
    lonWorkers[lon - LONID].addLinked(stoWorkers[sto - STOID]);
}

function main() {
    console.log("STO: " + stoWorkers);
    console.log("LON: " + lonWorkers);
}