import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo';
import Collapsible from 'react-native-collapsible';

let INTERVAL = 30;
let AVERAGE = 3;
let RAD_TO_DEG = 57.29578;

// For debugging tick() execution length
let executionTime = [];

export default class App extends React.Component {
  // Set up the initial state
  constructor(props) {
    super(props);
    this.state = {
      accelDataX: [],
      accelDataY: [],
      accelDataZ: [],
      avgAccelDataX: [],
      avgAccelDataY: [],
      avgAccelDataZ: [],
      velocDataX: [],
      velocDataY: [],
      velocDataZ: [],
      positionDataX: [],
      positionDataY: [],
      positionDataZ: [],
      avgGyroDataP: [],
      avgGyroDataR: [],
      collectPoints: true,
      accelerometerData: {},
      gyroscopeData: {},
      positionPoints: [{ x: 0, y: 0, z: 0 }],
      gyroAngleP: 0,
      gyroAngleR: 0,
      finalAngleX: 0,
      finalAngleY: 0,
      gyroChanged: true,
      startStopButtonText: "Start",
      startTime: 0,
      backgroundColor: "#000000",
      startStopButtonColor: "#09a8cd",
      trackPositionButtonColor: "#aaaaaa",
      collapsed: true,
      averageCount: 0
    };
  }

