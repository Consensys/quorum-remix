import React from 'react'
import './App.css'
import { Network } from './components/Network'
import { Store } from './Store'
import { TxMetadata } from './components/TxMetadata'

function App({client}) {
  const { dispatch } = React.useContext(Store)

  React.useEffect(() => {
    initPlugin(client, dispatch)
    .catch((e) => console.error('Error initializing plugin', e))
  }, [])

  return (
      <div className="App">
        <Network/>
        <br/>
        <TxMetadata/>
      </div>
  );
}

async function initPlugin (client, dispatch) {
  fetchNetworkData(client, dispatch)
  client.network.on('providerChanged',
    (_) => {
      console.log('Network changed')
      fetchNetworkData(client, dispatch)
    })
}

async function fetchAccounts (client) {
  let accounts = await client.udapp.getAccounts()
  return (typeof accounts === 'string') ? [accounts] : accounts
}

async function fetchNetworkData (client, dispatch) {
  try {
    console.log('Fetching network data')
    const provider = await client.network.getNetworkProvider()
    const details = await client.network.detectNetwork()
    let endpoint = 'n/a'
    if (provider === 'web3') {
      endpoint = await client.network.getEndpoint()
    }
    // accounts are updated on each network change, so it makes sense to grab
    // them together
    const accounts = await fetchAccounts(client)
    dispatch({
      type: 'FETCH_NETWORK',
      payload: {
        provider,
        details,
        endpoint,
        accounts,
      }
    })
  } catch (e) {
    console.error('Error fetching network data', e)
  }
}

export default App;
