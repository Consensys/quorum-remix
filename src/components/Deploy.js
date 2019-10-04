import { Store } from '../Store'
import React, { useEffect } from 'react'
import { Constructor } from './Constructor'

export function Deploy() {
  const { state, dispatch } = React.useContext(Store)
  const { compilation: {
    contracts,
    selectedContract,
  }} = state

  const onChangeContract = (contractName) => {
    dispatch({ type: 'SELECT_CONTRACT', payload: contractName })
  }

  useEffect(() => {
    // maybe a better way to do this, but select the first contract if unset or
    // if selected contract is no longer in the list of contracts
    if (!(selectedContract in contracts)) {
      onChangeContract(Object.keys(contracts)[0])
    }
  }, [contracts])


  return <div>
    <div>Compiled Contracts:</div>
    <select defaultValue={selectedContract} onChange={(e) => onChangeContract(e.target.value)}>
      {Object.entries(contracts).map(
        ([name, data]) => <option key={name} value={name}>{name}</option>)}
    </select>
    {contracts[selectedContract] &&
    <Constructor
      onDeploy={(params) => console.log('onDeploy', params)}
      onExisting={(address) => console.log('onExisting', address)}
      method={getConstructor(contracts[selectedContract].abi)}
    />}
    </div>
}

function getConstructor (abi) {
  return abi.filter(
    (method) => method.type === 'constructor')[0]
}

