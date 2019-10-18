import { buildIframeClient, PluginClient } from '@remixproject/plugin'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import rootReducer from './reducers'
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { fetchCompilationResult, fetchNetworkData } from './actions'

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

  await client.network.addNetwork(
    { id: 10, name: 'quorum-examples-node-1', url: 'http://localhost:22000' })

  initPlugin(client, store.dispatch)
  .catch((e) => console.error('Error initializing plugin', e))
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
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

// we only want to subscribe to these once, so we do it outside of components
async function initPlugin (client, dispatch) {
  dispatch(fetchNetworkData(client))
  client.network.on('providerChanged',
    (_) => {
      console.log('Network changed')
      dispatch(fetchNetworkData(client))
    })

  dispatch(fetchCompilationResult(client))
  client.solidity.on('compilationFinished',
    (fileName, source, languageVersion, data) => {
      console.log('compilation finished', fileName, source, languageVersion,
        data)
      // Do something
      dispatch(fetchCompilationResult(client))
    })
}