  // Set up the sensors
  componentDidMount() {
    Accelerometer.setUpdateInterval(INTERVAL);
    Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
    });

    Gyroscope.setUpdateInterval(INTERVAL);
    Gyroscope.addListener(gyroscopeData => {
      this.setState({ gyroscopeData });
    });
  }

  // Algorithm to find the X position (called by tick())
  findPositionX() {
    let xAccel = this.state.accelDataX.slice();
    let xVeloc = this.state.velocDataX.slice();
    let xPosit = this.state.positionDataX.slice();

    // Original Way
    // if (xAccel.length > 1) {
    //   xVeloc.push(xVeloc[xVeloc.length - 1] + xAccel[xAccel.length - 1]);
    //   xPosit.push(xPosit[xPosit.length - 1] + xVeloc[xVeloc.length - 1]);
    //   this.setState({ velocDataX: xVeloc, positionDataX: xPosit });
    // } else {
    //   xVeloc.push(xAccel[0]);
    //   xPosit.push(xAccel[0]);
    //   this.setState({ velocDataX: xVeloc, positionDataX: xPosit });
    // }

    // "Stupid" Way
    // if (xAccel.length > 1) {
    //   xVeloc.push(xVeloc[xVeloc.length - 1] + (xAccel[xAccel.length - 1] - xAccel[xAccel.length - 2]));
    //   xPosit.push(xPosit[xPosit.length - 1] + xVeloc[xVeloc.length - 1]);
    //   this.setState({ velocDataX: xVeloc, positionDataX: xPosit });
    // } else {
    //   xVeloc.push(xAccel[xAccel.length - 1]);
    //   xPosit.push(xAccel[xAccel.length - 1]);
    //   this.setState({ velocDataX: xVeloc, positionDataX: xPosit });
    // }

    // "New / Smart" Way
    if (xAccel.length > 1) {
      xVeloc.push(xVeloc[xVeloc.length - 1] + xAccel[xAccel.length - 2] + ((xAccel[xAccel.length - 1] - xAccel[xAccel.length - 2])>>1));
      xPosit.push(xPosit[xPosit.length - 1] + xVeloc[xVeloc.length - 2] + ((xVeloc[xVeloc.length - 1] - xVeloc[xVeloc.length - 2])>>1));
      this.setState({ velocDataX: xVeloc, positionDataX: xPosit });
    } else {
      xVeloc.push(xAccel[xAccel.length - 1]);
      xPosit.push(xAccel[xAccel.length - 1]);
      this.setState({ velocDataX: xVeloc, positionDataX: xPosit });
    }
  }

  // Algorithm to find the Y position (called by tick())
  findPositionY() {
    let yAccel = this.state.accelDataY.slice();
    let yVeloc = this.state.velocDataY.slice();
    let yPosit = this.state.positionDataY.slice();

    // Original Way
    // if (yAccel.length > 1) {
    //   yVeloc.push(yVeloc[yVeloc.length - 1] + yAccel[yAccel.length - 1]);
    //   yPosit.push(yPosit[yPosit.length - 1] + yVeloc[yVeloc.length - 1]);
    //   this.setState({ velocDataY: yVeloc, positionDataY: yPosit });
    // } else {
    //   yVeloc.push(yAccel[0]);
    //   yPosit.push(yAccel[0]);
    //   this.setState({ velocDataY: yVeloc, positionDataY: yPosit });
    // }

    // "Stupid" Way
    // if (yAccel.length > 1) {
    //   yVeloc.push(yVeloc[yVeloc.length - 1] + (yAccel[yAccel.length - 1] - yAccel[yAccel.length - 2]));
    //   yPosit.push(yPosit[yPosit.length - 1] + yVeloc[yVeloc.length - 1]);
    //   this.setState({ velocDataY: yVeloc, positionDataY: yPosit });
    // } else {
    //   yVeloc.push(yAccel[yAccel.length - 1]);
    //   yPosit.push(yAccel[yAccel.length - 1]);
    //   this.setState({ velocDataY: yVeloc, positionDataY: yPosit });
    // }

    // "New / Smart" Way
    if (yAccel.length > 1) {
      yVeloc.push(yVeloc[yVeloc.length - 1] + yAccel[yAccel.length - 2] + ((yAccel[yAccel.length - 1] - yAccel[yAccel.length - 2])>>1));
      yPosit.push(yPosit[yPosit.length - 1] + yVeloc[yVeloc.length - 2] + ((yVeloc[yVeloc.length - 1] - yVeloc[yVeloc.length - 2])>>1));
      this.setState({ velocDataY: yVeloc, positionDataY: yPosit });
    } else {
      yVeloc.push(yAccel[yAccel.length - 1]);
      yPosit.push(yAccel[yAccel.length - 1]);
      this.setState({ velocDataY: yVeloc, positionDataY: yPosit });
    }
  }

  findPositionZ() {
    let zAccel = this.state.accelDataZ.slice();
    let zVeloc = this.state.velocDataZ.slice();
    let zPosit = this.state.positionDataZ.slice();
    if (zAccel.length > 1) {
      zVeloc.push(zVeloc[zVeloc.length - 1] + zAccel[zAccel.length - 1]);
      zPosit.push(zPosit[zPosit.length - 1] + zVeloc[zVeloc.length - 1]);
      this.setState({ velocDataZ: zVeloc, positionDataZ: zPosit });
    } else {
      zVeloc.push(zAccel[0]);
      zPosit.push(zAccel[0]);
      this.setState({ velocDataZ: zVeloc, positionDataZ: zPosit });
    }
  }

  // Read in the sensor values every {INTERVAL} ms, and take the average of every {AVERAGE} values
  tick() {
    // Start of performance check
    // let start = new Date().getTime();

    let { x, y, z } = this.state.accelerometerData;
    let { x: p, y: r, z: w } = this.state.gyroscopeData;

    // OFFSETS FOR 100 DATA POINTS
    // let offX = 0.007693737011237684;
    // let offY = 0.014534034165255541;
    // let offZ = -0.9947027948689579;

    // OFFSETS FOR 1000 DATA POINTS
    let offX = 0.00648852144028152;
    let offY = 0.0144764265868573;

    // Get the current accelerations
    let tempDataX = this.state.avgAccelDataX.slice();
    let tempDataY = this.state.avgAccelDataY.slice();
    let tempDataZ = this.state.avgAccelDataZ.slice();

    // Get the current gyroscope rotations
    let tempDataP = this.state.avgGyroDataP.slice();
    let tempDataR = this.state.avgGyroDataR.slice();

    // Threshold Calculations for Gyroscope
    if (p < 0.10 && p > -0.10 && r < 0.10 && r > -0.10 && w < 0.10 && w > -0.10) {
      tempDataP.push(0);
      tempDataR.push(0);

      this.setState({gyroChanged: false});
    } else {
      tempDataP.push(p);
      tempDataR.push(r);

      this.setState({gyroChanged: true});
    }

    // Correct the accelerometer readings based off of the known angles
    let correctX = x - offX;
    let correctY = y - offY;
    let angleCorrectX = (this.state.gyroAngleR / 90);
    let angleCorrectY = (this.state.gyroAngleP / 90);

    tempDataX.push(correctX - angleCorrectX);
    tempDataY.push(correctY - angleCorrectY);
    // tempDataZ.push(z + offZ);
    tempDataZ.push(0);

    // Average handler
    let avg = this.state.averageCount;
    avg++;
    this.setState({averageCount: avg})

    if (this.state.averageCount == AVERAGE) {
      // Accelerometer averaging and updating
      tempDataX = this.state.accelDataX.slice();
      tempDataX.push(arrayAverage(this.state.avgAccelDataX));
      tempDataY = this.state.accelDataY.slice();
      tempDataY.push(arrayAverage(this.state.avgAccelDataY));
      tempDataZ = this.state.accelDataZ.slice();
      tempDataZ.push(arrayAverage(this.state.avgAccelDataZ));

      // Following angle calculations inspired by: http://ozzmaker.com/berryimu/

      // Gyro angle setup
      let tempGyroAngleP = this.state.gyroAngleP;
      let tempGyroAngleR = this.state.gyroAngleR;
      tempGyroAngleP += arrayAverage(this.state.avgGyroDataP) * 0.07 * INTERVAL * AVERAGE * 2;
      tempGyroAngleR += arrayAverage(this.state.avgGyroDataR) * 0.07 * INTERVAL * AVERAGE * 2;

      // let accelAngleX = 0;
      // let accelAngleY = 0;
      // let AA = 0.98;
      // let filterAngleX = this.state.finalAngleX;
      // let filterAngleY = this.state.finalAngleY;
      // if (this.state.gyroChanged) {
      //   // Accel angle setup
      //   accelAngleX = (Math.atan2(arrayAverage(this.state.avgAccelDataY), arrayAverage(this.state.avgAccelDataZ)) + Math.PI) * RAD_TO_DEG;
      //   accelAngleY = (Math.atan2(arrayAverage(this.state.avgAccelDataZ), arrayAverage(this.state.avgAccelDataX)) + Math.PI) * RAD_TO_DEG;

      //   // Final angle calculations (complementary filter)
      //   filterAngleX = AA * (filterAngleX + arrayAverage(this.state.avgGyroDataP) * 0.07 * INTERVAL * AVERAGE) + (1 - AA) * accelAngleX;
      //   filterAngleY = AA * (filterAngleY + arrayAverage(this.state.avgGyroDataR) * 0.07 * INTERVAL * AVERAGE) + (1 - AA) * accelAngleY;
      // }

      // Update accelData and gyroData states
      this.setState({
        accelDataX: tempDataX, accelDataY:  tempDataY, accelDataZ:  tempDataZ,
        avgAccelDataX: [], avgAccelDataY: [], avgAccelDataZ: [],
        avgGyroDataP: [], avgGyroDataR: [],
        gyroAngleP: tempGyroAngleP, gyroAngleR: tempGyroAngleR,
        // finalAngleX: filterAngleX, finalAngleY: filterAngleY

      });

      this.state.averageCount = 0;

      // Calculate the positions based off of JUST the accelerometer
      this.findPositionX();
      this.findPositionY();
      this.findPositionZ();
    } else {
      // Time for background color:
      let elapsed = new Date().getTime() - this.state.startTime;
      elapsed = 100 - elapsed / 70;
      if (elapsed <= -5) elapsed = -5;

      this.setState({
        avgAccelDataX: tempDataX, avgAccelDataY: tempDataY, avgAccelDataZ: tempDataZ,
        avgGyroDataP: tempDataP, avgGyroDataR: tempDataR,
        backgroundColor: numberToColorHsl(elapsed)
      });
    }

    // End of performance check
    // let end = new Date().getTime();
    // executionTime.push(end - start);
  }

  // Start allowing for the collection of raw sensor data
  onPressCollectData() {
    if (this.state.collectPoints) {
      this.intervalObj = setInterval(this.tick.bind(this), INTERVAL);
      this.setState({ startTime: new Date().getTime(),
                      startStopButtonText: "Stop",
                      startStopButtonColor: "#6D0F0F",
                      trackPositionButtonColor: "#09a8cd"
                    });
    }
    else {
      clearInterval(this.intervalObj);

      let tempPositions = this.state.positionPoints.slice();

      // Only reset back to 0 if you moved somewhere
      if (tempPositions[tempPositions.length - 1].x !== 0) tempPositions.push({ x: 0, y: 0, z: 0 });

      // Reset the positions
      this.setState({ startStopButtonText: "Start",
                      positionPoints: tempPositions,
                      accelDataX: [],
                      accelDataY: [],
                      accelDataZ: [],
                      velocDataX: [],
                      velocDataY: [],
                      velocDataZ: [],
                      positionDataX: [],
                      positionDataY: [],
                      positionDataZ: [],
                      gyroAngleP: 0,
                      gyroAngleR: 0,
                      gyroAngleW: 0,
                      finalAngleX: 0,
                      finalAngleY: 0,
                      timeElapsed: 0,
                      backgroundColor: "#000000",
                      startStopButtonColor: "#09a8cd",
                      trackPositionButtonColor: "#aaaaaa"
                    });
    }
    // Do this at the end because it doesn't change state quick enough
    this.setState({ collectPoints: !this.state.collectPoints });
  }

  // The Ultimate Debugger
  onPressDebug() {
    let avgX = 0;
    let avgY = 0;
    let avgZ = 0;
    let len = this.state.accelDataX.length;

    // Checking gyroAngle data (right now they aren't the same... but might not matter):
    // let currAngle = this.state.gyroAngleP;
    // let currData = this.state.gyroDataP.slice();

    // console.log("Current Angle: ");
    // console.log(currAngle);

    // console.log("\nGyro Data: ");
    // console.log(currData);

    // console.log("\nSummed Gyro Data:");
    // let sum = 0;
    // for (let i = 0; i < currData.length; i++) {
    //   sum += currData[i];
    // }
    // console.log(sum);

    // let xAccel = this.state.accelDataX.slice();
    // let xVeloc = this.state.velocDataX.slice();
    // let xPosit = this.state.positionDataX.slice();

    // let yAccel = this.state.accelDataY.slice();

    // Checking Averages:
    // for(let i = 0; i < len; i++) {
    //   avgX += this.state.accelDataX[i];
    //   avgY += this.state.accelDataY[i];
    //   avgZ += this.state.accelDataZ[i];
    // }

    // Feeding in Accel Data Test:
    // for (let i = 0; i < len; i++) {
    //   // New / Smart Way
    //   if (i > 1) {
    //     xVeloc.push(xVeloc[i - 1] + xAccel[i - 1] + ((xAccel[i] - xAccel[i - 1])>>1));
    //     xPosit.push(xPosit[i - 1] + xVeloc[i - 1] + ((xVeloc[i] - xVeloc[i - 1])>>1));
    //   } else {
    //     xVeloc.push(xAccel[i]);
    //     xPosit.push(xAccel[i]);
    //   }

    //   // Dumb Way
    //   // if (i > 1) {
    //   //   xVeloc.push(xVeloc[i - 1] + (xAccel[i] - xAccel[i - 1]));
    //   //   xPosit.push(xPosit[i - 1] + xVeloc[i]);
    //   // } else {
    //   //   xVeloc.push(xAccel[i]);
    //   //   xPosit.push(xAccel[i]);
    //   // }

    //   this.setState({ velocDataX: xVeloc, positionDataX: xPosit });
    // }

    // Printing all arrays:
    // console.log("\nAccel Data (X): ");
    // for(let i = 0; i < len; i++) {
    //   console.log(xAccel[i]);
    // }

    // Checking the max of the X accel values (winner: 0.1)
    // console.log(`Max XAccel: ${Math.max(...xAccel)}`)

    // Checking the min of the X accel values (winner: -0.1)
    // console.log(`Min XAccel: ${Math.min(...xAccel)}`)

    // Checking the max of the Y accel values (winner: 0.1)
    // console.log(`Max YAccel: ${Math.max(...yAccel)}`)

    // Checking the min of the Y accel values (winner: -0.1)
    // console.log(`Min YAccel: ${Math.min(...yAccel)}`)

    // console.log("\nVeloc Data (X): ");
    // for(let i = 0; i < len; i++) {
    //   console.log(xVeloc[i]);
    // }

    // console.log("\nPosit Data (X): ");
    // for(let i = 0; i < len; i++) {
    //   console.log(xPosit[i]);
    // }

    // console.log("Accel Data (X): " + this.state.accelDataX.join(",") + "\n");
    // console.log("AVG OF Accel Data (X): " + avgX / len + "\n");
    // console.log("Accel Data (Y): " + this.state.accelDataY.join(",") + "\n");
    // console.log("AVG OF Accel Data (Y): " + avgY / len + "\n");
    // console.log("Accel Data (Z): " + this.state.accelDataZ.join(",") + "\n");
    // console.log("AVG OF Accel Data (Z): " + avgZ / len + "\n");

    // console.log("Position Points: " + JSON.stringify(this.state.positionPoints));
    // let newDataFormat = arrayToJson(this.state.positionPoints);
    // console.log("X: " + newDataFormat.x.join(",") + "\n");
    // console.log("Y: " + newDataFormat.y.join(",") + "\n");
    // console.log("Z: " + newDataFormat.z.join(",") + "\n");

    // Console Graphing (W.I.P.):
    // var s0 = new Array (120);
    // for (var i = 0; i < s0.length; i++) {
    //   s0[i] = 15 * Math.sin (i * ((Math.PI * 4) / s0.length));
    // }
    // console.log (asciichart.plot (s0));

    // Printing execution times:
    // console.log(`Max Time: ${Math.max(...executionTime)}`);
    // console.log(`Average Time: ${arrayAverage(executionTime)}`);
  }

  // Pop the most recent position point off the running stack and put it onto the stack to be sent to the server
  onPressTrackPosition() {
    if (!this.state.collectPoints) {
      let tempPoints = this.state.positionPoints.slice();
      tempPoints.push(
        {
          x: this.state.positionDataX[this.state.positionDataX.length - 1],
          y: this.state.positionDataY[this.state.positionDataY.length - 1],
          z: this.state.positionDataZ[this.state.positionDataZ.length - 1]
        }
      );

      this.setState({ positionPoints: tempPoints });
    }
  }

  onPressSendData() {
    /***************************************
    * SWAP THIS OUT BETWEEN WIFI LOCATIONS *
    ****************************************/

    let points = stitchPoints(this.state.positionPoints);
    this.setState({positionPoints: points});

    // fetch('http://153.106.86.133:3000/',{
    fetch('http://10.0.0.44:3000/', {
      method: 'POST',
      body: JSON.stringify(arrayToJson(this.state.positionPoints)),
      headers: { "Content-Type": "application/json" }
    })
      .then(function (response) {
        return response.json()
      }).catch(error => console.log(error));
  }

  toggleExpanded = () => {
    // Toggling the state of single Collapsible
    this.setState({ collapsed: !this.state.collapsed });
  };

  // This happens every 16.67ms (60 frames a second) >> https://facebook.github.io/react-native/docs/performance
  render() {
    // To access live sensor readings for development.
    let { x, y, z } = this.state.accelerometerData;
    let { x: p, y: r, z: w } = this.state.gyroscopeData;

    return (
      <View style={[styles.container, {backgroundColor: this.state.backgroundColor}]}>

        {/* INSTRUCTIONS COLLAPSIBLE */}
        <View style={styles.instructionsCollapsible}>
          <TouchableOpacity style={styles.instructionsButton} onPress={this.toggleExpanded}>
                <Text style={styles.instructionsButtonText}>Instructions</Text>
          </TouchableOpacity>
          <Collapsible collapsed={this.state.collapsed}>
            <View style={styles.instructionsContent}>
              <Text style={styles.instructionsContentText}>
{`* Make sure that when you start collecting data, the phone starts as flat as possible. This ensures that the gyroscope can correct for any phone tilting.

* After you start collecting data, and before the screen turns red, you should stop collecting data and return to your starting position. Then, when you start collecting the data again, move directly to where you left off and continue along your path.

* After you finish collecting all the points you want to, send your data. You can keep collecting more, and send it again if you want to as well.`}
              </Text>
            </View>
          </Collapsible>
        </View>

        {/* This is here if you want live data, for developing. */}
        {/* <Text style={styles.text}>Accelerometer:</Text>
        <Text style={styles.text}>X: {round(x)} Y: {round(y)} Z: {round(z)}</Text>

        <Text style={styles.text}>Gyroscope:</Text>
        <Text style={styles.text}>pitch: {round(p)} roll: {round(r)} yaw: {round(w)}</Text>

        <Text style={styles.text}>Unfiltered Angles:</Text>
        <Text style={styles.text}>pitch: {round(this.state.gyroAngleP)} roll: {round(this.state.gyroAngleR)}</Text>

        <Text style={styles.text}>Final Angles:</Text>
        <Text style={styles.text}>X: {round(this.state.finalAngleX)} Y: {round(this.state.finalAngleY)}</Text> */}

        {/* START / STOP BUTTON */}
        <TouchableOpacity
          style={[styles.startStopButton, {backgroundColor: this.state.startStopButtonColor}]}
          onPress={this.onPressCollectData.bind(this)}>
          <Text style={styles.startStopButtonText}>{this.state.startStopButtonText}</Text>
        </TouchableOpacity>

        {/* For development. */}
        {/* <Text style={styles.text}>Accel Data Count: {this.state.accelDataX.length}</Text>
        <Text style={styles.text}>Posit Data Count: {this.state.positionDataX.length}</Text> */}

        {/* TRACK POSITION BUTTON */}
        <TouchableOpacity
          style={[styles.button, {backgroundColor: this.state.trackPositionButtonColor}]}
          onPress={this.onPressTrackPosition.bind(this)}>
          <Text style={styles.buttonText}>Track Position Point</Text>
        </TouchableOpacity>

        {/* POSITION POINT TEXT */}
        <Text style={styles.text}># of Positions:  {this.state.positionPoints.length}</Text>

        {/* SEND DATA BUTTON */}
        <TouchableOpacity
          style={styles.sendDataButton}
          onPress={this.onPressSendData.bind(this)}>
          <Text style={styles.sendDataButtonText}>Send Data</Text>
        </TouchableOpacity>

        {/* This is here if you want to debug! */}
        {/* <TouchableOpacity
          style={styles.debug}
          onPress={this.onPressDebug.bind(this)}>
          <Text style={styles.buttonText}>DEBUG</Text>
        </TouchableOpacity> */}
      </View>
    );
  }
}

