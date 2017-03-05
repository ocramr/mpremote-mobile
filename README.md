# mpremote-mobile
MPD Client for mobile devices

#Prerequisites - Installation

1. Install [Node.js](https://nodejs.org/en/)
2. Install Bower  
`$ sudo npm install -g bower`
3. Install Cordova  
`$ sudo npm install -g cordova`
4. Install Ionic  
`$ sudo npm install -g ionic`
5. Install Browserify  
`$ sudo npm install -g browserify`
6. Install Npm packages
`$ npm install`
7. Install Bower packages
`$ bower install`
8. Add platforms
`$ ionic add platform android`

Install Android SDK and include it to $PATH
`$ export ANDROID_HOME=<Android SDK Path>`
`$ export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools`

#Launch app in device
`$ ionic run android --device --livereload`

#Use browserify to build your changes
`$ browserify www/js/app.js -o www/js/bundle.js --debug`

