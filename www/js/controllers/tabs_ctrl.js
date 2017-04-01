/**
 * Created by marco on 2/03/17.
 */
function tabs_ctrl($scope, $ionicPlatform, $location, $ionicPopover, $ionicModal, $ionicListDelegate, MPDService) {

    const categories = ['playlist','artist','genre','album', 'allSongs'];

    $ionicPlatform.ready(function() {

        $ionicModal.fromTemplateUrl('templates/songsModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $ionicPopover.fromTemplateUrl('templates/playlistPopover.html', {
            scope: $scope,
        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        $scope.openPopover = function ($event, song) {
          $scope.songOnPopover = song;
          $scope.popover.show($event);
        };

        $scope.closePopover = function () {
            $scope.popover.hide();
            angular.element(document.body).removeClass('popover-open');
            delete $scope.songOnPopover;
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
            $scope.popover.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        // Execute action on hide modal
        $scope.$on('popover.hidden', function() {
            // Execute action
            console.log('popover hidden');
        });
        // Execute action on remove modal
        $scope.$on('popover.removed', function() {
            // Execute action
            console.log('popover removed');
        });

        $scope.$on('onDataReceived', function (event, data) {
            var updateList;
            switch(data.type){
                case 'artist': updateList = function () {
                    $scope.artists = data.items;
                };break;
                case 'album': updateList= function () {
                    $scope.albums = data.items;
                };break;
                case 'genre': updateList = function () {
                    $scope.genres = data.items;
                };break;
                case 'playlist': updateList = function () {
                    $scope.playlists = data.items;
                };break;
                default: updateList = function () {
                    $scope.songs = data.items;
                }
            }
            $scope.$apply(updateList);
        });

        $scope.$on('onResponseFindRequest', function(event, data){
            if(data.items.length > 0){
                $scope.$apply(function(){
                    $scope.selectedCategory = {type: data.type, name: data.name, items: data.items};
                    //$scope.isPlaylist = false;
                });
                $scope.isPlaylist = (data.type == 'playlist');
                $scope.openModal();
            }else{
                console.log('no data');
            }
        });

        $scope.playAt = function (pos) {
            MPDService.playAt(pos, function () {
                $scope.$apply(function () {
                    $location.path('/main');
                })
            });
        };

        $scope.addToQueue = function(song){
            MPDService.add(song, function () {
                $ionicListDelegate.closeOptionButtons();
                window.plugins.toast.show('Song added to queue', 'short', 'bottom');
            });
        };

        $scope.search = function (type, criteria) {
            MPDService.searchSongs(type, criteria);
        };

        $scope.addSongToPlaylist = function(playlist) {
            console.log(playlist);
            MPDService.addSongToPlaylist(playlist, $scope.songOnPopover.file);
            $scope.closePopover();
            $ionicListDelegate.closeOptionButtons();
            window.plugins.toast.show('Song added to playlist '+playlist, 'short', 'bottom');
        };

        $scope.$on('$ionicView.enter', function(){
            $scope.player = MPDService.getPlayer();
            categories.forEach(function (e) {
                MPDService.searchMusicByType(e);
            });
        });
    });
}

module.exports = tabs_ctrl;