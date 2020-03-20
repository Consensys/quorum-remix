import React from 'react'
import Creatable from 'react-select/creatable/dist/react-select.esm'
import Select from 'react-select'
import isBase64 from 'validator/lib/isBase64'
import { setError } from '../actions'
import { useDispatch } from 'react-redux'
import {
  iconStyle,
  optionLabelContainerStyle,
  optionLabelStyle,
  optionStyle
} from '../utils/Styles'
import { components } from 'react-select/dist/react-select.browser.esm'

export function PrivateSelection (props) {
  const keysFromUser = props.userKeys
  const keysFromServer = props.serverKeys
  const privateKey = props.privateKey
  const remove = props.onRemove

  const isFromServer = keysFromServer.length > 0

  // don't allow user-added keys when using keys retrieved from the server.
  // If a key is not in the list, the transaction will be rejected anyway.
  const options = isFromServer ? keysFromServer : keysFromUser
  const selectedOptions = options.filter(
    (option) => privateKey && privateKey.includes(option.value))
  const dispatch = useDispatch()

  // custom react-select option to allow deleting of user-added keys
  const Option = (props) => {
    const option = props.data

    return <components.Option {...props}>
      <div style={optionStyle}>
        <div style={optionLabelContainerStyle}>
          <div style={optionLabelStyle}>
            {option.label}
          </div>
        </div>
        {option.userCreated &&
        <i style={iconStyle} className="fa fa-close"
           onClick={() => remove(option.value)}/>
        }
      </div>
    </components.Option>
  }

  const SelectContainer = props.isFromServer ? Select : Creatable

  return <SelectContainer
    id={props.containerId}
    components={{ Option }}
    placeholder="Select or add..."
    options={options}
    value={selectedOptions}
    closeMenuOnSelect={true}
    isMulti={props.isMulti}
    autosize="false"
    onChange={(selection) => props.onUpdate(selection)}
    formatCreateLabel={(value) => `Add '${value}'`}
    onCreateOption={(inputValue) => {

      if(inputValue.length !== 44) {
        dispatch(setError(`Public key length must equal 44: (actual: ${inputValue.length}) ${inputValue}`))
        return;
      }
      if(!isBase64(inputValue)) {
        dispatch(setError(`Public key must be a valid base64 string: ${inputValue}`))
        return;
      }

      const option = {
        label: inputValue,
        value: inputValue,
        userCreated: true
      }
      props.onAdd(option)
      props.onUpdate([...selectedOptions, option])
    }}/>
}
