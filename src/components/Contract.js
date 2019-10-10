import { Store } from '../Store'
import React, { useEffect } from 'react'
import { Method } from './Transact'
import copy from 'copy-to-clipboard'

const contractStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: 8,
}
const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  borderRadius: '0.25rem',
  border: '1px solid #95a5a6',
  background: '#95a5a6',
  padding: '4px',
}
const bodyStyle = {
  padding: '0px 0 10px 10px',
  border: '1px solid rgba(0,0,0,0.125)',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: '0.25rem',
  borderTopRightRadius: 0,
  borderBottomRightRadius: '0.25rem',
}

const iconStyle = {
  cursor: 'pointer',
  fontSize: 16,
  padding: 8,
  verticalAlign: 'center',
  textDecoration: 'none',
  float: 'right',
}

const ellipsisStyle = {
  backgroundColor: '#ecf0f1',
  border: '1px solid #ced4da',
  borderRadius: '0.25rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: '#7b8a8b',
  fontSize: '11px',
  padding: '0.375rem 0.75rem',
}

function getMethodSignature (method) {
  return `${method.name}(${method.inputs.map(
    (input) => `${input.type} ${input.name}`).join(', ')})`
}

export function Contract ({ address }) {
  const { state, dispatch } = React.useContext(Store)
  const { txMetadata: { privateFor, privateFrom, account }, web3, deployedContracts } = state
  const contract = deployedContracts[address]
  const { expanded = false, contractName } = contract
  console.log('contract', contract)

  useEffect(() => {
  }, [])

  function doMethodCall (contract, from, method, params, privateFrom,
    privateFor) {
    var _params = Object.values(params)
    var _sig_params = _params.map((value) => JSON.stringify(value)).join(', ')
    var methodSig = method.name + '(' + _sig_params + ')'
    var methodArgs = { from: from, args: _params }

    if (!method.constant) {
      // txn
      methodArgs.privateFrom = privateFrom
      methodArgs.privateFor = privateFor
    }

    let web3Contract = new web3.eth.Contract(contract.abi,
      contract.address)
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

    <i style={iconStyle} title="Deploy"
       className={`fa fa-caret-${expanded ? 'up' : 'down'} methCaret`}
       onClick={(e) => dispatch({
         type: 'EXPAND_CONTRACT',
         payload: { address, expand: !expanded }
       })}/>
    <div style={ellipsisStyle}>{contractName}({address})</div>
    <i style={iconStyle} title="Deploy"
       className="fa fa-clipboard"
       onClick={(e) => copyAddress()}/>
    <i style={iconStyle} title="Deploy"
       className="fa fa-close"
       onClick={(e) => dispatch({type: 'REMOVE_CONTRACT', payload: address})}/>
  </div>

  const renderExpanded = () => <div style={bodyStyle}>
    {
      contract.abi.filter(
        (method) => method.type === 'function')
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((method) => (
        <Method key={method.name}
                method={method}
                result={getResultForMethod(method)}
                onSubmit={(inputValues) => doMethodCall(contract,
                  account, method,
                  inputValues,
                  privateFrom,
                  privateFor)}
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