// Used for more readable values on the live sensor readings
function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

// Conversion of an array of JSON to a JSON of arrays (it's what the server wants)
function arrayToJson(objects) {
  let newDataFormat = {
    x: [],
    y: [],
    z: []
  }

  for (let i = 0; i < objects.length; i++) {
    newDataFormat.x.push(objects[i].x);
    newDataFormat.y.push(objects[i].y);
    newDataFormat.z.push(objects[i].z);
  }

  return newDataFormat;
}

// Algorithm for connecting each trace of position data
function stitchPoints(points) {
  let len = points.length;

  // Set this to the length of the CURRENT CHAIN, not the length of ALL THE POINTS
  let chainLength = 1;

  // Don't need to touch the first point
  for (let i = 1; i < len - 2; i++) {
    let currPoint = points[i];

    chainLength++;

    // Now if currTime is relatively high, I need to move currPoint closer to a similar point with a lower time
    if (currPoint.x === 0 && currPoint.y === 0) {
      let thirdOfLen = Math.floor(chainLength / 3);

      // Move 'last' 80% of the distance towards 'next', and move 'next' 20% of the distance towards 'last'.
      let last = points[i - 1];
      let next = points[i + 1];
      let xDiff = next.x - last.x;
      let yDiff = next.y - last.y;

      // Maybe need a negative/positive check here, and different code for either case...
      last.x += 0.8 * xDiff;
      next.x -= 0.2 * xDiff;
      last.y += 0.8 * yDiff;
      next.y -= 0.2 * yDiff;
      points[i - 1] = last;
      points[i + 1] = next;

      // For a third of the way down the previous chain, move the values SLIGHTLY towards 'next'.
      let weight = 0.40;
      for (let j = i - thirdOfLen; j < i - 1; j++) {
        let curr = points[j];
        curr.x += weight * (next.x - curr.x);
        curr.y += weight * (next.y - curr.y)

        // The should never be moving the full distance
        if (weight <= 0.8) {
          weight += 0.10;
        }
      }
    }
    chainLength = 1;
  }
  // Return the altered positions points
  return points;
}

