import React, { useEffect } from 'react'
import { Constructor } from './Constructor'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { addExistingContract, deployContract, selectContract } from '../actions'
import { getConstructor } from '../utils/ContractUtils'
import { bootstrapSelectStyle } from '../utils/Styles'

export function Deploy() {
  const txMetadata = useSelector(state => state.txMetadata, shallowEqual)
  const {
    contracts,
    selectedContract,
    deploying
  } = useSelector(state => state.compilation)
  const dispatch = useDispatch()

  useEffect(() => {
    // maybe a better way to do this, but select the first contract if unset or
    // if selected contract is no longer in the list of contracts
    if (!(selectedContract in contracts)) {
      dispatch(selectContract(Object.keys(contracts)[0]))
    }
  }, [contracts]) // eslint-disable-line react-hooks/exhaustive-deps


  return <div style={{ width: '100%' }}>
    <div>Compiled Contracts:</div>
    <select
      style={bootstrapSelectStyle}
      className="form-control custom-select"
      id="compiled-select"
      defaultValue={selectedContract}
      onChange={(e) => dispatch(selectContract(e.target.value))}>
      {Object.entries(contracts).map(
        ([name, data]) => <option key={name} value={name}>{name}</option>)}
    </select>
    {contracts[selectedContract] &&
    <Constructor
      loading={deploying}
      onDeploy={params => dispatch(
        deployContract(params, contracts[selectedContract], txMetadata))}
      onExisting={(address) => {
        dispatch(addExistingContract(contracts[selectedContract], address, txMetadata))
      }}
      method={getConstructor(contracts[selectedContract].abi)}
    />}
    </div>
}

