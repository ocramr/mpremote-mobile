/**
 * Created by marco on 2/03/17.
 */
function settings_ctrl($scope, $ionicPlatform, $location, MPDService) {

    $ionicPlatform.ready(function() {


        $scope.$on('$ionicView.loaded', function(){
            // Anything you can think of
            console.log('settings controller loaded');
        });

        $scope.$on('$ionicView.enter', function(){
            // Anything you can think of
            console.log('settings controller enter');
        });

        $scope.player = MPDService.getPlayer();



        $scope.connect = function (connectionParams) {
            if(connectionParams != undefined && connectionParams.host != undefined && connectionParams.host.trim().length > 0){
                var port = connectionParams.port || 6600;
                MPDService.connect(connectionParams.host, port, function () {
                    $scope.$apply(function () {
                        $location.path('/main');
                    })
                });
            }else{
                console.log('empty data');
            }


        };

        $scope.disconnect = function () {
          MPDService.disconnect(function () {
              $scope.player = null;
          });
        };
    });
}

module.exports = settings_ctrl;