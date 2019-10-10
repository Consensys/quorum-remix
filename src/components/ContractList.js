import { Store } from '../Store'
import React, { useEffect } from 'react'
import { Contract } from './Contract'

export function ContractList () {
  const { state, dispatch } = React.useContext(Store)
  const { deployedAddresses } = state

  useEffect(() => {
  }, [])

  return <div>
    <div>Deployed Contracts:</div>
    {deployedAddresses.length === 0 && <div>None</div>}
    {deployedAddresses.map((address) => <Contract key={address} address={address}/>)}
  </div>
}
