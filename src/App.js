import React from 'react'
import './App.css'
import { Network } from './components/Network'

import { TxMetadata } from './components/TxMetadata'
import { Deploy } from './components/Deploy'
import { ContractList } from './components/ContractList'

function App() {
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

export default App;
