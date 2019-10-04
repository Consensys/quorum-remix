import { Store } from '../Store'
import React, { useEffect } from 'react'

export function TxMetadata () {
  const { state, dispatch } = React.useContext(Store)
  const {
    network: { accounts },
    txMetadata: { account }
  } = state

  const onChangeAccount = (account) => {
    dispatch({ type: 'SELECT_ACCOUNT', payload: account })
  }

  useEffect(() => {
    // maybe a better way to do this, but select the first account if unset or
    // if selected account is no longer in the list of accounts
    if (accounts.length > 0 && !accounts.includes(account)) {
      console.log('setting first account as selected')
      onChangeAccount(accounts[0])
    }
  }, [accounts])

  return <div>
    <div>Account:</div>
    <select defaultValue={account}
            onChange={(e) => onChangeAccount(e.target.value)}>
      {accounts.map(
        (account) => <option key={account} value={account}>{account}</option>)}
    </select>
  </div>
}
