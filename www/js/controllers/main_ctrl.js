/**
 * Created by marco on 2/03/17.
 */
function main_ctrl($scope, $ionicPlatform, $timeout, $ionicModal, $ionicListDelegate, MPDService) {

    $scope.divide = 0;
    $ionicPlatform.ready(function() {

        //modal
        $ionicModal.fromTemplateUrl('templates/queue.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        $scope.$on('$ionicView.loaded', function(){
            // Anything you can think of
            console.log('main controlelr loaded');
        });



        $scope.$on('$ionicView.enter', function(){
            // Anything you can think of
            $scope.player = MPDService.getPlayer();
            console.log('enter event');
            console.log($scope.player);
            if($scope.player) {
                MPDService.status(function (status, server) {
                    onPlayerChange(status);
                });
            }
        });

        $scope.seek = function (event) {
            var fullProgressBarWidth = $(e.currentTarget).width();
            var requestedPosition = e.offsetX / fullProgressBarWidth;
            var seekTime = Math.ceil($scope.time*requestedPosition);
            MPDService.seek(seekTime);
        };
        //ici on va stocker la dernier musique jouée et la dernier action fait, pour pouvoir controller le pause, stop, et surtout le "next"
        //pour savoir quand redémarrer le timer
        var actualStatus = {actualSongId : -1};
        //$scope.progressPercent = 0;
        /**
         * Fonction qui s'éxecute quand le controller charge (après le chargement du DOM, voir $timeout)
         */

        const stopCounter = function(){
            //divide = pourcentage par rapport à la durée de la musique, pour le width du progress-bar
            $scope.$apply(function () {
                $scope.divide = $scope.counter*100/$scope.time;
            });
            $timeout.cancel(mytimeout);
        };

        const onTimeout = function(){
            //divide = pourcentage par rapport à la durée de la musique, pour le width du progress-bar
            //counter = valeur, soit 0 soit le temps qui a passé en jouant la musique (on l'obtient et on le set de $scope.player.status.time.elapsed)
            if($scope.counter < $scope.time){
                $scope.counter++;
                $scope.divide = $scope.counter*100/$scope.time;
                mytimeout = $timeout(onTimeout,1000);
            }
        };

        const restart = function () {
            stopCounter();
            onTimeout();
        };

        var mytimeout = $timeout(onTimeout,1000);

        /*$scope.seek = function (e) {
            var fullProgressBarWidth = $(e.currentTarget).width();
            var requestedPosition = e.offsetX / fullProgressBarWidth;
            var seekTime = Math.ceil($scope.time*requestedPosition);
            MPDService.seek(seekTime);
        };*/

        /**
         * Fonction qui écoute les évenements du player (play,stop,pause) Pour mettre à jour la vue
         */
        const onPlayerChange = function (playerStatus) {

            //Si lorsqu'on se connecte, le player est en "stop", on rédemarre le counter(nro de seconds passés)
            if(!playerStatus)   playerStatus = $scope.player.status;

            if(playerStatus.state == 'stop'){
                actualStatus.state = playerStatus.state;
                actualStatus.actualSongId = playerStatus.song;
                $scope.counter = 0;
                stopCounter();
            }else{
                //Si lorsqu'on se connecte, le player est en "play" ou "pause" on mettre à jour le titre de la musique dans la vue
                // et on maj le temps qui avait passé
                var currentSong = $scope.player.playlist[playerStatus.song];
                var elapsed = 0;
                if(playerStatus.time !== undefined){
                    elapsed = playerStatus.time.elapsed;
                }
                $scope.$apply(function () {
                    $scope.time = currentSong.time;
                    $scope.counter = elapsed;
                    $scope.player.currentSong = {
                        artist: currentSong.artists || 'Unknown',
                        title : currentSong.title || currentSong.file
                    };
                });
                if(playerStatus.state == 'play'){
                    //si actualSongId == -1 -> C'est nous qui commençons a jouer, alors on "commence"
                    //du counter qu'on avaut, 0 si actualSongId == -1, le temps joué si on avait fait "pause"
                    if(actualStatus.state == 'pause'){
                        onTimeout();
                    }else{
                        //Si actualSongId != -1, qqn avait sélectionné "next", il faut rédemarrer le timer");
                        restart();
                    }
                    actualStatus.state = playerStatus.state;
                    actualStatus.actualSongId = playerStatus.song;
                }else if (playerStatus.state == 'pause') {
                    actualStatus.state = playerStatus.state;
                    actualStatus.actualSongId = playerStatus.song;
                    stopCounter(true);
                }
            }
        };

        /**
         * Cette événement est appellé depuis le service quand qq condition a changé depuis le serveur mpd
         * si player -> c'est play/pause/stop, etc
         * si mixer -> c'est le volume
         * si options-> c'est repeat/random ou un autre
         */
        $scope.$on('onUpdate', function (event, data) {
            console.log(data.event);
            if(data.event == 'player'){
                onPlayerChange();
            }else if(data.event == 'options'){
                //on met à jout le status pour montrer si on a sélectionné random/repeat
                $scope.$apply(function () {
                    $scope.player.status = data.mpd.status;
                });
            }
        });

        $scope.$on('onDisconnect', function(event, data){
            $scope.counter= 0;
            stopCounter();
            $scope.player = null;
        });

        $scope.addSongs = function () {
            MPDService.addSongs();
        };

        $scope.playOrPause = function () {
            if($scope.player.status.state == 'play'){
                MPDService.pause();
            }else{
                MPDService.play();
            }
        };

        $scope.playAt = function (pos) {
            $ionicListDelegate.closeOptionButtons();
            MPDService.playAt(pos, function () {
                $scope.closeModal();
            });
        };

        $scope.next = function () {
            MPDService.next();
        };
        $scope.prev = function () {
            MPDService.prev();
        };
        $scope.stop = function () {
            MPDService.stop();
        };
        $scope.clear = function () {
            MPDService.clear();
            MPDService._updatePlaylist(function () {
                //PLAYER.modules.playlist.loadSongs(mpd.playlist);
            });

        };

        $scope.volPlus = function () {
            console.log("plus");
            MPDService.volPlus();
        };
        $scope.volMinus = function () {
            MPDService.volMinus();
        };

    });
}

module.exports = main_ctrl;