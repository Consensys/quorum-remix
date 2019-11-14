import React, { useEffect } from 'react'
import { PrivateFor } from './PrivateFor'
import {
  formContainerStyle,
  iconStyle,
  inlineInputStyle,
  labelStyle,
  reactSelectStyle,
  txMetaRowStyle
} from '../utils/Styles'
import copy from 'copy-to-clipboard'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeGasLimit,
  changeGasPrice,
  changeValue,
  changeValueDenomination,
  selectAccount
} from '../actions'

export function TxMetadata () {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const {
    network: { accounts = [] },
    txMetadata: {
      account,
      gasLimit,
      gasPrice,
      value,
      valueDenomination,
    }
  } = state

  const copyAddress = async () => {
    try {
      await copy(account)
    } catch (e) {
      console.error('Could not copy to clipboard: ', account, e)
    }
  }


  useEffect(() => {
    // maybe a better way to do this, but select the first account if unset or
    // if selected account is no longer in the list of accounts
    if (accounts.length > 0 && !accounts.includes(account)) {
      dispatch(selectAccount(accounts[0]))
    }
  }, [accounts])

  return <div style={formContainerStyle}>
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Account</div>
      <select className="form-control" defaultValue={account}
              onChange={(e) => dispatch(selectAccount(e.target.value))}>
        {accounts.map(
          (account) => <option key={account}
                               value={account}>{account}</option>)}
      </select>
      <i style={iconStyle}
         className="fa fa-clipboard"
         onClick={(e) => copyAddress()}/>
    </div>
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Gas price</div>
      <input style={inlineInputStyle} className="form-control" type="text" value={gasPrice}
                           onChange={(e) => dispatch(changeGasPrice(e.target.value))}/>
    </div>
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Gas limit</div>
      <input style={inlineInputStyle} className="form-control" type="text" value={gasLimit}
             onChange={(e) => dispatch(changeGasLimit(e.target.value))}/>
    </div>
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Value</div>
      <input style={inlineInputStyle} className="form-control" type="text" value={value}
             onChange={(e) => dispatch(
               changeValue(e.target.value))}/>
      <select style={inlineInputStyle} className="form-control" defaultValue={valueDenomination}
              onChange={(e) => dispatch(changeValueDenomination(e.target.value))}>
        <option value="wei">wei</option>
        <option value="gwei">gwei</option>
        <option value="finney">finney</option>
        <option value="ether">ether</option>
      </select>
    </div>
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Private for</div>
      <div style={reactSelectStyle}><PrivateFor/></div>
    </div>
  </div>
}
