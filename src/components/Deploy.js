import { Store } from '../Store'
import React, { useEffect } from 'react'
import { Constructor } from './Constructor'

export function Deploy() {
  const { state, dispatch } = React.useContext(Store)
  const {
    txMetadata,
    web3,
    compilation: {
    contracts,
    selectedContract,
  }} = state

  const onChangeContract = (contractName) => {
    dispatch({ type: 'SELECT_CONTRACT', payload: contractName })
  }
  const onDeploy = async (params) => {
    console.log('onDeploy', params)
    let contract = contracts[selectedContract]
    let abi = contract.abi
    const constructor = getConstructor(abi)
    const bytecode = '0x' + contract.evm.bytecode.object
    const orderedParams = constructor.inputs.map(({ name }) => params[name])
    var simplestorageContract = new web3.eth.Contract(abi)
    const tx = {
      from: txMetadata.account,
      gasPrice: txMetadata.gasPrice,
      gas: txMetadata.gasLimit,
      privateFrom: txMetadata.privateFrom,
      privateFor: txMetadata.privateFor
    }
    console.log('contract', simplestorageContract, 'args', orderedParams, 'meta', tx)
    var simplestorage = await simplestorageContract.deploy({
      data: bytecode,
      arguments: orderedParams,
    })
    const response = await simplestorage.send(tx)

    console.log('finished', response, response.options.address)
    dispatch({ type: 'ADD_CONTRACT', payload: { ...contract, address: response.options.address } })
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
    <select className="form-control" defaultValue={selectedContract} onChange={(e) => onChangeContract(e.target.value)}>
      {Object.entries(contracts).map(
        ([name, data]) => <option key={name} value={name}>{name}</option>)}
    </select>
    {contracts[selectedContract] &&
    <Constructor
      onDeploy={onDeploy}
      onExisting={(address) => {
        console.log('onExisting', address)
        dispatch({ type: 'ADD_CONTRACT', payload: { ...contracts[selectedContract], address } })
      }}
      method={getConstructor(contracts[selectedContract].abi)}
    />}
    </div>
}

function getConstructor (abi) {
  return abi.filter(
    (method) => method.type === 'constructor')[0]
}

