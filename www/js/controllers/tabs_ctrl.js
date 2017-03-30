/**
 * Created by marco on 2/03/17.
 */
function tabs_ctrl($scope, $ionicPlatform, $location, $ionicPopover, $ionicModal, $ionicListDelegate, MPDService) {

    // .fromTemplate() method
    const categories = ['playlist','artist','genre','album', 'allSongs'];

    $ionicPlatform.ready(function() {

        $ionicModal.fromTemplateUrl('templates/songsModal.html', {
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
       /* $scope.popover = $ionicPopover.fromTemplateUrl('templates/actionPopover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };

        $scope.closePopover = function() {
            $scope.popover.hide();
        };

        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });*/

        //Listen for events
        $scope.$on('onUpdate', function (event, data) {
            if(data.event == 'playlist'){
                $scope.$apply(function () {
                   $scope.songList = data.mpd.playlist;
                });
            }
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
                if(MPDService.getIsTest()){
                    $scope.selectedCategory = {type: data.type, name: data.name, items: data.items};
                }else{
                    $scope.$apply(function(){
                        $scope.selectedCategory = {type: data.type, name: data.name, items: data.items};
                        //$scope.isPlaylist = false;
                    });
                }

                //console.log('selectedCategory');
                //console.log($scope.selectedCategory);
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

        $scope.$on('$ionicView.enter', function(){
            $scope.player = MPDService.getPlayer();
            $scope.songList = $scope.player.playlist;
            if(MPDService.getIsTest()){
                categories.forEach(function (e) {
                    switch(e){
                    case 'artist': {
                            $scope.artists = MPDService.searchMusicByType(e);
                        }break;
                    case 'album': {
                            $scope.albums =MPDService.searchMusicByType(e);
                        }break;
                    case 'genre': {
                            $scope.genres = MPDService.searchMusicByType(e);
                        }break;
                    case 'playlist':{
                            $scope.playlists = MPDService.searchMusicByType(e);
                        }break;
                    default: {
                            $scope.songs = MPDService.searchMusicByType(e);
                        }
                    }
                });
            }else{
                categories.forEach(function (e) {
                    MPDService.searchMusicByType(e);
                });
            }

        });
    });
}

module.exports = tabs_ctrl;