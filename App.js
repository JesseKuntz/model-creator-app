import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo';
import asciichart from 'asciichart';

let INTERVAL = 100;
let AVERAGE = 3;
let RAD_TO_DEG = 57.29578;

// Tester vars so I don't have to deal with state yet
let averageCount = 0;

let executionTime = [];

let timer = null;
let times = [0];

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
      avgGyroDataW: [],
      collectPoints: true,
      accelerometerData: {},
      gyroscopeData: {},
      positionPoints: [{ x: 0, y: 0, z: 0 }],
      gyroAngleP: 0,
      gyroAngleR: 0,
      gyroAngleW: 0,
      finalAngleX: 0,
      finalAngleY: 0,
      gyroChanged: true,
      // positionPoints: [{"x":0,"y":0,"z":0},{"x":-0.03517225879231546,"y":-0.2117156680413678,"z":0},{"x":-0.005328681826757817,"y":-0.5336087904524555,"z":0},{"x":0.2134250259067349,"y":-0.983996844430415,"z":0},{"x":0.45743091510447875,"y":-1.3546667530961018,"z":0},{"x":0,"y":0,"z":0},{"x":-0.8690133680888874,"y":-0.981780185983717,"z":0},{"x":-1.1039704520830214,"y":-1.6050787404007893,"z":0},{"x":-1.4349676616568765,"y":-2.3924557224784833,"z":0},{"x":-1.9672830119471716,"y":-3.584038695693362,"z":0},{"x":-2.6185877065671876,"y":-5.046198814830581,"z":0},{"x":0,"y":0,"z":0}],
      startButtonText: "Start Collecting Data"
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

    // "New / Smart?" Way
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

    // "New / Smart?" Way
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
    let tempDataW = this.state.avgGyroDataW.slice();

    // Threshold Calculations for Gyroscope
    if (p < 0.10 && p > -0.10 && r < 0.08 && r > -0.08 && w < 0.08 && w > -0.08) {
      tempDataP.push(0);
      tempDataR.push(0);
      tempDataW.push(0);

      this.setState({gyroChanged: false});

      // IDEA: TURN SCREEN GREEN HERE. ONLY RECORD ACCEL DATA IF THE GYROSCOPE HAS NONE TO MINIMAL ROTATIONS,
      // WHICH WILL MAKE THE ACCEL MUCH MORE ACCURATE.

      // Threshold Calculations for the Accelerometer
      // (once it is not rotating, then we check that it not moving)
      // if (x < 0.03 && x > -0.03 && y < 0.03 && y > -0.03 && z < 0.03 && z > -0.03) {
      //   tempDataX.push(0);
      //   tempDataY.push(0);
      //   tempDataZ.push(0);
      // }
    } else {
      // IDEA CONTINUED: TURN SCREEN RED HERE. SHOULDN'T BE RECORDING IF IT IS ROTATING BECAUSE
      // THEN GRAVITY IS HAVING A HUGE EFFECT ON IT.

      tempDataP.push(p);
      tempDataR.push(r);
      tempDataW.push(w);

      this.setState({gyroChanged: true});
    }

    tempDataX.push(x - offX);
    tempDataY.push(y - offY);
    // tempDataZ.push(z + offZ);
    tempDataZ.push(0);

    // Average handler
    averageCount++;

    if (averageCount == AVERAGE) {
      // Accelerometer averaging and updating
      tempDataX = this.state.accelDataX.slice();
      tempDataX.push(arrayAverage(this.state.avgAccelDataX));
      tempDataY = this.state.accelDataY.slice();
      tempDataY.push(arrayAverage(this.state.avgAccelDataY));
      tempDataZ = this.state.accelDataZ.slice();
      tempDataZ.push(arrayAverage(this.state.avgAccelDataZ));

      // Gyro angle setup
      let tempGyroAngleP = this.state.gyroAngleP;
      let tempGyroAngleR = this.state.gyroAngleR;
      let tempGyroAngleW = this.state.gyroAngleW;
      tempGyroAngleP += arrayAverage(this.state.avgGyroDataP) * 0.07 * INTERVAL * AVERAGE;
      tempGyroAngleR += arrayAverage(this.state.avgGyroDataR) * 0.07 * INTERVAL * AVERAGE;
      tempGyroAngleW += arrayAverage(this.state.avgGyroDataW) * 0.07 * INTERVAL * AVERAGE;

      let accelAngleX = 0;
      let accelAngleY = 0;
      let AA = 0.98;
      let filterAngleX = this.state.finalAngleX;
      let filterAngleY = this.state.finalAngleY;
      if (this.state.gyroChanged) {
        // Accel angle setup
        accelAngleX = (Math.atan2(arrayAverage(this.state.avgAccelDataY), arrayAverage(this.state.avgAccelDataZ)) + Math.PI) * RAD_TO_DEG;
        accelAngleY = (Math.atan2(arrayAverage(this.state.avgAccelDataZ), arrayAverage(this.state.avgAccelDataX)) + Math.PI) * RAD_TO_DEG;

        // Final angle calculations (complementary filter)
        // filterAngleX += arrayAverage(this.state.avgGyroDataP) * 0.07 * INTERVAL;
        filterAngleX = AA * (filterAngleX + arrayAverage(this.state.avgGyroDataP) * 0.07 * INTERVAL * AVERAGE) + (1 - AA) * accelAngleX;
        filterAngleY = AA * (filterAngleY + arrayAverage(this.state.avgGyroDataR) * 0.07 * INTERVAL * AVERAGE) + (1 - AA) * accelAngleY;
      }

      // Update accelData and gyroData states
      this.setState({
        accelDataX: tempDataX, accelDataY:  tempDataY, accelDataZ:  tempDataZ,
        avgAccelDataX: [], avgAccelDataY: [], avgAccelDataZ: [],
        avgGyroDataP: [], avgGyroDataR: [], avgGyroDataW: [],
        gyroAngleP: tempGyroAngleP, gyroAngleR: tempGyroAngleR, gyroAngleW: tempGyroAngleW,
        finalAngleX: filterAngleX, finalAngleY: filterAngleY
      });

      averageCount = 0;

      // Calculate the positions based off of JUST the accelerometer
      this.findPositionX();
      this.findPositionY();
      this.findPositionZ();
    } else {
      this.setState({
        avgAccelDataX: tempDataX, avgAccelDataY: tempDataY, avgAccelDataZ: tempDataZ,
        avgGyroDataP: tempDataP, avgGyroDataR: tempDataR, avgGyroDataW: tempDataW
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
      this.setState({ startButtonText: "Stop Collecting Accel Data"});

      timer = new Date().getTime();
    }
    else {
      clearInterval(this.intervalObj);

      // Reset the positions (and timer)!
      let tempPositions = this.state.positionPoints.slice();
      tempPositions.push({ x: 0, y: 0, z: 0 });

      timer = null;
      times.push(0);

      this.setState({ startButtonText: "Start Collecting Accel Data",
                      positionPoints: tempPositions,
                      accelDataX: [],
                      accelDataY: [],
                      accelDataZ: [],
                      velocDataX: [],
                      velocDataY: [],
                      velocDataZ: [],
                      positionDataX: [],
                      positionDataY: [],
                      positionDataZ: []
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


    // Checking stitching timer:
    // console.log("Stiching Timer: ");
    // console.log(times);

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

    // console.log("Fusion Accel Data (X): " + this.state.fusionDataX.join(",") + "\n");
    // console.log("Gyro Data (P): " + this.state.gyroDataP.join(",") + "\n");
    // console.log("Mag Data (X): " + this.state.magDataX.join(",") + "\n");
    // console.log("Position Data (X): " + this.state.positionDataX.join(",") + "\n");

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
    // Push the time on for the weighted stitching algorithm (divide by 100 for simpler analysis)
    currTime = new Date().getTime();
    times.push((currTime - timer) / 100);

    // Just based off the accelerometer
    let tempPoints = this.state.positionPoints.slice();
    tempPoints.push(
      {
        x: this.state.positionDataX[this.state.positionDataX.length - 1],
        y: this.state.positionDataY[this.state.positionDataY.length - 1],
        z: this.state.positionDataZ[this.state.positionDataZ.length - 1]
      }
    );

    // Based off of the sensor fusion data
    let tempFusionPoints = this.state.fusionPositionPoints.slice();
    tempFusionPoints.push(
      {
        x: this.state.fusionPositionDataX[this.state.fusionPositionDataX.length - 1],
        y: this.state.fusionPositionDataY[this.state.fusionPositionDataY.length - 1],
        z: this.state.fusionPositionDataZ[this.state.fusionPositionDataZ.length - 1]
      }
    );

    this.setState({ positionPoints: tempPoints, fusionPositionPoints: tempFusionPoints });
  }

  onPressSendData() {
    /***************************************
    * SWAP THIS OUT BETWEEN WIFI LOCATIONS *
    ****************************************/

    let points = stitchPoints(this.state.positionPoints);
    this.setState({positionPoints: points});

    fetch('http://153.106.86.133:3000/',{
    // fetch('http://172.20.10.2:3000/',{
    // fetch('http://10.0.0.44:3000/', {
      method: 'POST',
      body: JSON.stringify(arrayToJson(this.state.positionPoints)),
      headers: { "Content-Type": "application/json" }
    })
      .then(function (response) {
        return response.json()
      }).catch(error => console.log(error));
  }

  render() {
    let { x, y, z } = this.state.accelerometerData;
    let { x: p, y: r, z: w } = this.state.gyroscopeData;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Accelerometer:</Text>
        <Text style={styles.text}>X: {round(x)} Y: {round(y)} Z: {round(z)}</Text>

        <Text style={styles.text}>Gyroscope:</Text>
        <Text style={styles.text}>pitch: {round(p)} roll: {round(r)} yaw: {round(w)}</Text>

        <Text style={styles.text}>Current Angles:</Text>
        <Text style={styles.text}>pitch: {round(this.state.gyroAngleP)} roll: {round(this.state.gyroAngleR)}</Text>

        <Text style={styles.text}>Final Angles:</Text>
        <Text style={styles.text}>X: {round(this.state.finalAngleX)} Y: {round(this.state.finalAngleY)}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressCollectData.bind(this)}>
          <Text style={styles.buttonText}>{this.state.startButtonText}</Text>
        </TouchableOpacity>

        <Text style={styles.text}>Accel Data Count: {this.state.accelDataX.length}</Text>
        <Text style={styles.text}>Posit Data Count: {this.state.positionDataX.length}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressTrackPosition.bind(this)}>
          <Text style={styles.buttonText}>Track Position Point</Text>
        </TouchableOpacity>

        <Text style={styles.text}>Position Point Count: {this.state.positionPoints.length}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressSendData.bind(this)}>
          <Text style={styles.buttonText}>Send Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.debug}
          onPress={this.onPressDebug.bind(this)}>
          <Text style={styles.buttonText}>DEBUG</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

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
  // Edit the position data based off of the timer (higher time = move to the closest point)
  let len = points.length;
  let thirdOfLen = Math.floor(len / 3);
  console.log(JSON.stringify(points));

  // Don't need to touch the first point
  for (let i = 1; i < len - 1; i++) {
    let currPoint = points[i];
    let currTime = times[i];

    // Now if currTime is relatively high, I need to move currPoint closer to a similar point with a lower time
    if (currPoint.x === 0 && currPoint.y === 0) {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#09a8cd',
    borderRadius: 10,
    margin: 10
  },
  debug: {
    backgroundColor: '#90d9ef',
    borderRadius: 10,
    margin: 40
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  text: {
    color: '#FFFFFF'
  }
});