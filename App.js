import React, {Component} from 'react'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import ArgyleSdk from '@argyleio/argyle-plugin-react-native'

const TOKEN_KEY = 'userKey'

const storeData = async token => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token)
  } catch (e) {
    // saving error
    console.log('error saving value', e)
  }
}

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem(TOKEN_KEY)
    if (value !== null) {
      // value previously stored
    }
    return value
  } catch (e) {
    // error reading value
    console.log('error reading value', e)
    return null
  }
}
export default class App extends Component<{}> {
  async componentDidMount() {
    let token = ''
    const value = await getData()

    console.log('VALUE ', value)

    if (value !== null) {
      token = value
    }

    ArgyleSdk.loginWith('YOUR_PLUGIN_KEY', 'https://api-sandbox.argyle.io', token)
    ArgyleSdk.onUserCreated(res => {
      console.log('onUserCreated', res)
      storeData(res.token)
    })

    ArgyleSdk.onAccountCreated(res => console.log('onAccountCreated', res))
    ArgyleSdk.onAccountConnected(res => console.log('onAccountConnected', res))
    ArgyleSdk.onAccountUpdated(res => console.log('onAccountUpdated', res))
    ArgyleSdk.onAccountRemoved(res => console.log('onAccountRemoved', res))
    ArgyleSdk.onAccountError(res => console.log('onAccountError', res))
    ArgyleSdk.onError(error => {
      console.log('onError', error)
      if (error === ArgyleSdk.errorCodes.EXPIRED_TOKEN) {
        setTimeout(() => {
          // Simulated timeout before updating the token
          ArgyleSdk.updateToken('YOUR_NEW_TOKEN')
        }, 300)
      }
    })
    ArgyleSdk.onTokenExpired(res => console.log('onTokenExpired', res))
    ArgyleSdk.onClose(() => console.log('onClose'))

    // ArgyleSdk.dataPartners(["uber", "postmates"])
  }

  startNew = () => {
    ArgyleSdk.updateToken('')
    ArgyleSdk.start()
  }

  startExisting = async () => {
    ArgyleSdk.start()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>📱️ Argyle Link SDK️</Text>
        <TouchableOpacity onPress={this.startNew}>
          <Text style={styles.welcome}>Start new</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.startExisting}>
          <Text style={styles.welcome}>Start existing</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})
