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



        /*    alertPopup.then(function(res) {
         showAlert('Thank you for not eating my delicious ice cream cone');
         });
         };

         var socket = {};

         $scope.connect = function (element) {
         if (element)
         connectToCustomHost(element.host, element.port)
         };

         var connectToCustomHost = function (host, port) {
         if (host == "" || port == "") {
         showAlert("Host and port cannot be empty.");
         }
         else {
         connectToHost(host, parseInt(port));
         }
         };

         var connectToHost = function (host, port) {
         socket = new Socket();
         socket.onData = receiveData;
         socket.onError = function (errorMessage) {
         showAlert("Error occured, error: " + errorMessage);
         };
         socket.onClose = function (hasError) {
         showAlert("Socket closed, hasErrors=" + hasError);
         setDisconnected();
         };
         socket.open(
         host,
         port,
         setConnected,
         function (errorMessage) {
         showAlert("Error during connection, error: " + errorMessage);
         });
         };

         function receiveData(data) {
         var chars = new Array(data.length);
         for (var i = 0; i < data.length; i++) {
         chars.push(String.fromCharCode(data[i]));
         }
         var dataString = chars.join("");
         dataString.split(/(?:\r\n|\r|\n)/g).forEach(addTextToOutputElement);
         }

         function setConnected() {
         showAlert('connected');
         }

         function setDisconnected() {
         console.log("disconnected");
         }

         setDisconnected();*/
    });
}

module.exports = main_ctrl;