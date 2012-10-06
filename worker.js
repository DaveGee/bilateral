
function Worker(id) {

    this.Id = id;
    this.Related = [];
    this.NbRelated = 0;

    this._relatedToBuddy = false;
}

Worker.prototype.isMyBuddy = function() { return this.Id == 1002; }
Worker.prototype.isRelatedToMyBuddy = function() { return this._relatedToBuddy; }

Worker.prototype.addCoWorker = function(worker) {
    // do not need to test if exists yet, the input is trustable in this case
    this.Related[worker.Id] = worker;
    this.NbRelated ++;
    if(worker.isMyBuddy()) this._relatedToBuddy = true;
}

Worker.prototype.cleanRelated = function(id) {
    if(this.Related[id] !== undefined) {
        delete this.Related[id];
        this.NbRelated--;
    }
}

Worker.prototype.toString = function() {
    var str = "";
    this.Related.forEach(function(val, index, arr) {
        str += val.Id + " ";
    });
    return this.Id + " ("+this.isMyBuddy()+", " + this.NbRelated + "): " + str;
}

module.exports.Worker = Worker;

module.exports.printWorkers = function(arr) {
     arr.forEach(function(worker, index, arr) {
         console.log(worker.toString());
     });
    console.log("EOW\n")
}