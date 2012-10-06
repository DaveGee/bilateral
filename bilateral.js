var company = require("./worker");

//console.log("Welcome in Bilateral");
//console.log("Is in a TTY: " + Boolean(process.stdout.isTTY));
//console.log("reading: " + process.argv[2]);

process.stdin.setEncoding("utf8");
process.stdin.resume();

var STOID = 1000;
var LONID = 2000;

var input = "";
var lastChunk = "";

var nbTeams = 0;
var teams = [];
var workers = [];
var london = [], stockholm = [];

var goingToBarbade = [];

process.stdin.on("data", function(data) {

    for(char in data) {

        input += data[char];

        if(data[char] == "\n") {
            if(nbTeams == 0) {
                nbTeams = lastChunk;
                lastChunk = "";
                continue;
            } else {
                teams.push(lastChunk);
                lastChunk = "";
                continue;
            }
        }

        lastChunk += data[char];
    }

    teams.push(lastChunk);

    if(teams.length == nbTeams) {
        process.stdin.pause();
        process.nextTick(function() {
            processTeams();
        });
    } else {
        throw Error("Team count error (expected: " + nbTeams + ", actual: " + teams.length + ")");
    }
});

function processTeams() {
    //console.log("found " + nbTeams + " teams");

    teams.forEach(function(val, index, arr) {
        var sto = val.split(" ")[0];
        var lon = val.split(" ")[1];

        if(!stockholm[sto - STOID]) {
            stockholm[sto - STOID] = new company.Worker(sto);
            workers.push(stockholm[sto - STOID]);
        }
        if(!london[lon - LONID]) {
            london[lon - LONID] = new company.Worker(lon);
            workers.push(london[lon - LONID]);
        }

        stockholm[sto - STOID].addCoWorker(london[lon - LONID]);
        london[lon - LONID].addCoWorker(stockholm[sto - STOID]);
    });

    process.nextTick(main);
}

function main() {

    while(workers.length > 0) {

        // sort array
        workers.sort(function(a, b) {
            //sort by Nb related desc, then by isMyBuddy, then by relatedToMyBuddy desc
            if(a.NbRelated == b.NbRelated) {
                if(a.isMyBuddy()) return -1;
                if(b.isMyBuddy()) return 1;

                if(a.isRelatedToMyBuddy() == b.isRelatedToMyBuddy()) return 0;
                if(a.isRelatedToMyBuddy()) return 1;
                return -1;
            }
            if(a.NbRelated > b.NbRelated) return -1;
            if(a.NbRelated < b.NbRelated) return 1;
        });

        //company.printWorkers(workers);

        var theId = workers[0].Id;
        goingToBarbade.push(theId);
        workers.splice(0,1);

        for(var i = 0; i < workers.length; ++i) {
            workers[i].cleanRelated(theId);
            if(workers[i].NbRelated == 0) workers.splice(i--, 1);
        };

        //company.printWorkers(workers);
    }

    console.log(goingToBarbade.length);
    console.log(goingToBarbade.join("\n"));
}