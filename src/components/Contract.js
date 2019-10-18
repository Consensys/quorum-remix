import React from 'react'
import { Method } from './Transact'
import copy from 'copy-to-clipboard'
import {
  bodyStyle,
  checkboxLabelStyle,
  contractStyle,
  ellipsisStyle,
  headerStyle,
  iconStyle
} from '../utils/Styles'
import { useDispatch, useSelector } from 'react-redux'
import { doMethodCall, expandContract, removeContract } from '../actions'
import { getMethodSignature } from '../utils/ContractUtils'

export function Contract ({ address }) {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const { txMetadata, deployedContracts } = state
  const contract = deployedContracts[address]
  const { expanded = false, contractName, privateFor } = contract

  const [selectedPrivateFor, setSelectedPrivateFor] = React.useState(
    privateFor && privateFor.map(key => { return { enabled: true, key }}))

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
       onClick={(e) => dispatch(expandContract(address, expanded))}/>
    <div style={ellipsisStyle}>{contractName}({address})</div>
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
          <label key={key} style={checkboxLabelStyle}>
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
      .map((method) => (
        <Method key={method.name}
                method={method}
                result={getResultForMethod(method)}
                onSubmit={(inputValues) => dispatch(
                  doMethodCall(contract, method,
                    inputValues, txMetadata, privateFor, selectedPrivateFor))}
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
