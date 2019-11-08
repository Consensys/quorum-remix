import React from 'react'
import './App.css'
import { Network } from './components/Network'

import { TxMetadata } from './components/TxMetadata'
import { Deploy } from './components/Deploy'
import { ContractList } from './components/ContractList'
import { appStyle, footerStyle, logoStyle } from './utils/Styles'
import { Error } from './components/Error'
import { useSelector } from 'react-redux'

function App() {
  const isConnected = useSelector(
    state => state.network.status !== 'Disconnected')

  return (
    <div style={appStyle} className="App">
      <Error/>
      <Network/>
      {isConnected && <TxMetadata/>}
      <br/>
      {isConnected && <Deploy/>}
      <br/>
      {isConnected && <ContractList/>}
      <div style={{ flexGrow: 1 }}/>
      <Footer/>
    </div>
  );
}

function Footer () {
  console.log(process.env)
  return <div style={footerStyle}>
    <div>v{process.env.REACT_APP_VERSION}</div>
    <img style={logoStyle} src={'logo.png'} alt="Quorum Logo"/>
  </div>
}

export default App;
