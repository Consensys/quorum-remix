import React, { useState } from 'react'
import { Store } from '../Store'

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  height: 36,
  marginTop: 8,
}
const addonButtonStyle = {
  margin: 0,
  wordBreak: 'inherit',
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderRight: 0,
}
const buttonStyle = {
  margin: 0,
  minWidth: 100,
  width: 100,
  wordBreak: 'inherit',
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderRight: 0,
}
const inputStyle = {
  fontSize: 10,
  padding: '.25rem',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  borderLeft: 0,
  flexGrow: 1,
}

const caretStyle = {
  cursor: 'pointer',
  fontSize: 16,
  padding: 8,
  verticalAlign: 'center',
  textDecoration: 'none',
  float: 'right',
}

export const Method = ({ method, onSubmit }) => {

  const [expanded, setExpanded] = useState(false)
  const [inputValues, setInputValues] = useState({});
  const [singleLineInput, setSingleLineInput] = useState('')

  const submit = (e) => {
    e.stopPropagation();
    onSubmit(inputValues)
  };

  const onSingleLineInputChange = (inputString) => {
    setSingleLineInput(inputString)
    const newInputValues = {}
    inputString.split(',').forEach((value, i) => {
      if (method.inputs.length <= i) {
        return
      }
      let inputName = method.inputs[i].name
      console.log('gathered', inputName, value.trim())
      newInputValues[inputName] = value.trim()
    })
    setInputValues(newInputValues)
  }

  const onInputChange = (inputName, value) => {
    setInputValues({
      ...inputValues,
      [inputName]: value
    });
  };

  const onCaretClick = (e, shouldExpand) => {
    e.preventDefault()
    if (!shouldExpand) {
      setSingleLineInput(method.inputs.map((input) => inputValues[input.name]).filter((value) => value != null).join(', '))
    }
    setExpanded(shouldExpand)
  }

  const methodName = method.name || 'Deploy' // constructor doesn't have a name

  function expandedView () {
    return <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={containerStyle}>
        <div style={{ flexGrow: 1 }}>{methodName}</div>
        <i style={caretStyle} title="Deploy" className="fa fa-caret-up methCaret"
           onClick={(e) => onCaretClick(e, false)}/>
      </div>
      {method.inputs.map((input) =>
        <TransactionInput
          key={methodName + input.name}
          onChange={onInputChange}
          value={inputValues[input.name]}
          input={input}/>
      )}
      <button onClick={submit} style={{ marginTop: 8, alignSelf: 'flex-end'}} className={`btn btn-sm btn-${method.constant ? 'info' : 'warning'}`}>
        {methodName}
      </button>
    </div>
  }

  function collapsedView () {
    return <div style={containerStyle}>
      <button onClick={submit} style={buttonStyle} className={`btn btn-sm btn-${method.constant ? 'info' : 'warning'}`}>
        {methodName}
      </button>
      {method.inputs.length > 0 &&
      <input placeholder={method.inputs.map((input) => `${input.type} ${input.name}`).join(', ')}
             className="form-control"
             style={inputStyle}
             onChange={(e) => onSingleLineInputChange(e.target.value)}
             value={singleLineInput}
             type="text"/>}
      { method.inputs.length > 0 && <i style={caretStyle} title="Deploy" className="fa fa-caret-down methCaret"
         onClick={(e) => onCaretClick(e, true)}/>}
    </div>
  }

  return <div className="method"
              data-method={methodName}>
    {expanded ? expandedView() : collapsedView()}
  </div>

};

export function TransactTable (props) {
  const { activeContract } = props
  const { state, dispatch } = React.useContext(Store)
  const { txMetadata: { privateFor, privateFrom, account }} = state

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

    let web3Contract = new props.web3.eth.Contract(contract.abi, contract.address)
    let web3Method = web3Contract.methods[method.name](..._params)
    let callOrSend = method.constant ? 'call' : 'send'
    console.log('test', callOrSend, method.name, _params, methodArgs)
    web3Method[callOrSend](methodArgs).then((res) => {
      props.onTransactionSubmitted(res, method, methodSig,
        methodArgs)
    })
  }

  return (
    <div>
    {
      activeContract.abi.filter(
        (method) => method.type === 'function')
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((method) => (
          <Method key={method.name}
                  method={method}
                  onSubmit={(inputValues) => doMethodCall(props.activeContract, account, method,
                    inputValues,
                    privateFrom,
                    privateFor)}
          />
        ))
    }
    </div>
  )
}

export const TransactionInput = ({ input, onChange, value }) => {

  const initialValues = value ? value.toString().split(',').map((v) => v.trim()) : ['']
  const isDynamic = isDynamicArray(input);
  const [values, setValues] = useState(initialValues)
  // const [numInputs, setNumInputs] = useState(1);

  const setValuesAndNotify = (newValues) => {
    onChange(input.name, isDynamic ? newValues : newValues[0]);
    setValues(newValues);
  };

  const onInputChange = (index, value) => {
    const newValues = [...values];
    newValues[index] = value;
    setValuesAndNotify(newValues);
  };

  const onPlus = (index) => {
    const newValues = [...values];
    newValues.splice(index + 1, 0, "");
    setValuesAndNotify(newValues);
  };

  const onMinus = (index) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    setValuesAndNotify(newValues);
  };

  return <div>
    <div>{getInputPlaceholder(input)}:</div>
    {values.map((value, index) => (
      <div key={`${input.name}${index}`} className="input-group method-inputs"
           data-param={input.name}>
        <input type="text" className="form-control" data-param={input.name}
               data-type={input.type}
               value={value}
               onChange={(e) => onInputChange(index, e.target.value)}>
        </input>
        {isDynamic &&
        // handle dynamic array input types - like bytes32[]
        ([
          <button style={addonButtonStyle} key={'minus'} onClick={() => onMinus(index)}
                  className="btn btn-sm remove input-group-addon text-danger">
            <i className="fa fa-minus"/>
          </button>,
          <button style={addonButtonStyle} key={'plus'} onClick={() => onPlus(index)}
                  className="btn btn-sm add input-group-addon text-success">
            <i className="fa fa-plus"/>
          </button>
        ])
        }
      </div>
    ))}
  </div>
}

// public field mapping/array getter inputs don't have names, make it 'input'
const getInputPlaceholder =
    (input) => `${input.name || "input"} (${input.type})`;

const isDynamicArray = (input) => input.type.match(/\[(\d+)?\]/);
