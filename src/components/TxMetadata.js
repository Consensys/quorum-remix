import { Store } from '../Store'
import React, { useEffect } from 'react'
import { PrivateFor } from './PrivateFor'
import {
  iconStyle,
  inlineInputStyle,
  labelStyle,
  txMetaRowStyle
} from '../utils/Styles'
import copy from 'copy-to-clipboard'

export function TxMetadata () {
  const { state, dispatch } = React.useContext(Store)
  const {
    network: { accounts, tesseraEndpoint },
    txMetadata: {
      account,
      gasLimit,
      gasPrice,
      value,
      valueDenomination,
    }
  } = state

  const onChangeAccount = (account) => {
    dispatch({ type: 'SELECT_ACCOUNT', payload: account })
  }

  const copyAddress = async () => {
    try {
      // eslint-disable-next-line no-undef
      await copy(account)
    } catch (e) {
      console.error('Could not copy to clipboard: ', account, e)
    }
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
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Private for:</div>
      <div style={{width: 224}}><PrivateFor/></div>
    </div>
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Account:</div>
      <select className="form-control" defaultValue={account}
              onChange={(e) => onChangeAccount(e.target.value)}>
        {accounts.map(
          (account) => <option key={account}
                               value={account}>{account}</option>)}
      </select>
      <i style={iconStyle}
         className="fa fa-clipboard"
         onClick={(e) => copyAddress()}/>
    </div>
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Gas price:</div>
      <input style={inlineInputStyle} className="form-control" type="text" value={gasPrice}
                           onChange={(e) => dispatch({
                             type: 'CHANGE_GAS_PRICE',
                             payload: e.target.value
                           })}/>
    </div>
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Gas limit:</div>
      <input style={inlineInputStyle} className="form-control" type="text" value={gasLimit}
             onChange={(e) => dispatch({
               type: 'CHANGE_GAS_LIMIT',
               payload: e.target.value
             })}/>
    </div>
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Value:</div>
      <input style={inlineInputStyle} className="form-control" type="text" value={value}
             onChange={(e) => dispatch(
               { type: 'CHANGE_VALUE', payload: e.target.value })}/>
      <select style={inlineInputStyle} className="form-control" defaultValue={valueDenomination}
              onChange={(e) => dispatch({
                type: 'CHANGE_VALUE_DENOMINATION',
                payload: e.target.value
              })}>
        <option value="wei">wei</option>
        <option value="gwei">gwei</option>
        <option value="finney">finney</option>
        <option value="ether">ether</option>
      </select>
    </div>
  </div>
}
