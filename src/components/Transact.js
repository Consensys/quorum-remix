import React, {useState} from "react";
import Select from "react-select";
import {PrivateFor} from "./PrivateFor";

export const Method = ({method, onSubmit, inlineButton = true}) => {

  const [inputValues, setInputValues] = useState({});

  const submit = (e) => {
    e.stopPropagation();
    onSubmit(inputValues)
  };

  const onInputChange = (inputName, value) => {
    setInputValues({
      ...inputValues,
      [inputName]: value
    });
  };

  return <tr className="method"
             data-method={method.name}>
    <td colSpan="2">
      {method.name &&
      <span>
                        <label>{method.name}</label>
        {inlineButton &&
        <button onClick={submit} className="btn btn-default send">
          {getButtonLabel(method)}
        </button>}
                    </span>
      }
      <div className="transact-inputs">
        {method.inputs.map((input) =>
            <TransactionInput
                key={method.name + input.name}
                onChange={onInputChange}
                input={input}/>
        )}
      </div>
      {!inlineButton &&
      <button onClick={submit} className="btn btn-default deploy">
        {getButtonLabel(method)}
      </button>}
    </td>
  </tr>;
};

export class TransactTable extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      activeContract: props.activeContract,
    }
  }

  render() {
    const {activeContract} = this.state;
    return (
        <tbody>
        {
          activeContract.abi.filter(
              (method) => method.type === "function")
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((method) => (
              <Method key={method.name}
                      method={method}
                      onSubmit={(inputValues) => this.onMethodCalled(method,
                          inputValues)}
              />
          ))
        }
        </tbody>
    )
  }

  onMethodCalled = (method, inputValues) => {
    const {activeContract, privateFor} = this.state;

    this.doMethodCall(activeContract, this.props.account, method,
        inputValues,
        "", privateFor);

  };

  doMethodCall = (contract, from, method, params, privateFrom,
      privateFor) => {
    var _params = Object.values(params)
    var _sig_params = _params.map((value) => JSON.stringify(value)).join(", ");
    var methodSig = method.name + "(" + _sig_params + ")";
    var methodArgs = {from: from, args: _params};

    if (!method.constant) {
      // txn
      methodArgs.privateFrom = privateFrom;
      methodArgs.privateFor = privateFor;
    }

    let web3Contract = new this.props.web3.eth.Contract(contract.abi, contract.address);
    let web3Method = web3Contract.methods[method.name](..._params);
    let callOrSend = method.constant ? 'call' : 'send';
    console.log("test", callOrSend, method.name, _params, methodArgs);
    web3Method[callOrSend](methodArgs).then((res) => {
      this.props.onTransactionSubmitted(res, method, methodSig,
          methodArgs)
    });
  };
}

export const TransactionInput = ({input, onChange}) => {

  const isDynamic = isDynamicArray(input);
  const [values, setValues] = useState([""]);
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

  return values.map((value, index) => (
      <div key={`${input.name}${index}`} className="input-group method-inputs"
           data-param={input.name}>
        <input type="text" className="form-control" data-param={input.name}
               data-type={input.type}
               value={value}
               placeholder={getInputPlaceholder(input)}
               onChange={(e) => onInputChange(index, e.target.value)}>
        </input>
        {isDynamic &&
        // handle dynamic array input types - like bytes32[]
        ([
          <a href="#minus" key={"minus"} onClick={() => onMinus(index)}
             className="remove input-group-addon text-danger">
            <i className="fa fa-minus"/>
          </a>,
          <a href="#plus" key={"plus"} onClick={() => onPlus(index)}
             className="add input-group-addon text-success">
            <i className="fa fa-plus"/>
          </a>
        ])
        }
      </div>
  ))
};

const getButtonLabel = (method) => {
  if (!method.name) {
    return "Deploy";
  } else if (method.constant) {
    return "Read";
  }
  return "Transact";
};

// public field mapping/array getter inputs don't have names, make it 'input'
const getInputPlaceholder =
    (input) => `${input.name || "input"} (${input.type})`;

const isDynamicArray = (input) => input.type.match(/\[(\d+)?\]/);
