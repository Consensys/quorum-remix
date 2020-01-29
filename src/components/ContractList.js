import React, { useEffect } from 'react'
import { Contract } from './Contract'
import { useSelector } from 'react-redux'
import { formContainerStyle } from '../utils/Styles'

export function ContractList () {
  const deployedAddresses = useSelector(state => state.deployed.deployedAddresses)

  useEffect(() => {
  }, [])

  return <div id="contract-list" style={formContainerStyle}>
    <div>Deployed Contracts:</div>
    {deployedAddresses.length === 0 && <div>None</div>}
    {deployedAddresses.map((address) => <Contract key={address} address={address}/>)}
  </div>
}
