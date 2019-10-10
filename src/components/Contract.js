import { Store } from '../Store'
import React, { useEffect } from 'react'
import { Method } from './Transact'
import copy from 'copy-to-clipboard'
import Web3 from 'web3'
import {
  bodyStyle,
  contractStyle,
  ellipsisStyle,
  headerStyle,
  iconStyle
} from '../utils/Styles'

function getMethodSignature (method) {
  return `${method.name}(${method.inputs.map(
    (input) => `${input.type} ${input.name}`).join(', ')})`
}

export function Contract ({ address }) {
  const { state, dispatch } = React.useContext(Store)
  const { txMetadata, web3, deployedContracts } = state
  const contract = deployedContracts[address]
  const { expanded = false, contractName, privateFor } = contract
  console.log('contract', contract)

  useEffect(() => {
  }, [])

  function doMethodCall (method, params) {
    const { account, gasLimit, gasPrice, value, valueDenomination } = txMetadata
    var _params = Object.values(params)
    var _sig_params = _params.map((value) => JSON.stringify(value)).join(', ')
    var methodSig = method.name + '(' + _sig_params + ')'
    var methodArgs = {
      from: account,
      gas: gasLimit,
      gasPrice,
      value: Web3.utils.toWei(value, valueDenomination),
      args: _params,
      privateFor
    }

    let web3Contract = new web3.eth.Contract(contract.abi, contract.address)
    let web3Method = web3Contract.methods[method.name](..._params)
    let callOrSend = method.constant ? 'call' : 'send'
    console.log('test', callOrSend, method.name, _params, methodArgs)
    web3Method[callOrSend](methodArgs).then((res) => {
      console.log('transaction send response', res, method, methodSig,
        methodArgs)
      dispatch({
        type: "METHOD_CALL",
        payload: {
          address,
          methodSignature: getMethodSignature(method),
          result: res,
        }
      })
    })
  }

  const getResultForMethod = (method) => {
    return contract.results && contract.results[getMethodSignature(method)]
  }

  const copyAddress = async () => {
    try {
      // eslint-disable-next-line no-undef
      await copy(address)
    } catch (e) {
      console.error("Could not copy to clipboard: ", address, e)
    }
  }

  const renderHeader = () => <div style={headerStyle}>

    <i style={iconStyle} title="Expand contract instance"
       className={`fa fa-caret-${expanded ? 'down' : 'right'} methCaret`}
       onClick={(e) => dispatch({
         type: 'EXPAND_CONTRACT',
         payload: { address, expand: !expanded }
       })}/>
    <div style={ellipsisStyle}>{contractName}({address})</div>
    <i style={iconStyle} title="Copy contract address"
       className="fa fa-clipboard"
       onClick={(e) => copyAddress()}/>
    <i style={iconStyle} title="Remove contract instance"
       className="fa fa-close"
       onClick={(e) => dispatch({type: 'REMOVE_CONTRACT', payload: address})}/>
  </div>

  const renderExpanded = () => <div style={bodyStyle}>
    {privateFor &&
    <div style={{ fontSize: 10 }}>
      <div>Private for:</div>
      {privateFor.map((pk) => <div>{pk}</div>)}
    </div>}
    {
      contract.abi.filter(
        (method) => method.type === 'function')
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((method) => (
        <Method key={method.name}
                method={method}
                result={getResultForMethod(method)}
                onSubmit={(inputValues) => doMethodCall(method, inputValues)}
        />
      ))
    }
  </div>

  return (
    <div style={contractStyle}>
      {renderHeader()}
      {expanded && renderExpanded()}
    </div>
  )

}
