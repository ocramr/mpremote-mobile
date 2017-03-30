/**
 * Created by marco on 2/03/17.
 */
module.exports = function($ionicPopup, $rootScope) {

    var isTest = true;

    //Fake data
    var getFakePlayer = function () {
        return {
            "host": "192.168.43.98",
            "port": "6600",
            "playlist": [{
                "file": "gaitan castro - como has hecho(3).mp3",
                "lastModified": null,
                "time": "269"
            }, {
                "file": "gypsy kings - gypsy kings live - allegria.mp3",
                "lastModified": null,
                "artist": "Gypsy King",
                "title": "Allegria",
                "track": "02",
                "genre": "Other",
                "time": "171"
            }, {
                "file": "Kaoma- Chorando se foi.mp3",
                "lastModified": null,
                "artist": "Kaoma",
                "title": "Chorando Se Foi (Lambada)",
                "date": "1989",
                "genre": "Latin",
                "time": "204"
            }, {
                "file": "kansas - kansas - dust in the wind.mp3",
                "lastModified": null,
                "time": "206"
            }, {
                "file": "gipsy kings - the big lebowski soundtrack - spanish hotel california.mp3",
                "lastModified": null,
                "artist": "Gipsy Kings",
                "title": "Spanish Hotel California",
                "date": "1997",
                "genre": "Salsa",
                "time": "346"
            }, {
                "file": "cake - i will survive.mp3",
                "lastModified": null,
                "artist": "Cake",
                "title": "I will survive",
                "date": "19__",
                "genre": "Sound Clip",
                "time": "311"
            }, {
                "file": "dlg - kimbara.mp3",
                "lastModified": null,
                "artist": "DLG",
                "title": "Kimbara",
                "track": "6",
                "date": "1997",
                "genre": "Salsa",
                "time": "256"
            }, {
                "file": "bon jovi - it's my life.mp3",
                "lastModified": null,
                "artist": "Bon Jovi",
                "title": "Its My Life",
                "track": "1",
                "date": "2000",
                "genre": "Rock",
                "time": "340"
            }],
            "status": {
                "volume": 99,
                "repeat": false,
                "random": true,
                "single": false,
                "consume": false,
                "playlistlength": 8,
                "state": "play",
                "song": 7
            },
            "timer" : {
                time:  0,
                counter:  0,
                divide : function () {
                    return this.counter*100/this.time;
                }
            },
            "previousStatus" : {
                "state" : "play", "songId": 7
            },
            "currentSong" : {
                "file": "bon jovi - it's my life.mp3",
                "lastModified": null,
                "artist": "Bon Jovi",
                "title": "Its My Life",
                "track": "1",
                "date": "2000",
                "genre": "Rock",
                "time": "340"
            }
        }
    };

    var getFakeLibrary = function (type) {
        if(type == 'playlist') return ["p", "another", "other", "work", "new"];
        else if(type == 'artist') return ["Bon Jovi", "Cake", "DLG", "Eric Clapton", "Gary Moore", "Gipsy Kings", "Guns N' Roses", "Gypsy King", "Gypsy Kings", "Kaoma", "Salsa", "eurythmics"];
        else if(type == 'album') return ["12\" -- Epic 73139", "Crush", "Gipsy Kings", "Gipsy Kings Live", "Intenso", "Out in the Fields: The Very Best of Gary Moore", "Pilgrim", "Pure Moods III", "Swing On", "The Big Lebowski Soundtrack", "The Spaghetti Incident?", "Tierra Gitana"];
        else if(type == 'genre') return ["Blues", "Flamenco", "Flamenco/Gypsy", "Latin", "New Age", "Other", "Pop", "Rock", "Salsa", "Sound Clip"];
        else if(type == 'allSongs') return [{
            "file": "cake - i will survive.mp3",
            "lastModified": null,
            "time": "311",
            "artist": "Cake",
            "title": "I will survive",
            "date": "19__",
            "genre": "Sound Clip"
        }, {
            "file": "cake - short skirt, long jacket (1).mp3",
            "lastModified": null,
            "time": "208",
            "artist": "Cake",
            "title": "Short skirt, long jacket"
        }, {
            "file": "dyango - cuando quieras donde quieras.mp3",
            "lastModified": null,
            "time": "207"
        }, {
            "file": "eurythmics - sweet dreams are made of these(2).mp3",
            "lastModified": null,
            "time": "292",
            "artist": "eurythmics",
            "title": "sweet dreams are made of thes",
            "genre": "Blues"
        }, {
            "file": "gaitan castro - como has hecho(3).mp3",
            "lastModified": null,
            "time": "269"
        }, {
            "file": "Gilberto Santarosa - La Conciencia (salsa).mp3",
            "lastModified": null,
            "time": "335",
            "title": "Gilberto Santarosa - La Conciencia (salsa)"
        }, {
            "file": "gypsy kings - bamboleo.mp3",
            "lastModified": null,
            "time": "206",
            "artist": "Gipsy Kings",
            "title": "Bamboleo",
            "genre": "Blues"
        }, {
            "file": "gypsy kings - gipsy kings - el mariachi desperado.mp3",
            "lastModified": null,
            "time": "127"
        }, {
            "file": "gypsy kings - volare.mp3",
            "lastModified": null,
            "time": "221",
            "artist": "Gypsy Kings",
            "title": "Volare",
            "genre": "Blues"
        }, {
            "file": "kansas - kansas - dust in the wind.mp3",
            "lastModified": null,
            "time": "206"
        }, {
            "file": "Kaoma- Chorando se foi.mp3",
            "lastModified": null,
            "time": "204",
            "artist": "Kaoma",
            "title": "Chorando Se Foi (Lambada)",
            "date": "1989",
            "genre": "Latin"
        }, {
            "file": "bon jovi - it's my life.mp3",
            "lastModified": null,
            "time": "340",
            "artist": "Bon Jovi",
            "title": "Its My Life",
            "track": "1",
            "date": "2000",
            "genre": "Rock"
        }, {
            "file": "gipsy kings - gipsy kings - djobi djoba.mp3",
            "lastModified": null,
            "time": "207",
            "artist": "Gipsy Kings",
            "title": "Djobi Djoba",
            "track": "8",
            "date": "1988",
            "genre": "Flamenco"
        }, {
            "file": "gypsy kings - gypsy kings live - allegria.mp3",
            "lastModified": null,
            "time": "171",
            "artist": "Gypsy King",
            "title": "Allegria",
            "track": "02",
            "genre": "Other"
        }, {
            "file": "Gilberto Santarosa - Mentira.mp3",
            "lastModified": null,
            "time": "283",
            "artist": "Salsa",
            "title": "Mentira",
            "track": "4",
            "date": "2001",
            "genre": "Salsa"
        }, {
            "file": "Gary Moore - Still Got The Blues.mp3",
            "lastModified": null,
            "time": "373",
            "artist": "Gary Moore",
            "title": "Still Got the Blues",
            "track": "14",
            "date": "1998",
            "genre": "Rock"
        }, {
            "file": "eric clapton - 1998 pilgrim - 03 - pilgrim91.mp3",
            "lastModified": null,
            "time": "349",
            "artist": "Eric Clapton",
            "title": "Pilgrim",
            "date": "1998",
            "genre": "Pop"
        }, {
            "file": "gypsy kings - pure moods iii - arabic dance.mp3",
            "lastModified": null,
            "time": "147",
            "artist": "Gypsy Kings",
            "title": "Arabic Dance",
            "track": "06",
            "genre": "New Age"
        }, {
            "file": "DLG - Muevete.mp3",
            "lastModified": null,
            "time": "275",
            "artist": "DLG",
            "title": "Muevete",
            "track": "3",
            "date": "2000",
            "genre": "Salsa"
        }, {
            "file": "dlg - kimbara.mp3",
            "lastModified": null,
            "time": "256",
            "artist": "DLG",
            "title": "Kimbara",
            "track": "6",
            "date": "1997",
            "genre": "Salsa"
        }, {
            "file": "gipsy kings - the big lebowski soundtrack - spanish hotel california.mp3",
            "lastModified": null,
            "time": "346",
            "artist": "Gipsy Kings",
            "title": "Spanish Hotel California",
            "date": "1997",
            "genre": "Salsa"
        }, {
            "file": "Guns N' Roses - Since i don't have you.mp3",
            "lastModified": null,
            "time": "260",
            "artist": "Guns N' Roses",
            "title": "Since I Don't Have You",
            "track": "1",
            "date": "1993",
            "genre": "Rock"
        }, {
            "file": "gipsy kings - tierra gitana - tierra gitana.mp3",
            "lastModified": null,
            "time": "208",
            "artist": "Gipsy Kings",
            "title": "Tierra Gitana",
            "track": "6",
            "date": "1996",
            "genre": "Flamenco/Gypsy"
        }];
    };


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
    console.log(isTest);
    if(!isTest){
        var MPDJS = require('../../mpd/MPDJS.js');
        var MPD = MPDJS();
    }

    var mpd;
    var volume_interval = 10;
    return{
        getIsTest: function () {
           return isTest;
        },
        getPlayer:  function () {
            if(isTest){
                return getFakePlayer();
            }else{
                return mpd;
            }

        },
        connect : function (host, port, sucessCallback) {
            console.log(isTest);
            if(isTest){
                mpd = getFakePlayer();
                sucessCallback();
            }
            else {
                mpd = new MPD({host: host, port: port});
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
            }

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
            if(isTest){
               return getFakeLibrary(type);
            }else{
                if(type =='allSongs'){
                    if(isTest)
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
            }

        },
        searchSongs : function(type, search) {
            if(isTest){
                var data = getFakeLibrary('allSongs');
                $rootScope.$broadcast('onResponseFindRequest', {type: type, name: search, items: data});
            }else{
                if(type == 'playlist'){
                    mpd.playlistSongs(search, function(data){
                        $rootScope.$broadcast('onResponseFindRequest', {type: type, name: search, items: data});
                    })
                }else{
                    mpd.findRequest(type, search, function(data){
                        $rootScope.$broadcast('onResponseFindRequest', {type: type, name: search, items: data});
                    });
                }
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