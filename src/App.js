import React from 'react'
import './App.css'
import { Network } from './components/Network'

import { TxMetadata } from './components/TxMetadata'
import { Deploy } from './components/Deploy'
import { ContractList } from './components/ContractList'
import { useSelector } from 'react-redux'

const DEPLOY_AND_RUN_ICON = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzFfY29weSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4Ig0KCSB5PSIwcHgiIHdpZHRoPSI3NDIuNTQ1cHgiIGhlaWdodD0iNjc2Ljg4NnB4IiB2aWV3Qm94PSIwIC0wLjIwNCA3NDIuNTQ1IDY3Ni44ODYiDQoJIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAtMC4yMDQgNzQyLjU0NSA2NzYuODg2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwb2x5Z29uIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBwb2ludHM9IjI5NS45MTEsMC43MTEgNDg4LjkxMSwzMDQuMTg2IDQ4OC45MTEsMzk3LjE4MSAyOTMuOTExLDY3Ni41NTYgDQoJCTc0MS43ODYsMzQ5Ljk0MyAJIi8+DQoJPHBvbHlnb24gc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50cz0iNDE3LjA4Myw0MDYuNTg5IDIwOS43OTEsNTE5LjQ5NCAxLjg0Niw0MDYuMjM0IDIwOS43OTEsNjc1Ljg2MyAJIi8+DQoJPHBvbHlnb24gc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50cz0iNDE3LjA4MywzMTguNzA3IDIwOS43OTEsMC43MTEgMS44NDYsMzE4LjQyOCAyMDkuNzkxLDQzMS42ODkgCSIvPg0KPC9nPg0KPC9zdmc+DQo="

function App() {
  const provider = useSelector(state => state.network.provider)

  if(provider !== 'web3') {
    return <div className="App">
      Quorum support does not work on Javascript&nbsp;VM or Injected&nbsp;Web3.
      <br/>
      <br/>
      <strong>
        Please choose a different Environment from the Deploy & Run Tab <img style={{height: 13, verticalAlign: "baseline"}}src={DEPLOY_AND_RUN_ICON} />
      </strong>
    </div>
  }

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
