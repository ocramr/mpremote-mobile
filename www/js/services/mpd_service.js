/**
 * Created by marco on 2/03/17.
 */
module.exports = function($ionicPopup, $rootScope, $timeout) {

    const filterEmpty = function (e) {
        return e && e!='';
    };

    const stopCounter = function(player){
        $timeout.cancel(player.promiseTimeout);
    };

    const onTimeout = function(player){
        //counter = valeur, soit 0 soit le temps qui a passé en jouant la musique (on l'obtient et on le set de $scope.player.status.time.elapsed)

        if(player.timer.counter < player.timer.time){
            player.promiseTimeout  = $timeout(function () {
                onTimeout(player);
            },1000);
            player.timer.counter++;
        }
    };

    const checkStatus = function (player) {
        console.log("checkstatus");
        console.log(player);
        if(player.status.state =='play'){
            player.currentSong = player.playlist[player.status.song];
            if((player.previousStatus.songId != -1 && player.previousStatus.songId != player.status.song) || player.previousStatus.state != 'pause') {
                stopCounter(player);
            }
            /*if(player.previousStatus.state == 'stop' || player.previousStatus.songId != player.status.song){
                notifyMsg('play', {music: player.currentSong.artist+" - "+player.currentSong.title, host: player.host});
            }*/
            player.previousStatus.songId = player.status.song;
            player.previousStatus.state = player.status.state;
            onTimeout(player);
        }else{
            stopCounter(player);
            player.previousStatus.state = player.status.state;
        }
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

            mpd.on('update', function (updated) {
                //console.log(updated);
                if(updated =='player'){
                    this.timer.time = (this.status.time) ? this.status.time.length : 0;
                    this.timer.counter = (this.status.time) ? this.status.time.elapsed : 0;
                    checkStatus(this);
                }else{
                    $rootScope.$broadcast('onUpdate', {mpd: mpd, event: updated});
                }

            });
            mpd.on('ready', function () {
                this.timer = {
                    time: (this.status.time) ? this.status.time.length : 0,
                    counter: (this.status.time) ? this.status.time.elapsed : 0,
                };
                this.previousStatus = {state : this.status.state, songId: this.status.song || -1};
                checkStatus(this);
                sucessCallback();
            });
            mpd.connect(function (successMessage) {
                console.log(successMessage);
            }, function (errorMessage) {
                console.log(errorMessage);
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
        delete : function (position, callback) {
            mpd.delete(position, callback);
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
            if(type == 'playlist'){
                mpd.playlistSongs(search, function(data){
                    $rootScope.$broadcast('onResponseFindRequest', {type: type, name: search, items: data});
                })
            }else{
                mpd.findRequest(type, search, function(data){
                    $rootScope.$broadcast('onResponseFindRequest', {type: type, name: search, items: data});
                });
            }

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