import { Store } from '../Store'
import React, { useEffect } from 'react'
import { Constructor } from './Constructor'
import { TransactTable } from './Transact'

export function Contract ({ contract }) {
  const { state, dispatch } = React.useContext(Store)
  const { txMetadata: {account}, web3 } = state

  console.log('contract', contract)
  useEffect(() => {
  }, [])

  return <div>
    <TransactTable web3={web3} account={account} activeContract={contract} onTransactionSubmitted={console.log} />
  </div>
}
