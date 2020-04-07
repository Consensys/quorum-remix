import React from 'react'
import { Method } from './Transact'
import copy from 'copy-to-clipboard'
import {
  bodyStyle,
  contractStyle,
  ellipsisStyle,
  headerStyle,
  iconStyle,
  smallCheckboxLabelStyle
} from '../utils/Styles'
import { useDispatch, useSelector } from 'react-redux'
import { doMethodCall, expandContract, removeContract } from '../actions'
import { getMethodSignature } from '../utils/ContractUtils'

export function Contract ({ address }) {
  const dispatch = useDispatch()
  const txMetadata = useSelector(state => state.txMetadata)
  const deployedContracts = useSelector(
    state => state.deployed.deployedContracts)

  const contract = deployedContracts[address]
  const { expanded = false, contractName, privateFor } = contract

  const [selectedPrivateFor, setSelectedPrivateFor] = React.useState(
    privateFor && privateFor.map(key => { return { enabled: true, key }}))

  const getStateForMethod = (method) => {
    return contract[getMethodSignature(method)] || { loading: false }
  }

  const copyAddress = async () => {
    try {
      // eslint-disable-next-line no-undef
      await copy(address)
    } catch (e) {
      console.error("Could not copy to clipboard: ", address, e)
    }
  }

  const renderHeader = () => <div className="alert alert-secondary p-2"
                                  style={headerStyle}>

    <i style={iconStyle} title="Expand contract instance"
       className={`fa fa-caret-${expanded ? 'down' : 'right'} methCaret`}
       onClick={(e) => dispatch(expandContract(address, expanded))}/>
    <div className="input-group-text"
         style={ellipsisStyle}>{contractName}({address})
    </div>
    <i style={iconStyle} title="Copy contract address"
       className="fa fa-clipboard"
       onClick={(e) => copyAddress()}/>
    <i style={iconStyle} title="Remove contract instance"
       className="fa fa-close"
       onClick={(e) => dispatch(removeContract(address))}/>
  </div>

  const renderExpanded = () => <div style={bodyStyle}>
    {selectedPrivateFor &&
    <div style={{ fontSize: 10 }}>
      <div>Private for:</div>
      {selectedPrivateFor.map(
        ({ enabled, key }, index) => (
          <label key={key} style={smallCheckboxLabelStyle}>
            <input type="checkbox" name={key}
                   style={{marginRight: 4}}
                   checked={enabled}
                   onChange={(e) => {
                     const newSelected = [...selectedPrivateFor]
                     newSelected[index].enabled = e.target.checked
                     setSelectedPrivateFor(newSelected)
                   }}/>
            {key}
          </label>
        )
      )}
    </div>}
    {
      contract.abi.filter(
        (method) => method.type === 'function')
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((method) => {
        let stateForMethod = getStateForMethod(method)
        return <Method
          key={method.name}
          loading={stateForMethod.loading}
          method={method}
          result={stateForMethod.result}
          onSubmit={(inputValues) => dispatch(
            doMethodCall(contract, method,
              inputValues, txMetadata, privateFor, selectedPrivateFor))}
        />
      })
    }
  </div>

  return (
    <div className="deployed-contract" style={contractStyle}>
      {renderHeader()}
      {expanded && renderExpanded()}
    </div>
  )
}
