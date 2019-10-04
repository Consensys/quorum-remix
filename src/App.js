import React, { useEffect, useState } from 'react'
import './App.css'
import Web3 from 'web3'
import { Network } from './components/Network'
import { Store } from './Store'

function App({client}) {
  const { state, dispatch } = React.useContext(Store)

  React.useEffect(() => {
    initPlugin(client, dispatch)
    .catch((e) => console.error('Error initializing plugin', e))
  }, [])

  return (
      <div className="App">
        <Network />
      </div>
  );
}

const fetchNetworkData = async (client, dispatch) => {
  try {
    console.log('Fetching network data')
    const provider = await client.network.getNetworkProvider()
    const details = await client.network.detectNetwork()
    let endpoint = 'n/a'
    if (provider === 'web3') {
      endpoint = await client.network.getEndpoint()
    }
    dispatch({
      type: 'FETCH_NETWORK',
      payload: {
        provider,
        details,
        endpoint,
      }
    })
  } catch (e) {
    console.error('Error fetching network data', e)
  }
}

async function initPlugin (client, dispatch) {
  fetchNetworkData(client, dispatch)
  client.network.on('providerChanged',
    (_) => {
      console.log('Network changed')
      fetchNetworkData(client, dispatch)
    })
}


export default App;