// Simple array averaging function
function arrayAverage(arr) {
  let avg = 0;
  for (let i = 0; i < arr.length; i++) {
    avg += arr[i];
  }
  return avg / arr.length;
}

// From: https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
function hslToRgb(h, s, l){
  var r, g, b;

  if(s == 0){
      r = g = b = l; // achromatic
  }else{
      function hue2rgb(p, q, t){
          if(t < 0) t += 1;
          if(t > 1) t -= 1;
          if(t < 1/6) return p + (q - p) * 6 * t;
          if(t < 1/2) return q;
          if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}

// From: https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
function numberToColorHsl(i) {
  // as the function expects a value between 0 and 1, and red = 0° and green = 120°
  // we convert the input to the appropriate hue value
  var hue = i * 1.2 / 360;
  // we convert hsl to rgb (saturation 100%, lightness 50%)
  var rgb = hslToRgb(hue, 1, .5);
  // we format to css value and return
  return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#09a8cd',
    borderRadius: 10,
    margin: 20
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 30,
    textAlign: 'center',
    margin: 10
  },
  startStopButton: {
    backgroundColor: '#09a8cd',
    borderRadius: 10,
    margin: 20
  },
  startStopButtonText: {
    color: "#FFFFFF",
    fontSize: 30,
    textAlign: 'center',
    margin: 10
  },
  sendDataButton: {
    backgroundColor: '#90d9ef',
    borderRadius: 10,
    position: "absolute",
    bottom: 0,
    margin: 30
  },
  sendDataButtonText: {
    color: "#000000",
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontWeight: "bold",
    fontSize: 40
  },
  debug: {
    backgroundColor: '#90d9ef',
    borderRadius: 10,
    margin: 40
  },
  text: {
    margin: 4,
    color: '#FFFFFF',
    fontSize: 30
  },
  instructionsCollapsible: {
    position: 'absolute',
    top: 10,
    zIndex: 2
  },
  instructionsButton: {
    backgroundColor: '#4275BE',
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    padding: 10
  },
  instructionsButtonText: {
    textAlign: 'center',
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: '600'
  },
  instructionsContent: {
    padding: 15,
    backgroundColor: '#ffffff',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10
  },
  instructionsContentText: {
    color: "#000000",
    fontSize: 20
  }
});