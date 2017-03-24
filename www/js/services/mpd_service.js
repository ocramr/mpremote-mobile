/**
 * Created by marco on 2/03/17.
 */
module.exports = function($ionicPopup, $rootScope) {

    // An alert dialog
    var showAlert = function (message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Message',
            template: message
        });
    };

    const filterEmpty = function (e) {
        return e && e!='';
    };

    var MPDJS = require('../../mpd/MPDJS.js');
    var MPD = MPDJS();
    var mpd;
    var volume_interval = 10;
    return{
        getPlayer:  function () {
            return mpd;
        },
        connect : function (host, port, sucessCallback) {
            mpd = new MPD({host: host, port : port});
            mpd.on('ready', function () {
                sucessCallback();
               /* $rootScope.$broadcast('onConnect', {server:
                    {host: mpd.host, port: mpd.port, isConnected: true, playlist: mpd.playlist}});*/
            });
            mpd.on('update', function (updated) {
                console.log(updated);
                $rootScope.$broadcast('onUpdate', {mpd: mpd, event: updated});
            });

            mpd.connect(function (message) {
                //showAlert(message);
                sucessCallback();
            }, function (message) {
                mpd = undefined;
                //showAlert(message);
            });

        },
        disconnect: function (callback) {
            mpd.disconnect();
            mpd = null;
            callback();
        },

        addSongs : function () {
            mpd.updateSongs(function (songs) {
                console.log(songs);
            });
        },
        play : function () {
            console.log("play");
            mpd.play();
        },
        pause : function () {
            mpd.pause(function () {
                console.log('paused');
            });
        },
        prev : function () {
            mpd.prev(function () {
               console.log("prev");
            });
        },
        next : function () {
            mpd.next(function () {
                console.log("next");
            })
        },
        stop: function () {
            mpd.stop(function () {
               console.log("stopped");
            });
        },
        clear : function () {
            mpd.clear(function () {
                console.log("clear");
            });
        },
        playAt: function (pos, callback) {
            mpd.playAt(pos, callback);
        },
        add: function (element, callback) {
            mpd.add(element, callback);
        },
        volPlus: function () {
            var newVolume = parseInt(mpd.status.volume) + volume_interval;
            if(newVolume <= 100) {
                mpd.volume(newVolume);
                mpd.updateStatus();
            }
        },
        volMinus: function () {
            var newVolume = parseInt(mpd.status.volume) - volume_interval;
            if (newVolume >= 0) {
                mpd.volume(newVolume);
                mpd.updateStatus();
            }
        },
        searchMusicByType: function (type) {
            if(type =='allSongs'){
                mpd.getSongs(function (data) {
                    $rootScope.$broadcast('onDataReceived', {type: type, items: data});
                });
            }else if(type =='playlist'){
                mpd.listOfPlaylists(function (data) {
                    data = data.filter(filterEmpty);
                    $rootScope.$broadcast('onDataReceived', {type: type, items: data});
                });
            }else{
                mpd.getList(type, function (data) {
                    data = data.filter(filterEmpty);
                    $rootScope.$broadcast('onDataReceived', {type: type, items: data});
                });
            }
        },
        searchSongs : function(type, search) {
            mpd.findRequest(type, search, function(data){
                $rootScope.$broadcast('onResponseFindRequest', {type: type, name: search, items: data});
            });
        },
        getPlaylistsSongs : function(name) {
            mpd.playlistSongs(name, function(data){
                $rootScope.$broadcast('onPlaylistSongsReceived', data);
            })
        },
        addPlaylist : function(name) {
            mpd.newPlaylist(name, function(response){
                return response;
            });
        },
        removePlaylist : function(name) {
            mpd.removePlayList(name, function(response){
                return response;
            })
        },
        addSongToPlaylist : function(name, song) {
            mpd.addToPlaylist(name, song, function(response){
                return response;
            });
        },
        deleteSongFromPlaylist : function(name, song) {
            mpd.deleteFromPlaylist(name, song, function(response){
                return response;
            });
        },
        loadPlaylist : function(name) {
            mpd.loadPlaylist(name ,function(response){
                return response;
            });
        },
        status : function (callback) {
            mpd.updateStatus(callback);
        },
        seek: function (position, callback) {
            mpd.seek(position,callback);
        }
    }
};