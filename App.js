import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Accelerometer } from 'expo';

let INTERVAL = 100;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accelDataX: [],
      accelDataY: [],
      accelDataZ: [],
      velocDataX: [],
      velocDataY: [],
      velocDataZ: [],
      positionDataX: [],
      positionDataY: [],
      positionDataZ: [],
      points: 0,
      accelerometerData: {},
      positionPoints: [{x: 0, y: 0, z: 0}],
      startButtonText: "Start Collecting Accel Data"
    };
  }

  componentDidMount() {
    Accelerometer.setUpdateInterval(100);
    Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
    });
  }

  findPositionX() {
    // let xAccel = this.state.accelDataX;
    // let xVeloc = this.state.velocDataX;
    // if (xAccel.length > 2) {
    //   let prevAccel = xAccel[xAccel.length - 3];
    //   let prevVeloc = (prevAccel + xAccel[xAccel.length - 2]) / 2;
    //   xVeloc.push(prevVeloc);
    //   prevAccel = xAccel[xAccel.length - 2];

    //   xVeloc.push((prevAccel + xAccel[xAccel.length - 1]) / 2);
    //   this.setState({velocDataX: xVeloc});
    //   return (prevVeloc + xVeloc[xVeloc.length - 1]) / 2;
    // }

    // return 0;

    let xAccel = this.state.accelDataX.slice();
    let xVeloc = this.state.velocDataX.slice();
    let xPosit = this.state.positionDataX.slice();
    if (xAccel.length > 1) {
      xVeloc.push(xVeloc[xVeloc.length - 1] + xAccel[xAccel.length - 1]);
      xPosit.push(xPosit[xPosit.length - 1] + xVeloc[xVeloc.length - 1]);
      this.setState({velocDataX: xVeloc, positionDataX: xPosit});
    } else {
      xVeloc.push(xAccel[0]);
      xPosit.push(xAccel[0]);
      this.setState({velocDataX: xVeloc, positionDataX: xPosit});
    }
  }

  findPositionY() {
    let yAccel = this.state.accelDataY.slice();
    let yVeloc = this.state.velocDataY.slice();
    let yPosit = this.state.positionDataY.slice();
    if (yAccel.length > 1) {
      yVeloc.push(yVeloc[yVeloc.length - 1] + yAccel[yAccel.length - 1]);
      yPosit.push(yPosit[yPosit.length - 1] + yVeloc[yVeloc.length - 1]);
      this.setState({velocDataY: yVeloc, positionDataY: yPosit});
    } else {
      yVeloc.push(yAccel[0]);
      yPosit.push(yAccel[0]);
      this.setState({velocDataY: yVeloc, positionDataY: yPosit});
    }
  }

  findPositionZ() {
    let zAccel = this.state.accelDataZ.slice();
    let zVeloc = this.state.velocDataZ.slice();
    let zPosit = this.state.positionDataZ.slice();
    if (zAccel.length > 1) {
      zVeloc.push(zVeloc[zVeloc.length - 1] + zAccel[zAccel.length - 1]);
      zPosit.push(zPosit[zPosit.length - 1] + zVeloc[zVeloc.length - 1]);
      this.setState({velocDataZ: zVeloc, positionDataZ: zPosit});
    } else {
      zVeloc.push(zAccel[0]);
      zPosit.push(zAccel[0]);
      this.setState({velocDataZ: zVeloc, positionDataZ: zPosit});
    }
  }

  tick() {
    let { x, y, z } = this.state.accelerometerData;

    // Get the current xAcceleration
    let tempDataX = this.state.accelDataX.slice();
    tempDataX.push(x);

    // Get the current yAcceleration
    let tempDataY = this.state.accelDataY.slice();
    tempDataY.push(y);

    // Get the current zAcceleration
    let tempDataZ = this.state.accelDataZ.slice();
    tempDataZ.push(z);

    // Update accelData state
    this.setState({accelDataX: tempDataX, accelDataY: tempDataY, accelDataZ: tempDataZ})

    // Calculate the xPosition
    this.findPositionX();

    // Calculate the yPosition
    this.findPositionY();

    // Calculate the zPosition
    this.findPositionZ();
  }

  onPressCollectData() {
    if (this.state.points === 0) {
      this.intervalObj = setInterval(this.tick.bind(this), INTERVAL);
      this.setState({startButtonText: "Stop Collecting Accel Data"});
    }
    else {
      clearInterval(this.intervalObj);
      this.setState({startButtonText: "Start Collecting Accel Data"});
    }
    this.setState({points: this.state.points + 1});
  }

  onPressCalculateDistance() {
    console.log("Accel Data: " + this.state.accelDataX.join(",") + "\n");
    console.log("Position Data: " + this.state.positionDataX.join(",") + "\n");

    // console.log("xStartingPosition: " + this.state.positionDataX[2]);
    // console.log("xFinalPosition (From REAL-TIME Calculations): " + this.state.totalPositionX);
    // console.log("yStartingPosition: " + this.state.positionDataY[2]);
    // console.log("yFinalPosition (From REAL-TIME Calculations): " + this.state.totalPositionY);
    // console.log("zStartingPosition: " + this.state.positionDataZ[2]);
    // console.log("zFinalPosition (From REAL-TIME Calculations): " + this.state.totalPositionZ);

    console.log("Position Points: " + JSON.stringify(this.state.positionPoints));
    let newDataFormat = arrayToJson(this.state.positionPoints);
    console.log("X: " + newDataFormat.x.join(",") + "\n");
    console.log("Y: " + newDataFormat.y.join(",") + "\n");
    console.log("Z: " + newDataFormat.z.join(",") + "\n");
  }

  onPressTrackPosition() {
    let tempPoints = this.state.positionPoints.slice();
    tempPoints.push(
      {
        x: this.state.positionDataX[this.state.positionDataX.length - 1],
        y: this.state.positionDataY[this.state.positionDataY.length - 1],
        z: this.state.positionDataZ[this.state.positionDataZ.length - 1]
      }
    );
    this.setState({positionPoints: tempPoints});
  }

  onPressSendData() {
    //fetch('http://172.20.10.2:3000/',{
    fetch('http://10.0.0.44:3000/',{
      method: 'POST',
      body: JSON.stringify(arrayToJson(this.state.positionPoints)),
      headers: {"Content-Type": "application/json"}
    })
    .then(function(response){
    return response.json()
    }).catch(error => console.log(error));
  }

  render() {
    let { x, y, z } = this.state.accelerometerData;
    return (
      <View style={styles.container}>
        <Text>Accelerometer:</Text>
        <Text>x: {round(x)} y: {round(y)} z: {round(z)}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressCollectData.bind(this)}>
          <Text style={styles.buttonText}>{this.state.startButtonText}</Text>
        </TouchableOpacity>

        <Text>DataX: {this.state.accelDataX.length}</Text>
        <Text>DataY: {this.state.accelDataY.length}</Text>
        <Text>DataZ: {this.state.accelDataZ.length}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressTrackPosition.bind(this)}>
          <Text style={styles.buttonText}>Track Position Point</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressCalculateDistance.bind(this)}>
          <Text style={styles.buttonText}>Print Position</Text>
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

  for(let i = 0; i < objects.length; i++) {
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
    backgroundColor:'#52B7BD',
    borderRadius:10,
    margin: 5
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});
