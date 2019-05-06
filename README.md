# model-creator-app
React Native app for the Model Creator system. This was first developed as a senior project at Calvin College. It's a developer tool right now, not a product, so keep that in mind. If you would like to see the web component, go here: https://github.com/JesseKuntz/model-creator-web

## Dependencies
* Git (but hopefully you have that already): https://git-scm.com/
* Node.js: https://nodejs.org/en/
* Expo CLI: `npm install -g expo-cli`
* On your mobile device, install Expo. It's the app you will be running Model Creator within.

## Get Started
NOTE: There are a lot of ways to develop apps, and a lot of ways to develop apps with Expo (the tool I used).
I developed mine for an iPhone 7, but Expo is a toolchain built around React Native so the app will work for both
iPhone and Android. Either way, this is just one way to get it set up - not necessarily the "right" way, if there is one. If there are problems with my instructions, refer to https://docs.expo.io/versions/latest/introduction/installation/, as stuff might have changed.

Clone the repo. Find the onPressSendData() function in 'App.js' and replace the address with the IP of the computer running the web server as well as the port it is running on. It should have the format: 'http://10.4.5.97:2999/'

Once that is done, you can start up the app:

`expo start`

This will show you a bunch of ways that you can access the session with the app on your mobile device. Choose one of those methods, and the bundle will load.

All of the code lives in App.js. Any changes that you make to the code will automatically transfer to your app when you save.

## How it Works