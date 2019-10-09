import { Store } from '../Store'
import React, { useEffect } from 'react'
import { Method } from './Transact'

function getMethodSignature (method) {
  return `${method.name}(${method.inputs.map(
    (input) => `${input.type} ${input.name}`).join(', ')})`
}

export function Contract ({ address }) {
  const { state, dispatch } = React.useContext(Store)
  const { txMetadata: { privateFor, privateFrom, account }, web3, deployedContracts } = state
  const contract = deployedContracts[address]

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

  return (
    <div>
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
  )

}
