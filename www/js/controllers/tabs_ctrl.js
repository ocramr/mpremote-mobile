/**
 * Created by marco on 2/03/17.
 */
function tabs_ctrl($scope, $ionicPlatform, $location, $ionicPopover, $ionicModal, MPDService) {

    // .fromTemplate() method
    var template =  '<ion-popover-view>' +
                            '<ion-header-bar>' +
                                '<h1 class = "title">Options</h1>' +
                            '</ion-header-bar>'+
                            '<ion-content>' +
                                '<button>Add to queue</button>' +
                            '</ion-content>' +
                    '</ion-popover-view>';

    const filterEmpty = function (e) {
        return e && e!='';
    };
    const categories = ['playlist','artist','genre','album'];

    $ionicPlatform.ready(function() {

        /*$ionicModal.fromTemplateUrl('my-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });*/
        /*$scope.openModal = function() {
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
        });*/
        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
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
        });

        //Listen for events
        $scope.$on('onDataReceived', function (event, data) {
            console.log(data);
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
            $scope.$apply(function(){
                $scope.songs = data;
                //$scope.isPlaylist = false;
            });
        });

        $scope.playAt = function (pos) {
            MPDService.playAt(pos, function () {
                $scope.$apply(function () {
                    $location.path('/main');
                })
            });
        };

        $scope.search = function (type, criteria) {
          MPDService.searchSongs(type, criteria);
        };

        $scope.$on('$ionicView.enter', function(){
            // Anything you can think of
            $scope.player = MPDService.getPlayer();
            console.log($scope.player);
            $scope.songList = $scope.player.playlist;
            categories.forEach(function (e) {
                MPDService.searchMusicByType(e);
            });
        });
    });
}

module.exports = tabs_ctrl;