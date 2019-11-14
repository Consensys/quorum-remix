import { buildIframeClient, PluginClient } from '@remixproject/plugin'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { rootReducer } from './reducers'
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import {
  addPublicKey,
  connectToNetwork,
  fetchCompilationResult
} from './actions'

class QuorumPlugin extends PluginClient {

}

const store = createStore(rootReducer,
  composeWithDevTools(applyMiddleware(thunk)))

const client = buildIframeClient(new QuorumPlugin())
client.onload(async () => {
  ReactDOM.render(
    <Provider store={store}>
      <App client={client}/>
    </Provider>,
    document.getElementById('root'))

  initPlugin(client, store.dispatch)
  .catch((e) => console.error('Error initializing plugin', e))
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
});

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default
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

// we only want to subscribe to these once, so we do it outside of components
async function initPlugin (client, dispatch) {
  if(process.env.NODE_ENV === 'development') {
    await initDev(client, dispatch)
  }

  const savedNetwork = JSON.parse(localStorage.network || '{}')
  dispatch(
    connectToNetwork(savedNetwork.endpoint, savedNetwork.tesseraEndpoint))

  const savedPublicKeys = JSON.parse(localStorage.keysFromUser || '[]')
  savedPublicKeys.forEach((key) => dispatch(addPublicKey(key)))

  dispatch(fetchCompilationResult(client))
  client.solidity.on('compilationFinished',
    (fileName, source, languageVersion, data) => {
      // just refetching every time for now
      dispatch(fetchCompilationResult(client))
    })
}

async function initDev (client) {
  console.log('In development mode, adding 7nodes network')
  await client.network.addNetwork(
    { id: 10, name: 'quorum-examples-node-1', url: 'http://localhost:22000' })
}
