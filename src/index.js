import { buildIframeClient, PluginClient } from '@remixproject/plugin'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import rootReducer from './reducers'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { devToolsEnhancer } from 'redux-devtools-extension'

const profile = {
  name: 'quorum',
  displayName: 'Quorum Support',
  description: 'Enables support for deploying and interacting with contracts on a Quorum network. Private transaction ',
  events: [],
  methods: [],
  notifications: {
    solidity: ['compilationFinished'],
    network: ['providerChanged']
  },
  url: 'http://localhost:3000',
  icon: 'data:image/svg+xml,%3Csvg id=\'Layer_1\' data-name=\'Layer 1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1451.59 772.43\'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bopacity:0.2;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3EQ_Primary-Logo%3C/title%3E%3Cg class=\'cls-1\'%3E%3Cpath d=\'M1405,679.07a46.64,46.64,0,0,0-46.64,46.63v.1A46.64,46.64,0,1,0,1405,679.07Z\'/%3E%3Cpath d=\'M889.85,114.75A46.64,46.64,0,0,0,914,24.65l-.64-.17a46.64,46.64,0,0,0-23.49,90.27Z\'/%3E%3Cpath d=\'M1042,177.83l.37.21a46.3,46.3,0,1,0-.37-.21Z\'/%3E%3Cpath d=\'M1173.17,278.65a46.64,46.64,0,1,0,66-66l-.13-.12a46.63,46.63,0,0,0-66,65.95Z\'/%3E%3Cpath d=\'M1354.45,362.84a46.63,46.63,0,1,0-80.81,46.57l.21.37a46.64,46.64,0,0,0,80.6-46.94Z\'/%3E%3Cpath d=\'M1394.1,595.1A46.64,46.64,0,0,0,1427,538l0-.17a46.64,46.64,0,1,0-90.08,24.2l0,.17a46.58,46.58,0,0,0,57.14,32.94Z\'/%3E%3Cpath d=\'M1239.21,679.07a46.64,46.64,0,0,0-46.64,46.63v.1a46.64,46.64,0,1,0,46.64-46.73Z\'/%3E%3Cpath d=\'M1154.87,365.85a46.64,46.64,0,0,0-72,59.34l.72.87a46.64,46.64,0,0,0,71.24-60.21Z\'/%3E%3Cpath d=\'M1023,304.68a46.64,46.64,0,0,0-16.79-63.79l-.66-.38A46.64,46.64,0,1,0,1023,304.68Z\'/%3E%3Cpath d=\'M1224.55,594a46.72,46.72,0,1,0-60.24-28.56c.11.32.23.65.35,1A46.58,46.58,0,0,0,1224.55,594Z\'/%3E%3Cpath d=\'M682.8,212A46.83,46.83,0,1,0,644.72,266l.29,0A46.6,46.6,0,0,0,682.8,212Z\'/%3E%3Cpath d=\'M1073.46,679.07a46.64,46.64,0,0,0-46.64,46.63v.1a46.64,46.64,0,1,0,46.64-46.73Z\'/%3E%3Cpath d=\'M1050.18,592.46a46.63,46.63,0,0,0,17.24-63.66l-.38-.65a46.64,46.64,0,1,0-16.86,64.31Z\'/%3E%3C/g%3E%3Cpath d=\'M726,93.27h.18a46.64,46.64,0,1,0,0-93.27H726a46.64,46.64,0,1,0,0,93.27Z\'/%3E%3Cpath d=\'M550.16,116.21a46.39,46.39,0,0,0,11.66-1.49l.64-.17a46.56,46.56,0,1,0-12.3,1.66Z\'/%3E%3Cpath d=\'M386.45,184a46.38,46.38,0,0,0,23.24-6.24l.37-.21A46.62,46.62,0,1,0,386.45,184Z\'/%3E%3Cpath d=\'M245.78,292a46.48,46.48,0,0,0,33-13.66l.12-.12a46.64,46.64,0,1,0-65.95-66l-.13.13a46.64,46.64,0,0,0,33,79.61Z\'/%3E%3Cpath d=\'M81.87,504.36a46.74,46.74,0,1,0,32.85,57.48l.09-.34A46.63,46.63,0,0,0,81.87,504.36Z\'/%3E%3Cpath d=\'M178,409.36l.21-.37a46.08,46.08,0,1,0-.21.37Z\'/%3E%3Cpath d=\'M46.64,679.11A46.66,46.66,0,1,0,93.27,725.8v-.1A46.6,46.6,0,0,0,46.64,679.11Z\'/%3E%3Cpath d=\'M368.31,425.65a46.64,46.64,0,0,0-71.13-60.35l-.44.54a46.64,46.64,0,0,0,71.57,59.81Z\'/%3E%3Cpath d=\'M823.29,174.21l-.29-.05a46.64,46.64,0,0,0-16,91.9h.07a47.3,47.3,0,0,0,8.16.72,46.65,46.65,0,0,0,8-92.58Z\'/%3E%3Cpath d=\'M509.63,257.43a46.79,46.79,0,1,0-17.73,64.32l1-.54A46.63,46.63,0,0,0,509.63,257.43Z\'/%3E%3Cpath d=\'M259.52,506a46.63,46.63,0,0,0-59.9,27.59c-.12.33-.24.65-.35,1A46.64,46.64,0,1,0,259.52,506Z\'/%3E%3Cpath d=\'M212.39,679.11A46.66,46.66,0,1,0,259,725.8v-.1A46.6,46.6,0,0,0,212.39,679.11Z\'/%3E%3Cpath d=\'M726,331.5h-.19a46.64,46.64,0,1,0,0,93.27H726a46.64,46.64,0,0,0,0-93.27Z\'/%3E%3Cpath d=\'M923.05,384.32a46.64,46.64,0,0,0-47.17,80.47l.65.38a46.64,46.64,0,0,0,46.52-80.85Z\'/%3E%3Cpath d=\'M528.9,384.11l-.36.21A46.64,46.64,0,1,0,575.29,465h0a46.64,46.64,0,0,0-46.42-80.91Z\'/%3E%3Cpath d=\'M448,511.3a46.74,46.74,0,1,0,16.87,64.29l.38-.65A46.62,46.62,0,0,0,448,511.3Z\'/%3E%3Cpath d=\'M378.14,679.11a46.66,46.66,0,1,0,46.63,46.69v-.1A46.6,46.6,0,0,0,378.14,679.11Z\'/%3E%3C/svg%3E',
  location: 'sidePanel'
}

class QuorumPlugin extends PluginClient {

}

const store = createStore(rootReducer, devToolsEnhancer())

const client = buildIframeClient(new QuorumPlugin())
client.onload(async () => {
  ReactDOM.render(
    <Provider store={store}>
      <App client={client}/>
    </Provider>,
    document.getElementById('root'))

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  await client.network.addNetwork(
      {id: 10, name: "quorum-examples-node-1", url: "http://localhost:22000"})
  serviceWorker.unregister();
});

if (module.hot) {
  console.log('hot')
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    ReactDOM.render(
      <Provider store={store}>
        <NextApp client={client}/>
      </Provider>,
      document.getElementById('root')
    )
  })
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers').default
    store.replaceReducer(nextRootReducer)
  })
}
