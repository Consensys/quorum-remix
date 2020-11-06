import React, { useEffect } from 'react'
import {
  bootstrapSelectStyle,
  checkboxLabelStyle,
  checkboxStyle,
  ellipsisStyle,
  formContainerStyle,
  headerStyle,
  iconStyle,
  inlineInputStyle,
  labelStyle,
  largeInlineInputStyle,
  reactSelectStyle,
  txMetaRowStyle,
} from '../utils/Styles'
import copy from 'copy-to-clipboard'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeGasLimit,
  changeGasPrice,
  changeValue,
  changeValueDenomination,
  selectAccount,
  showTxMetadata, updatePrivateTransaction,
} from '../actions'
import { InputTooltip } from './InputTooltip'
import { PrivateFor } from './PrivateFor'
import { PrivateFrom } from './PrivateFrom'
import { PrivacyFlag } from './PrivacyFlag'

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
      show,
      privateTransaction,
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
  }, [accounts]) // eslint-disable-line react-hooks/exhaustive-deps

  function expandedMetadata () {
    return <>
      <div style={txMetaRowStyle}>
        <div style={labelStyle}>Gas price</div>
        <InputTooltip
          text="Warning: Quorum usually requires Gas Price to be zero">
          <input style={inlineInputStyle} className="form-control" type="text" value={gasPrice}
                 id="gas-price-input"
                 onChange={(e) => dispatch(changeGasPrice(e.target.value))}/>
        </InputTooltip>
      </div>
      <div style={txMetaRowStyle}>
        <div style={labelStyle}>Gas limit</div>
        <InputTooltip
          text="Leave field empty to estimate Gas Limit">
          <input style={largeInlineInputStyle} className="form-control" type="text" value={gasLimit}
                id="gas-limit-input" placeholder="Estimate Gas Limit"
                onChange={(e) => dispatch(changeGasLimit(e.target.value))}/>
        </InputTooltip>
      </div>
      <div style={txMetaRowStyle}>
        <div style={labelStyle}>Value</div>
        <input style={inlineInputStyle} className="form-control" type="text" value={value}
               id="value-input"
               onChange={(e) => dispatch(
                 changeValue(e.target.value))}/>
        <select style={inlineInputStyle} className="form-control" defaultValue={valueDenomination}
                id="value-denomination-select"
                onChange={(e) => dispatch(changeValueDenomination(e.target.value))}>
          <option value="wei">wei</option>
          <option value="gwei">gwei</option>
          <option value="finney">finney</option>
          <option value="ether">ether</option>
        </select>
      </div>
    </>
  }

  function collapsedMetadata () {
    return <div id="metadata-collapsed"
                style={{ ...ellipsisStyle, marginLeft: 28, cursor: 'pointer' }}
                onClick={(e) => dispatch(showTxMetadata(!show))}>
      Gas Price: {gasPrice}, Gas Limit: {gasLimit}, Value: {value} {valueDenomination}
    </div>
  }

  const renderHeader = () => (
    <div id="metadata-header"
      style={{ ...headerStyle, cursor: 'pointer' }}
      onClick={(e) => dispatch(showTxMetadata(!show))}>
      <i style={{ ...iconStyle, minWidth: 20, paddingLeft: 2 }}
         title="Expand Transaction Metadata"
         id='metadata-caret'
         className={`fa fa-caret-${show ? 'down' : 'right'} methCaret`}
      />
      <div style={{ ...labelStyle, marginTop: 1 }}>
        Transaction Metadata
      </div>
      <div style={{
        flex: 1,
        borderTop: '1px solid #ccc',
        marginTop: 2,
        marginLeft: 8,
      }}>
      </div>
    </div>
  )

  return <div style={formContainerStyle}>
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Account</div>
      <select
        style={bootstrapSelectStyle}
        className="form-control custom-select"
        defaultValue={account}
        id="account-select"
        onChange={(e) => dispatch(selectAccount(e.target.value))}>
        {accounts.map(
          (account) => <option key={account}
                               value={account}>{account}</option>)}
      </select>
      <i style={iconStyle}
         className="fa fa-clipboard"
         onClick={(e) => copyAddress()}/>
    </div>
    <div id="private-checkbox-row" style={{...txMetaRowStyle, cursor: 'pointer'}} onClick={() => dispatch(updatePrivateTransaction(!privateTransaction))}>
      <input id="private-checkbox" type="checkbox" style={checkboxStyle} className="form-check" checked={privateTransaction}/>
      <div style={checkboxLabelStyle}>Private Transaction</div>
    </div>
    {privateTransaction && (<div style={txMetaRowStyle}>
      <div style={labelStyle}>Private from</div>
      <div style={reactSelectStyle}><PrivateFrom/></div>
    </div>)}
    {privateTransaction && (<div style={txMetaRowStyle}>
      <div style={labelStyle}>Private for</div>
      <div style={reactSelectStyle}><PrivateFor/></div>
    </div>)}
    {privateTransaction && (<div style={txMetaRowStyle}>
      <div style={labelStyle}>Privacy Level</div>
      <div style={reactSelectStyle}><PrivacyFlag/></div>
      <a title="Privacy Enhancements Documentation"
         target="_blank"
        href="https://docs.goquorum.consensys.net/en/stable/Concepts/Privacy/PrivacyEnhancements/">
        <i style={iconStyle} className="fa fa-info-circle" />
      </a>
    </div>)}
    {renderHeader()}
    {show ? expandedMetadata() : collapsedMetadata()}
  </div>
}
