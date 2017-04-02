/**
 * Created by marco on 27/02/17.
 */
/*
 * Adapted from node-mpd
 * @see https://www.npmjs.com/package/node-mpd
 */
function MPDJS() {

    var EventEmitter = require('events').EventEmitter;
    var Util = require("util");
    var Song = require("./song");

    if(!String.prototype.trim) {
        (function() {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function() {
                return this.replace(rtrim, '');
            };
        })();
    }

    if(!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        };
    }

    var MPD = function(obj) {
        this.port = obj.port ? obj.port : 6600;
        this.host = obj.host ? obj.host : "localhost";
        this._requests = [];
        this.status = {};
        this.server = {};
        this.playlist = [];
        this.songs = [];
        this.buffer = "";
    };

    Util.inherits(MPD, EventEmitter);

    var onError = function (errorMessage) {
        console.log("Error occured, error: " + errorMessage);
    };

    var onClose = function (hasError) {
        console.log("Socket closed, hasErrors=" + hasError);
    };

    const parseReceivedData = function(data) {
        var chars = new Array(data.length);
        for (var i = 0; i < data.length; i++) {
            chars.push(String.fromCharCode(data[i]));
        }
        return chars.join("");
    };


    /**
     * playback
     */

    MPD.prototype.play = function(callback) {
        this._sendCommand("play", function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.playAt = function(pos, callback) {
        this._sendCommand("play "+pos, function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.pause = function(callback) {
        this._sendCommand("pause", function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.stop = function(callback) {
        this._sendCommand("stop", function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.next = function(callback) {
        this._sendCommand("next", function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.clear = function(callback) {
        this._sendCommand("clear", function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.prev = function(callback) {
        this._sendCommand("previous", function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.stop = function(callback) {
        this._sendCommand("stop", function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.toggle = function(callback) {
        this._sendCommand("toggle", function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.add = function(name, callback) {
        this._sendCommand("add", name, function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.delete = function(position, callback) {
        this._sendCommand("delete", position, function(r){
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.volume = function(vol, callback) {
        this._sendCommand("setvol", vol, function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.searchAdd = function(search, callback) {
        var args = ["searchadd"];;
        for(var key in search) {
            args.push(key);
            args.push(search[key]);
        }
        args.push(function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
        this._sendCommand.apply(this, args);
    };

    MPD.prototype.random = function(state, callback) {
        this._sendCommand("random "+state, function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.repeat = function(state, callback) {
        this._sendCommand("repeat "+state, function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype.seek = function(position, callback) {
        this._sendCommand("seekcur "+position, function(r) {
            this._answerCallbackError(r, callback);
        }.bind(this));
    };

    MPD.prototype._answerCallbackError = function(r, cb) {
        var err = this._checkReturn(r);
        if(cb) {
            cb(err);
        }
        else {
            if(err) {
                throw err;
            }
        }
    };

    /*
     * Connect and disconnect
     */

    MPD.prototype.connect = function(successCallback, errorCallback) {
        this.client = new Socket();
        this.commanding = true;
        this.client.onData = this._onConnectData.bind(this);
        this.client.onError = onError;
        this.client.onClose = onClose;
        this.client.open(
            this.host,
            this.port,
            function () {
                successCallback('connected on host '+this.host+' and port '+this.port);
            }.bind(this),
            function (errorMessage) {
                errorCallback("Error during connection, error: " + errorMessage)
            }.bind(this));
    };

    MPD.prototype.disconnect = function(success) {
        this.client.close(function () {

        }, function () {
            console.log("error disconnecting");
        });

    };

    /**
     * Function for first time connection
     * @param message
     * @private
     */
    MPD.prototype._onConnectData = function (message) {
        var dataString = parseReceivedData(message);
        this._initialGreeting(dataString);
    };

    /**
     * Function for everytime data is received
     * @param message
     * @private
     */
    MPD.prototype._onData = function(message) {
        var dataString = parseReceivedData(message);
        if (!dataString) {
            dataString = "";
        }
        dataString = dataString.trim();
        if (this.idling || this.commanding) {
            this.buffer += dataString;
            var index;
            if ((index = findReturn(this.buffer)) !== -1) { // We found a return mark
                var string = this.buffer.substring(0, index).trim();
                this.buffer = this.buffer.substring(index, this.buffer.length);
                //console.log("PARSED: " + string);
                //console.log("Message returned: " + string);
                if (this.idling) {
                    this._onMessage(string);
                }
                else if (this.commanding) {
                    //console.log("onData response for: \"" + message + "\"");
                    this._handleResponse(string);
                }
            }
            //else console.log("Doesn't have return: " + this.buffer);
        }
    };

    MPD.prototype.getList = function(type, callback){
        this._sendCommand("list", type, function(message){
            var songs = [];
            var lines = message.split("\n");
            switch (type) {
                case 'album':
                    lines.forEach(function(element) {
                        element = element.substr(7,element.length);
                        songs.push(element);
                    }, this);
                    break;
                case 'artist':
                    lines.forEach(function(element) {
                        element = element.substr(8,element.length);
                        songs.push(element);
                    }, this);
                    break;
                case 'genre':
                    lines.forEach(function(element) {
                        element = element.substr(7,element.length);
                        songs.push(element);
                    }, this);
                    break;
            }
            songs.pop();
            callback(songs);
        }.bind(this));
    };

    MPD.prototype.getSongs = function(callback) {

        this._sendCommand("listallinfo", function(message) {
            var songs = [];
            var lines = message.split("\n");
            var songLines = [];
            for(var i = 0; i < lines.length - 1; i++) {
                var line = lines[i];
                if(i !== 0 && line.startsWith("file:")) {
                    songs.push(Song.createFromInfoArray(songLines, this));
                    songLines = [];
                }
                songLines.push(line);
            }
            if(songLines.length !== 0) {
                songs.push(Song.createFromInfoArray(songLines, this));
            }
            var err = this._checkReturn(lines[lines.length - 1]);
            if(err) { throw err; }
            callback(songs);

        }.bind(this));
    };

    var createFromInfoArray = function(lines, mpd) {
        var info = {};
        for(var i = 0; i < lines.length; i++) {
            var keyValue = lines[i].split(":");
            if(keyValue.length < 2) {
                if(array[i] !== "OK") {
                    throw new Error("Unknown response while parsing song.");
                }
                else {
                    continue;
                }
            }
            var key = keyValue[0].trim();
            var value = keyValue[1].trim();
            switch(key) {
                case "file":
                    info.file = value;
                    break;
                case "Last-Modified":
                    info.lastModified = new Date(value);
                    break;
                case "Time":
                    info.time = value;
                    break;
                case "Artist":
                    info.artist = value;
                    break;
                case "Title":
                    info.title = value;
                    break;
                case "Track":
                    info.track = value;
                    break;
                case "Date":
                    info.date = value;
                    break;
                case "Genre":
                    info.genre = value;
                    break;
            }
        }
        return new Song(info, mpd);
    };

    /*
     * Not-so-toplevel methods
     */

    MPD.prototype._updatePlaylist = function(callback) {
        this._sendCommand("playlistinfo", function(message) {
            var lines = message.split("\n");
            this.playlist = [];
            var songLines = [];
            var pos;
            for(var i = 0; i < lines.length - 1; i++) {
                var line = lines[i];
                if(i !== 0 && line.startsWith("file:")) {
                    this.playlist[pos] = Song.createFromInfoArray(songLines, this);
                    songLines = [];
                    pos = -1;
                }
                if(line.startsWith("Pos")) {
                    pos = parseInt(line.split(":")[1].trim());
                }
                else {
                    songLines.push(line);
                }
            }
            if(songLines.length !== 0 && pos !== -1) {
                this.playlist[pos] = Song.createFromInfoArray(songLines, this);
            }
            var err = this._checkReturn(lines[lines.length - 1]);
            if(err) { throw err; }
            if(callback) {
                callback(this.playlist);
            }
        }.bind(this));
    };

    MPD.prototype._updateSongs = function(callback) {
        this._sendCommand("listallinfo", function(message) {
            var lines = message.split("\n");
            this.songs = [];
            var songLines = [];
            for(var i = 0; i < lines.length - 1; i++) {
                var line = lines[i];
                if(i !== 0 && line.startsWith("file:")) {
                    this.songs.push(createFromInfoArray(songLines, this));
                    songLines = [];
                }
                songLines.push(line);
            }
            if(songLines.length !== 0) {
                this.songs.push(createFromInfoArray(songLines, this));
            }
            var err = this._checkReturn(lines[lines.length - 1]);
            if(err) { throw err; }
            if(callback) {
                callback(this.songs);
            }
        }.bind(this));
    };

    MPD.prototype.updateStatus = function(callback) {
        this._sendCommand("status", function(message) {
            var array = message.split("\n");
            for(var i in array) {
                var keyValue = array[i].split(":");
                if(keyValue.length < 2) {
                    if(array[i] !== "OK") {
                        throw new Error("Unknown response while fetching status.");
                    }
                    else {
                        continue;
                    }
                }
                var key = keyValue[0].trim();
                var value = keyValue[1].trim();
                switch(key) {
                    case "volume":
                        this.status.volume = ((parseFloat(value.replace("%", "")) / 100))*100;
                        break;
                    case "repeat":
                        this.status.repeat = (value === "1");
                        break;
                    case "random":
                        this.status.random = (value === "1");
                        break;
                    case "single":
                        this.status.single = (value === "1");
                        break;
                    case "consume":
                        this.status.consume = (value === "1");
                        break;
                    case "playlistlength":
                        this.status.playlistlength = parseInt(value);
                        break;
                    case "state":
                        this.status.state = value;
                        break;
                    case "song":
                        this.status.song = parseInt(value);
                        break;
                    case "time":
                        this.status.time = {
                            elapsed : parseInt(keyValue[1]),
                            length : parseInt(keyValue[2])
                        };
                        break;
                    case "bitrate":
                        this.status.bitrate = parseInt(value);
                        break;
                }
            }
            if(callback) {
                callback(this.status, this.server);
            }
        }.bind(this));
    };

    /*
     *	finding songs by tags
     */
    MPD.prototype.findRequest = function(type, query, callback){
        if(!type || type =='')  type = 'any';
        this._sendCommand("search", type, query,  function(message) {
            var songs = [];
            var lines = message.split("\n");
            var songLines = [];
            for(var i = 0; i < lines.length - 1; i++) {
                var line = lines[i];
                if(i !== 0 && line.startsWith("file:")) {
                    songs.push(Song.createFromInfoArray(songLines, this));
                    songLines = [];
                }
                songLines.push(line);
            }
            if(songLines.length !== 0) {
                songs.push(Song.createFromInfoArray(songLines, this));
            }
            var err = this._checkReturn(lines[lines.length - 1]);
            if(err) { throw err; }
            callback(songs);
        }.bind(this));
    };

    /*
     * handling playlists
     */
    MPD.prototype.listOfPlaylists = function(callback){
        this._sendCommand("listplaylists", function(message){
            var playlists = [];
            var message = message.split("\n");
            message.forEach(function(element) {
                if(element.startsWith('playlist')){
                    element = element.substr(10,element.length);
                    playlists.push(element);
                }
            }, this);
            callback(playlists);
        }.bind(this));
    };
    MPD.prototype.playlistSongs = function(name, callback){
        this._sendCommand("listplaylistinfo ", name, function(message){
            var songs = [];
            var lines = message.split("\n");
            var songLines = [];
            for(var i = 0; i < lines.length - 1; i++) {
                var line = lines[i];
                if(i !== 0 && line.startsWith("file:")) {
                    songs.push(Song.createFromInfoArray(songLines, this));
                    songLines = [];
                }
                songLines.push(line);
            }
            if(songLines.length !== 0) {
                songs.push(Song.createFromInfoArray(songLines, this));
            }
            var err = this._checkReturn(lines[lines.length - 1]);
            if(err) { throw err; }
            callback(songs);
        }.bind(this));
    };
    MPD.prototype.newPlaylist = function(name, callback){
        this._sendCommand("save", name, function(message) {
            this._sendCommand("playlistclear ", name, function(message){
                console.log(message);
            }.bind(this));
            callback(message);
        }.bind(this));
    };
    MPD.prototype.addToPlaylist = function(name, uri, callback){
        this._sendCommand("playlistadd ", name, uri, function(message) {
            console.log(message);
            callback(message);
        }.bind(this));
    };
    MPD.prototype.deleteFromPlaylist = function(name, pos, callback){
        this._sendCommand("playlistdelete",name, pos, function(message) {
            callback(message);
        }.bind(this));
    };
    MPD.prototype.removePlayList = function(name, callback){
        this._sendCommand("rm", name, function(message) {
            callback(message);
        }.bind(this));
    };
    MPD.prototype.loadPlaylist = function(name, callback){
        this._sendCommand("load",name, function(message) {
            callback(message);
        }.bind(this));
    };

    /*
     * Idle handling
     */
    MPD.prototype._onMessage = function(message) {
        var match;
        if(!(match = message.match(/changed:\s*(.*?)\s+OK/))) {
            throw new Error("Received unknown message during idle: " + message);
        }
        this._enterIdle();
        var updated = match[1];
        var afterUpdate = function() {
            this.emit("update", updated);
        }.bind(this);
        switch(updated) {
            case "mixer":
            case "player":
            case "options":
                this.updateStatus(afterUpdate);
                break;
            case "playlist":
                this._updatePlaylist(afterUpdate);
                break;
            case "database":
                this._updateSongs(afterUpdate);
                break;
        };
    };

    MPD.prototype._initialGreeting = function(message) {
        //console.log("Got initial greeting: " + message);
        var m;
        if(m = message.match(/OK\s(.*?)\s((:?[0-9]|\.))/)) {
            this.server.name = m[1];
            this.server.version = m[2];
        }
        else {
            throw new Error("Unknown values while receiving initial greeting");
        }
        this._enterIdle();
        this.client.onData = this._onData.bind(this);
        var refreshPlaylist = function() {
            this._updatePlaylist(this._setReady.bind(this));
        }.bind(this);
        var refreshStatus = function() {
            this.updateStatus(refreshPlaylist.bind(this));
        }.bind(this);
        refreshStatus();
    };

    MPD.prototype._setReady = function() {
        this.emit('ready', this.status, this.server);
    };

    MPD.prototype._checkReturn = function(msg) {
        if(msg !== "OK") {
            return new Error("Non okay return status: \"" + msg + "\"");
        }
    };

    function findReturn(message) {
        var arr;
        var rOk = /OK(?:\n|$)/g;
        var rAck = /ACK\s*\[\d*\@\d*]\s*\{.*?\}\s*.*?(?:$|\n)/g;
        if(arr = rOk.exec(message)) {
            return arr.index + arr[0].length;
        }
        else if(arr = rAck.exec(message)) {
            return arr.index + arr[0].length;
        }
        else return -1;
    }

    /*
     * Idling
     */

    MPD.prototype._enterIdle = function(callback) {
        this.idling = true;
        this.commanding = false;
        this._write("idle");
    };

    MPD.prototype._leaveIdle = function(callback) {
        this.idling = false;
        this.client.onData = function (message) {
            this.commanding = true;
            callback();
            this.client.onData = this._onData.bind(this);
        }.bind(this);

        this._write("noidle");
    };

    MPD.prototype._checkIdle = function() {
        //console.log(this._requests.length + " pending requests");
        if(!this._activeListener && this._requests.length == 0 && !this.idling) {
            //console.log("No more requests, entering idle.");
            this._enterIdle();
        }
    };

    /*
     * Sending messages
     */

    MPD.prototype._checkOutgoing = function() {
        var request;
        if(this._activeListener || this.busy) {
            //console.log("No deque as active listener.");
            return;
        }
        if(request = this._requests.shift()) {
            //console.log("Pending deque, leaving idle.");
            this.busy = true;
            var deque = function() {
                //console.log("Dequed.");
                this._activeListener = request.callback;
                this.busy = false;
                this._write(request.message);
            }.bind(this);
            if(this.idling) {
                this._leaveIdle(deque);
            }
            else {
                deque();
            }
        }
    };

    MPD.prototype._sendCommand = function() {
        var cmd = "", args = "", callback;
        if (arguments.length == 0) {
            return;
        }
        if (arguments.length >= 1) {
            cmd = arguments[0];
        }
        if (arguments.length >= 2) {
            callback = arguments[arguments.length - 1];
        }
        for (var i = 1; i < arguments.length - 1; i++) {
            args += " \"" + arguments[i] + "\" ";
        }
        if (!callback) {
            callback = function () {
            };
        }
        this._send(cmd + args, callback);
    }

    MPD.prototype._send = function(message, callback) {
        this._requests.push({
            message : message,
            callback : callback
        });
        //console.log("Enqueued: " + message, ", " + this._requests.length + " pending");
        this._checkOutgoing();
    };

    MPD.prototype._handleResponse = function(message) {
        var callback;
        //console.log("Handling response: \"" + message + "\" active listener is " + this._activeListener);
        if(callback = this._activeListener) {
            this._activeListener = null;
            this._checkOutgoing();
            //console.log("Checking idle as message was sucessfully answered.");
            this._checkIdle();
            callback(message);
        }
    };

    MPD.prototype._write = function(text) {
        //console.log("SEND: " + text);
        var command = text;
        var bytes = new Uint8Array(command.length + 1);
        for (var i = 0; i < command.length; i++) {
            bytes[i] = command.charCodeAt(i);
        }
        bytes[command.length] = "\n".charCodeAt(0);
        this.client.write(bytes);
    };

    return MPD;
}

module.exports = MPDJS;



