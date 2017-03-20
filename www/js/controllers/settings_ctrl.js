/**
 * Created by marco on 2/03/17.
 */
function settings_ctrl($scope, $ionicPlatform, $location, MPDService) {


    $ionicPlatform.ready(function() {

        $scope.player = MPDService.getPlayer();

        $scope.$on('onDisconnect', function(event, data){
            $scope.player = {};
        });

        const defaultIp = '192.168.43.98';
        const defaultPort = 6600;

        $scope.connect = function (connectionParams) {
            var ip = (connectionParams && connectionParams.host) ? connectionParams.host : defaultIp;
            var port = (connectionParams && connectionParams.port) ? connectionParams.port : defaultPort;
            MPDService.connect(ip, port, function () {
                $location.path('/main');
            });
        };

        $scope.disconnect = function () {
          MPDService.disconnect();
        };
    });
}

module.exports = settings_ctrl;