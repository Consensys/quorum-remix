import React from 'react'
import './App.css'
import { Network } from './Network'

import { TxMetadata } from './TxMetadata'
import { Deploy } from './Deploy'
import { ContractList } from './ContractList'
import {
  appStyle,
  footerStyle,
  logoLinkStyle,
  logoStyle,
} from '../utils/Styles'
import { Error } from './Error'
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
  const gitHash = process.env.REACT_APP_GIT_SHA
  return <div style={footerStyle} id="footer">
    <a style={logoLinkStyle} href={"https://goquorum.com"} target="_black">
      <img style={logoStyle} src={'logo.png'} alt="Quorum Logo"/>
    </a>
    <div>
      <a href={"https://medium.com/remix-ide/quorum-plugin-for-remix-ee232ebca64c"} rel="noopener noreferrer" target="_blank">Help</a>
      {' | '}
      <a href={`https://github.com/jpmorganchase/quorum-remix/tree/${gitHash}`} rel="noopener noreferrer" target="_blank">Version</a>
    </div>
  </div>
}

export default App;
