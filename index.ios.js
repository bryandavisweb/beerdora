'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';
const firebase = require('firebase');
const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');
const styles = require('./styles.js')

import { View, ListView, StyleSheet, Text, AppRegistry, AlertIOS } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyA66auzmukVb4KnsZzidjYdYNuwy3ZvvxM",
  authDomain: "beer-dora.firebaseapp.com",
  databaseURL: "beer-dora.firebaseio.com",
  storageBucket: "gs://beer-dora.appspot.com/",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

class BeerDora extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.itemsRef = firebaseApp.database().ref();
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar title="Grocery List" />
        <ListView 
          style={styles.listview} 
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
        />
        <ActionButton onPress={this._addItem.bind(this)} title="Add" />
      </View>
    );
  }

  _addItem() {
    AlertIOS.prompt(
      'Add New Item',
      null,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {
          text: 'Add',
          onPress: (text) => {
            this.itemsRef.push({ title: text })
          }
        },
      ],
      'plain-text'
    );
  }

  _renderItem(item) {
    return (
      <ListItem item={item} onpress="{() ==''> {}}" />
    );
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        });
      });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });
    });
  }
}

AppRegistry.registerComponent('BeerDora', () => BeerDora);
