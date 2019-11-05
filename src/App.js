import React from 'react'
import './App.css'
import { Network } from './components/Network'

import { TxMetadata } from './components/TxMetadata'
import { Deploy } from './components/Deploy'
import { ContractList } from './components/ContractList'
import { appStyle, logoStyle } from './utils/Styles'
import { Error } from './components/Error'

function App() {
  return (
    <div style={appStyle} className="App">
      <Error/>
      <Network/>
      <TxMetadata/>
      <br/>
      <Deploy/>
      <br/>
      <ContractList/>
      <div style={{ flexGrow: 1 }}/>
      <img style={logoStyle} src={'logo.png'} alt="Quorum Logo"/>
    </div>
  );
}

export default App;
