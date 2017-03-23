/**
 * Created by marco on 2/03/17.
 */
function settings_ctrl($scope, $ionicPlatform, $location, MPDService) {

    $ionicPlatform.ready(function() {


        $scope.$on('$ionicView.loaded', function(){
            // Anything you can think of
            console.log('settings controlelr loaded');
        });

        $scope.$on('$ionicView.enter', function(){
            // Anything you can think of
            console.log('settings controlelr enter');
        });

        $scope.player = MPDService.getPlayer();

        const defaultIp = '192.168.43.98';
        const defaultPort = 6600;

        $scope.connect = function (connectionParams) {
            var ip = (connectionParams && connectionParams.host) ? connectionParams.host : defaultIp;
            var port = (connectionParams && connectionParams.port) ? connectionParams.port : defaultPort;
            MPDService.connect(ip, port, function () {
                $scope.$apply(function () {
                    $location.path('/main');
                })
            });
        };

        $scope.disconnect = function () {
          MPDService.disconnect(function () {
              $scope.player = null;
          });
        };
    });
}

module.exports = settings_ctrl;