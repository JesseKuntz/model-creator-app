#  model-creator-app

React Native app for the Model Creator system. This was first developed as a senior project at Calvin College. It's a developer tool right now, not a product, so keep that in mind. If you would like to see the web component, go here: https://github.com/JesseKuntz/model-creator-web



##  Vision

![resources](https://docs.google.com/drawings/d/e/2PACX-1vTSGtvEB-2kYkFJZNt5dKaUkE3jsi5QUbPQCxuwisvKpch-NztI2-fnEJ4bIkQ0n6RYHw58-SWANbU2/pub?w=1392&h=699)

You have an app on your smartphone. Using the accelerometer (with the assistance of the gyroscope), you can track position relative to where you started recording position. The position is recorded in two axes, x and y, and the system is meant to record the position of larger objects (from the top of a table to the perimeter of a small room).



Once all of the position points have been collected, you can send the data to a web server that will graph your points for you, as well as give you the option to export your data to a Blender-compatible file to be further edited.



##  Dependencies

*  Git (but hopefully you have that already): https://git-scm.com/

*  Node.js: https://nodejs.org/en/

*  Expo CLI: `npm install -g expo-cli`

*  On your mobile device, install Expo. It's the app you will be running Model Creator within.



##  Get Started

NOTE: There are a lot of ways to develop apps, and a lot of ways to develop apps with Expo (the tool I used).

I developed mine for an iPhone 7, but Expo is a toolchain built around React Native so the app will work for both

iPhone and Android. Either way, this is just one way to get it set up - not necessarily the "right" way, if there is one. If there are problems with my instructions, refer to https://docs.expo.io/versions/latest/introduction/installation/, as stuff might have changed.



Clone the repo. Clone the repo. Rename the .env-template file as .env, and follow the instructions in the file, filling in your own information in place of the dummy data.



Once that is done, you can start up the app:



`expo start`



This will show you a bunch of ways that you can access the session with the app on your mobile device. Choose one of those methods, and the bundle will load.



All of the code lives in App.js. Any changes that you make to the code will automatically transfer to your app when you save.



##  How it Works



The instructions explain a little bit on techniques to get the most accurate point measurements, but I will explain how it actually accomplishes turning accelerometer values into position points.



When you press Start, every 30ms, it grabs the current accelerometer value. When it has 3 of them, so every 90ms, it averages them, and turns them into a position. So, it is constantly tracking position, and you can just grab the ones that you want or need with Track Position Point.



The way that it turns accelerometer values into position points is by integrating the accelerometer values to get velocity values, and then integrating the velocity values to get position values.



One way that it accounts for noise is by allowing for a "return to home." Because the accelerometer drifts, error accumulates. If you click the Stop button when the screen starts to turn red, you want to move the phone back to where you originally started. Then, when you click start again, quickly move the phone back to where you left off, and keep collecting position points. This way, that next chain of position points that you collect are just as accurate as the ones before it.



When you click the Send Data button, it will stitch together all of the position points into one long line. Each chain is stitched together, where the ending position of the first chain is moved 80% towards the first point of the next chain, and that point is moved 20% towards the aforementioned point so that they become the same point. The first chain is then split up into thirds, and the points in the final third are moved towards the first point in the next chain starting at 40% for the first point in the third, then incrementing by 10% until a cap of 80% is reached.

![resources](https://docs.google.com/drawings/d/e/2PACX-1vTRF6Mu12iNmLJKSxB-eqOTBiyIJfa6X0nG9mnSUwaIaSmlJ7Wa87vZgwWBv2cJKbswHkrtx-KbhyWX/pub?w=927&h=381)


There are a few other sources of error that I deal with, such as accelerometer noise, the gravitational offset to the accelerometer, and the accelerometer offset. These are fairly simple approaches:

*  **For the accelerometer noise:** As I discussed earlier, I averaged the accelerometer values in order to reduce the noise of the accelerometer.
* **For the gravitational offset:** The phone, when I hold it perfectly flat, has -1.0g, or -9.8m/s^2 as a value for the z axis. If I tilt it, the different axes begin to take on that gravitational value, which distorts the position measurements. Because the gyroscope can measure roll and pitch, I can respectively integrate those values to account for tilt in the x and y axes of the accelerometer.
* **For the accelerometer offset:** Every accelerometer has an offset, and it needs to be calibrated. I measured the offset in each axis by sampling 1000 values and averaging them. I then subtract that offset from every reading of the accelerometer.