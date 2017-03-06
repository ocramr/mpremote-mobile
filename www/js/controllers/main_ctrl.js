/**
 * Created by marco on 2/03/17.
 */
function main_ctrl($scope, $ionicPlatform, MPDService) {

    $ionicPlatform.ready(function() {

        $scope.$on('onConnect', function(event, data){
            $scope.player = data.server;
        });

        $scope.$on('onUpdate', function(event, data){
            console.log("onUpdate");
            $scope.player.playlist = data.server.playlist;
        });

        $scope.addSongs = function () {
            MPDService.addSongs();
        };

        $scope.play = function () {
            MPDService.play();
        };

        $scope.pause= function () {
            MPDService.pause();
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
        $scope.playAt = function (pos) {
            MPDService.playAt(pos);
        };
        $scope.add = function (name) {
            MPDService.add(name);
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