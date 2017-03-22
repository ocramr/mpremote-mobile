/**
 * Created by marco on 3/03/17.
 */
var config = {
    
    router : function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js

        // Each tab has its own nav history stack:
        $stateProvider.state('main', {
            url: '/', templateUrl: 'templates/main.html', controller: 'MainCtrl'
        }).state('settings', {
            url: '/settings', templateUrl: 'templates/settings.html', controller: 'SettingsCtrl'
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');
    },
    run : function ($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    }
    
};
module.exports = config;