/**
 * Created by marco on 2/03/17.
 */
function tabs_ctrl($scope, $ionicPlatform, $location, MPDService) {

    const filterEmptyItem = function (e) {
        return e && e != '';
    };

    $ionicPlatform.ready(function() {

        $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
            // data.slider is the instance of Swiper
            $scope.slider = data.slider;
            console.log($scope.slider);
        })

        $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
            console.log('Slide change is beginning');
        });

        $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
            // note: the indexes are 0-based
            $scope.activeIndex = data.slider.activeIndex;
            $scope.previousIndex = data.slider.previousIndex;
            console.log('previusIndex :'+$scope.activeIndex+' previous was : '+$scope.previousIndex);
        });

        //Listen for events
        $scope.$on('onSongsReceived', function(event, data){
            $scope.$apply(function(){
                $scope.songs = data;
                $scope.isPlaylist = false;
            });
        });
        $scope.$on('onAlbumsReceived', function(event, data){
            $scope.$apply(function(){
                $scope.albums = data.filter(filterEmptyItem);
            });
        });
        $scope.$on('onArtistsReceived', function(event, data){
            $scope.$apply(function(){
                $scope.artists = data.filter(filterEmptyItem);
            });
        });
        $scope.$on('onGenresReceived', function(event, data){
            $scope.$apply(function(){
                $scope.genres = data.filter(filterEmptyItem);
            });
        });
        $scope.$on('onResonseFindRequest', function(event, data){
            $scope.$apply(function(){
                $scope.songs = data.filter(filterEmptyItem);
                $scope.isPlaylist = false;
            });
        });
        $scope.$on('onPlaylistsReceived', function(event, data){
            $scope.$apply(function(){
                $scope.playlists = data.filter(filterEmptyItem);
            });
        });

        $scope.$on('$ionicView.enter', function(){
            // Anything you can think of
            $scope.player = MPDService.getPlayer();
            $scope.songList = $scope.player.playlist;
            //MPDService.getAllSongs();
            MPDService.getAlbums();
            MPDService.getArtists();
            MPDService.getGenres();
            MPDService.getPlaylists();
        });
    });
}

module.exports = tabs_ctrl;