import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
} from 'react-native';

import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';

export default class example extends Component {
  componentDidMount() {
    fetch('https://kmcraiova.azurewebsites.net/api/negotiate')
    .then((response) => response.json())
    .then((info) => {
      // return responseJson.movies;
      console.log(info);
      const options = {
        accessTokenFactory: () => info.accessToken
      };

      let hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(info.url, options)
                .configureLogging(signalR.LogLevel.Information)
                .build();

      hubConnection.start().catch(err => console.error(err.toString()));

      hubConnection.on('draw', (data) => {
        console.log(JSON.parse(data));
        //this.lines.next(data);
        this.refs.canvas.addPath(JSON.parse(data));
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <SketchCanvas
            ref="canvas"
            style={{ flex: 1 }}
            strokeColor={'red'}
            strokeWidth={7}
            onStrokeEnd={(data)=> {
              fetch('https://kmcraiova.azurewebsites.net/api/draw', {
                method: 'POST',
                body: JSON.stringify(data),
              });
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('example', () => example);