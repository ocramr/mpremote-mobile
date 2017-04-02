/**
 * Created by marco on 2/03/17.
 */
function main_ctrl($scope, $ionicPlatform, $timeout, $ionicModal, $ionicListDelegate, MPDService) {

    $ionicPlatform.ready(function() {

        //modal
        $ionicModal.fromTemplateUrl('templates/queueModal.html', {
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
        });

        $scope.seek = function (dummycounter) {
            var element = angular.element(document.querySelector('#timer'))[0];;
            var newTime = element.value;
            MPDService.seek(newTime);
        };


        /**
         * Cette événement est appellé depuis le service quand qq condition a changé depuis le serveur mpd
         * si player -> c'est play/pause/stop, etc
         * si mixer -> c'est le volume
         * si options-> c'est repeat/random ou un autre
         */
        $scope.$on('onUpdate', function (event, data) {
            console.log(data.event);
            /*if(data.event == 'player'){
                $scope.player.timer.time = (this.status.time) ? this.status.time.length : 0;
                $scope.player.timer.counter = (this.status.time) ? this.status.time.elapsed : 0;
                //onPlayerChange();
            }else */if(data.event == 'options'){
                //on met à jout le status pour montrer si on a sélectionné random/repeat
                $scope.$apply(function () {
                    $scope.player.status = data.mpd.status;
                });
            }else if(data.event =='playlist'){
                $scope.$apply(function () {
                   $scope.player.playlist = data.mpd.playlist;
                });
            }
        });

        $scope.$on('onDisconnect', function(event, data){
            $scope.counter= 0;
            //stopCounter();
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

        $scope.delete = function(position){
            MPDService.delete(position, function () {
                $ionicListDelegate.closeOptionButtons();
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

        $scope.random = function () {
            MPDService.random();
        };

        $scope.repeat = function () {
            MPDService.repeat();
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