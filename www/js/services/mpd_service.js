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

    var MPDJS = require('../../mpd/MPDJS.js');
    var MPD = MPDJS();
    var mpd={};
    var volume_interval = 10;
    return{
        connect : function (host, port, sucessCallback) {
            mpd = new MPD({host: host, port : port});
            mpd.on('ready', function () {
                console.log('ready');
                console.log(mpd);
                $rootScope.$broadcast('onConnect', {server:
                    {host: mpd.host, port: mpd.port, isConnected: true, playlist: mpd.playlist}});
            });
            mpd.on('update', function (updated) {
                console.log("updated");
                console.log(updated);
                $rootScope.$broadcast('onUpdate', {server:
                    {host: mpd.host, port: mpd.port, isConnected: true, playlist: mpd.playlist}});
            });

            mpd.connect(function (message) {
                showAlert(message);
                sucessCallback();
            }, function (message) {
                mpd = {};
                showAlert(message);
            });

        },
        disconnect: function () {
            console.log("disconnected");
            $rootScope.$broadcast('onDisconnect', {});
            mpd.disconnect();
        }
        ,

        addSongs : function () {
            mpd.updateSongs(function (songs) {
                console.log(songs);
            });
        },
        play : function () {
            console.log("play");
            mpd.play(function () {
                console.log("playing");
            })
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
        playAt: function (pos) {
            mpd.playAt(pos, function () {
                console.log("playing at");
            });
        },
        add: function (element) {
            mpd.add(element, function () {
               console.log("added");
            });
        },
        volPlus: function () {
            mpd.volume(parseInt(mpd.status.volume) + volume_interval);
            mpd.updateStatus(function () {
                console.log("volPlus");
            });
        },
        volMinus: function () {
            mpd.volume(parseInt(mpd.status.volume) - volume_interval);
            mpd.updateStatus(function () {
                console.log("volMinus");
            });
        }
    }
};