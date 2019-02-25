import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo';
import AHRS from 'ahrs';

let INTERVAL = 100;

// TODO:
// figure out what the max acceleration is, don't go past that (cap it and absolute value)
// check for a drift

const madgwick = new AHRS({
  /*
  * The sample interval, in Hz.
  */
  sampleInterval: 20,

  /*
  * Choose from the `Madgwick` or `Mahony` filter.
  */
  algorithm: 'Madgwick',

  /*
  * The filter noise value, smaller values have
  * smoother estimates, but have higher latency.
  * This only works for the `Madgwick` filter.
  */
  beta: 0.4,

  /*
  * The filter noise values for the `Mahony` filter.
  */
  kp: 0.5,
  ki: 0,
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // accelDataX: [0.1, 0.5, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.3, 0.1],
      accelDataX: [],
      accelDataY: [],
      accelDataZ: [],
      velocDataX: [],
      velocDataY: [],
      velocDataZ: [],
      positionDataX: [],
      positionDataY: [],
      positionDataZ: [],
      gyroDataP: [],
      gyroDataR: [],
      gyroDataW: [],
      magDataX: [],
      magDataY: [],
      magDataZ: [],
      fusionDataX: [],
      fusionDataY: [],
      fusionDataZ: [],
      fusionVelocDataX: [],
      fusionVelocDataY: [],
      fusionVelocDataZ: [],
      fusionPositionDataX: [],
      fusionPositionDataY: [],
      fusionPositionDataZ: [],
      collectPoints: true,
      accelerometerData: {},
      gyroscopeData: {},
      magnetometerData: {},
      positionPoints: [{ x: 0, y: 0, z: 0 }],
      fusionPositionPoints: [{ x: 0, y: 0, z: 0 }],
      startButtonText: "Start Collecting Data"
    };
  }

  componentDidMount() {
    Accelerometer.setUpdateInterval(INTERVAL);
    Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
    });

    Gyroscope.setUpdateInterval(INTERVAL);
    Gyroscope.addListener(gyroscopeData => {
      this.setState({ gyroscopeData });
    });

    Magnetometer.setUpdateInterval(INTERVAL);
    Magnetometer.addListener(magnetometerData => {
      this.setState({ magnetometerData });
    });
  }

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
                              // Maybe - 2 here?
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
                              // Maybe - 2 here?
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

  findFusionPositionX() {
    let xAccel = this.state.fusionDataX.slice()
    let xVeloc = this.state.fusionVelocDataX.slice()
    let xPosit = this.state.fusionPositionDataX.slice();

    if (xAccel.length > 1) {
      xVeloc.push(xVeloc[xVeloc.length - 1] + xAccel[xAccel.length - 1]);
      xPosit.push(xPosit[xPosit.length - 1] + xVeloc[xVeloc.length - 1]);
      this.setState({ fusionVelocDataX: xVeloc, fusionPositionDataX: xPosit });
    } else {
      xVeloc.push(xAccel[0]);
      xPosit.push(xAccel[0]);
      this.setState({ fusionVelocDataX: xVeloc, fusionPositionDataX: xPosit });
    }
  }

  findFusionPositionY() {
    let yAccel = this.state.fusionDataY.slice()
    let yVeloc = this.state.fusionVelocDataY.slice()
    let yPosit = this.state.fusionPositionDataY.slice();

    if (yAccel.length > 1) {
      yVeloc.push(yVeloc[yVeloc.length - 1] + yAccel[yAccel.length - 1]);
      yPosit.push(yPosit[yPosit.length - 1] + yVeloc[yVeloc.length - 1]);
      this.setState({ fusionVelocDataY: yVeloc, fusionPositionDataY: yPosit });
    } else {
      yVeloc.push(yAccel[0]);
      yPosit.push(yAccel[0]);
      this.setState({ fusionVelocDataY: yVeloc, fusionPositionDataY: yPosit });
    }
  }

  findFusionPositionZ() {
    let zAccel = this.state.fusionDataZ.slice()
    let zVeloc = this.state.fusionVelocDataZ.slice()
    let zPosit = this.state.fusionPositionDataZ.slice();

    if (zAccel.length > 1) {
      zVeloc.push(zVeloc[zVeloc.length - 1] + zAccel[zAccel.length - 1]);
      zPosit.push(zPosit[zPosit.length - 1] + zVeloc[zVeloc.length - 1]);
      this.setState({ fusionVelocDataZ: zVeloc, fusionPositionDataZ: zPosit });
    } else {
      zVeloc.push(zAccel[0]);
      zPosit.push(zAccel[0]);
      this.setState({ fusionVelocDataZ: zVeloc, fusionPositionDataZ: zPosit });
    }
  }

  tick() {
    let { x, y, z } = this.state.accelerometerData;
    let { x: p, y: r, z: w } = this.state.gyroscopeData;
    let { x: mx, y: my, z: mz } = this.state.magnetometerData;

    // Offset for X: 0.007693737011237684
    let offX = 0.007693737011237684;
    // Offset for Y: 0.014534034165255541
    let offY = 0.014534034165255541;
    // Offset for Z: -0.9947027948689579;
    let offZ = -0.9947027948689579;

    // Drift for X: ?
    // Drift for Y: ?
    // Drift for Z: ?

    // Get the current xAcceleration
    let tempDataX = this.state.accelDataX.slice();
    tempDataX.push(x - offX);
    // tempDataX.push(x);

    // Get the current yAcceleration
    let tempDataY = this.state.accelDataY.slice();
    tempDataY.push(y - offY);
    // tempDataY.push(y);

    // Get the current zAcceleration
    let tempDataZ = this.state.accelDataZ.slice();
    // tempDataZ.push(z - offZ);
    // tempDataZ.push(z);
    tempDataZ.push(0);

    // // Get the current pitch
    // let tempDataP = this.state.gyroDataP.slice();
    // tempDataP.push(p);

    // // Get the current roll
    // let tempDataR = this.state.gyroDataR.slice();
    // tempDataR.push(r);

    // // Get the current yaw
    // let tempDataW = this.state.gyroDataW.slice();
    // tempDataW.push(w);

    // // Get the current xMagnetometer
    // let tempDataMX = this.state.magDataX.slice();
    // tempDataMX.push(mx);

    // // Get the current yMagnetormeter
    // let tempDataMY = this.state.magDataY.slice();
    // tempDataMY.push(my);

    // // Get the current zMagnetormeter
    // let tempDataMZ = this.state.magDataZ.slice();
    // tempDataMZ.push(mz);

    // Get all of the fusion data
    madgwick.update(p, r, w, x, y, z, mx, my, mz);
    let madgwickData = madgwick.toVector();

    let tempMadgwickX = this.state.fusionDataX.slice();
    tempMadgwickX.push(madgwickData.x);
    let tempMadgwickY = this.state.fusionDataY.slice();
    tempMadgwickY.push(madgwickData.y);
    let tempMadgwickZ = this.state.fusionDataZ.slice();
    tempMadgwickZ.push(madgwickData.z);

    // Update accelData, gyroData, magData, and fusionData states
    this.setState({
      accelDataX: tempDataX, accelDataY: tempDataY, accelDataZ: tempDataZ,
      // gyroDataP: tempDataP, gyroDataR: tempDataR, gyroDataW: tempDataW,
      // magDataX: tempDataMX, magDataY: tempDataMY, magDataZ: tempDataMZ,
      fusionDataX: tempMadgwickX, fusionDataY: tempMadgwickY, fusionDataZ: tempMadgwickZ
    });


    // Calculate the positions based off of JUST the accelerometer
    this.findPositionX();
    this.findPositionY();
    this.findPositionZ();

    // Calculate the positions based off of sensor fusion
    this.findFusionPositionX();
    this.findFusionPositionY();
    this.findFusionPositionZ();
  }

  onPressCollectData() {
    if (this.state.collectPoints) {
      this.intervalObj = setInterval(this.tick.bind(this), INTERVAL);
      this.setState({ startButtonText: "Stop Collecting Accel Data" });
    }
    else {
      clearInterval(this.intervalObj);
      this.setState({ startButtonText: "Start Collecting Accel Data" });
    }
    // Do this at the end because it doesn't change state quick enough
    this.setState({ collectPoints: !this.state.collectPoints });
  }

  onPressPrintPositions() {
    let avgX = 0;
    let avgY = 0;
    let avgZ = 0;
    let len = this.state.accelDataX.length;

    // for(let i = 0; i < len; i++) {
    //   avgX += this.state.accelDataX[i];
    //   avgY += this.state.accelDataY[i];
    //   avgZ += this.state.accelDataZ[i];
    // }

    let xAccel = this.state.accelDataX.slice();
    let xVeloc = this.state.velocDataX.slice();
    let xPosit = this.state.positionDataX.slice();

    for (let i = 0; i < len; i++) {
      // New / Smart Way
      if (i > 1) {
        xVeloc.push(xVeloc[i - 1] + xAccel[i - 1] + ((xAccel[i] - xAccel[i - 1])>>1));
        xPosit.push(xPosit[i - 1] + xVeloc[i - 1] + ((xVeloc[i] - xVeloc[i - 1])>>1));
      } else {
        xVeloc.push(xAccel[i]);
        xPosit.push(xAccel[i]);
      }

      // Dumb Way
      // if (i > 1) {
      //   xVeloc.push(xVeloc[i - 1] + (xAccel[i] - xAccel[i - 1]));
      //   xPosit.push(xPosit[i - 1] + xVeloc[i]);
      // } else {
      //   xVeloc.push(xAccel[i]);
      //   xPosit.push(xAccel[i]);
      // }

      this.setState({ velocDataX: xVeloc, positionDataX: xPosit });
    }

    console.log("\nxAccel: " + xAccel)
    console.log("\nxVeloc: " + xVeloc)
    console.log("\nxPosit: " + xPosit)

    console.log("\nAccel Data (X): ");
    for(let i = 0; i < len; i++) {
      console.log(xAccel[i]);
    }

    console.log("\nVeloc Data (X): ");
    for(let i = 0; i < len; i++) {
      console.log(xVeloc[i]);
    }

    console.log("\nPosit Data (X): ");
    for(let i = 0; i < len; i++) {
      console.log(xPosit[i]);
    }

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
  }

  onPressTrackPosition() {
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

    // fetch('http://153.106.88.248:3000/',{
    //fetch('http://172.20.10.2:3000/',{
    fetch('http://10.0.0.44:3000/', {
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
    let { x: mx, y: my, z: mz } = this.state.magnetometerData;

    return (
      <View style={styles.container}>
        <Text>Accelerometer:</Text>
        <Text>x: {round(x)} y: {round(y)} z: {round(z)}</Text>

        {/* <Text>Gyroscope:</Text>
        <Text>pitch: {round(p)} roll: {round(r)} yaw: {round(w)}</Text>

        <Text>Magnetometer:</Text>
        <Text>x: {round(mx)} y: {round(my)} z: {round(mz)}</Text> */}

        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressCollectData.bind(this)}>
          <Text style={styles.buttonText}>{this.state.startButtonText}</Text>
        </TouchableOpacity>

        <Text>Accel Data Count: {this.state.accelDataX.length}</Text>
        <Text>Posit Data Count: {this.state.positionDataX.length}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressTrackPosition.bind(this)}>
          <Text style={styles.buttonText}>Track Position Point</Text>
        </TouchableOpacity>

        <Text>Position Point Count: {this.state.positionPoints.length}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressPrintPositions.bind(this)}>
          <Text style={styles.buttonText}>Print Positions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressSendData.bind(this)}>
          <Text style={styles.buttonText}>Send Data</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#52B7BD',
    borderRadius: 10,
    margin: 5
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});