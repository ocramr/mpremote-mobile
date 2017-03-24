// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var angular = require("angular");
var app = angular.module('starter', ['ionic']);
app.config(['$stateProvider', '$urlRouterProvider', require('./config').router]);
app.run(['$ionicPlatform', require('./config').run]);
app.service('MPDService', ['$ionicPopup','$rootScope', require('./services/mpd_service')]);
app.controller('MainCtrl', ['$scope', '$ionicPlatform', '$timeout', 'MPDService', require('./controllers/main_ctrl')]);
app.controller('SettingsCtrl', ['$scope', '$ionicPlatform', '$location', 'MPDService', require('./controllers/settings_ctrl')]);
app.controller('TabsCtrl', ['$scope', '$ionicPlatform', '$location', '$ionicPopover', '$ionicModal','MPDService', require('./controllers/tabs_ctrl')]);