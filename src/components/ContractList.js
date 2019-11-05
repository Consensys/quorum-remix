import React, { useEffect } from 'react'
import { Contract } from './Contract'
import { useSelector } from 'react-redux'
import { formContainerStyle } from '../utils/Styles'

export function ContractList () {
  const state = useSelector(state => state)
  const { deployedAddresses } = state

  useEffect(() => {
  }, [])

  return <div style={formContainerStyle}>
    <div>Deployed Contracts:</div>
    {deployedAddresses.length === 0 && <div>None</div>}
    {deployedAddresses.map((address) => <Contract key={address} address={address}/>)}
  </div>
}
