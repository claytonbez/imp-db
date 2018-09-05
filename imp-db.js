//---------------------------------------------------------------------
// imp-db 
//---------------------------------------------------------------------
var fs = require('fs');
var __self;
class impDB {
    constructor(filename, saveOnSet, saveInterval) {
        this.db = {};
        if (filename) {
            this.filename = filename;
            this.saveOnSet = saveOnSet;
            this.saveInterval = saveInterval;
            var exists = fs.existsSync(filename);
            if (exists) {
                this.readAndSetDbFile();
            }
            if (!this.saveOnSet) {
                this.startSaveInterval();
            }
            __self = this;
        }
    }
    clear() {
        this.db = {};
        if (this.saveOnSet) {
            this.save();
        }
        return;
    }
    readAndSetDbFile() {
        fs.readFile(this.filename, 'utf8', function (err, data) {
            this.db = JSON.parse(data);
        });
    }
    save() {
        fs.writeFile(this.filename, JSON.stringify(this.db), function (err) {
            if (err) {
                throw err
            }
            return;
        });
    }
    startSaveInterval() {
        this.intervalProcess = setInterval(function () {
            __self.save();
        }, this.saveInterval);
    }
    set(key, val) {
        this.db[key] = val;
        if (this.saveOnSet) {
            this.save();
        }
        return;
    }
    
    setAsync(key, val, callback) {
        this.db[key] = val;
        if (this.saveOnSet) {
            try {
                this.save();
            } catch (err) {
                callback(err, false);
            }

        }
        callback(null, true);
    }
    
    get(key) {
        return this.db[key];
    }
    getArrayPos(key, pos) {
        return this.db[key][pos];
    }
    getAsync(key, callback) {
        callback(this.db[key]);
    }
 
    exists(key, callback) {
        if (key in this.db) {
            callback(true);
        } else {
            callback(false);
        }
    }
    remove(key,callback){
        delete(this.db[key]);
        callback(true);
    }
    pushArray(key, val) {

        this.db[key].push(val);
        if (this.saveOnSet) {
            this.save();
        }
        return;
    }
    cutFirstArray(key) {
        delete (this.db[key][0])
        if (this.saveOnSet) {
            this.save();
        }
        return;
    }
    spliceArray(key, pos) {
        this.db[key].splice(pos, 1);
    }
    setArrayPos(key, pos, val) {
        this.db[key][pos] = val;
        if (this.saveOnSet) {
            this.save();
        }
        return;
    }
    setArrayPosAsync(key, pos, val, callback) {
        this.db[key][pos] = val;
        if (this.saveOnSet) {
            try {
                this.save();
            } catch (err) {
                callback(err, false);
            }

        }
        callback(null, true);
    }
    getArrayPosAsync(key, pos, callback) {
        callback(this.db[key][pos]);
    }
    findArrayIndex(key,val){
        var data = this.db[key];
        var index = data.indexOf(val);
        return index;
    }

}
module.exports = impDB;