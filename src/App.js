import React from 'react'
import './App.css'
import { Network } from './components/Network'

import { TxMetadata } from './components/TxMetadata'
import { Deploy } from './components/Deploy'
import { ContractList } from './components/ContractList'
import { useDispatch } from 'react-redux'
import { fetchCompilationSuccess, fetchNetworkSuccess } from './actions'

function App({client}) {
  const dispatch = useDispatch()

  React.useEffect(() => {
    initPlugin(client, dispatch)
    .catch((e) => console.error('Error initializing plugin', e))
  }, [])

  return (
      <div className="App">
        <Network/>
        <TxMetadata/>
        <br/>
        <Deploy/>
        <br/>
        <ContractList />
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

  fetchCompilationResult(client, dispatch)
  client.solidity.on('compilationFinished',
    (fileName, source, languageVersion, data) => {
      console.log("compilation finished", fileName, source, languageVersion, data)
      // Do something
      fetchCompilationResult(client, dispatch)
    });
}

async function fetchAccounts (client) {
  let accounts = await client.udapp.getAccounts()
  return (typeof accounts === 'string') ? [accounts] : accounts
}

async function fetchCompilationResult (client, dispatch) {
  try {
    const result = await client.solidity.getCompilationResult()
    dispatch(fetchCompilationSuccess(result))
  } catch (e) {
    console.log('error getting compilation result', e)
  }
}

async function fetchNetworkData (client, dispatch) {
  try {
    console.log('Fetching network data')
    const provider = await client.network.getNetworkProvider()
    const details = await client.network.detectNetwork()
    let endpoint = ''
    if (provider === 'web3') {
      endpoint = await client.network.getEndpoint()
    }
    // accounts are updated on each network change, so it makes sense to grab
    // them together
    const accounts = await fetchAccounts(client)
    dispatch(fetchNetworkSuccess(provider, details, endpoint, accounts))
  } catch (e) {
    console.error('Error fetching network data', e)
  }
}

export default App;
