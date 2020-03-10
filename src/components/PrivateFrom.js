import React from 'react'
import { components } from 'react-select/dist/react-select.browser.esm'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import {
  addPublicKey,
  removePublicKey,
  setError,
  updatePrivateFrom
} from '../actions'
import {
  iconStyle,
  optionLabelContainerStyle,
  optionLabelStyle,
  optionStyle
} from '../utils/Styles'
import Creatable from 'react-select/creatable/dist/react-select.esm'
import Select from 'react-select'
import isBase64 from 'validator/lib/isBase64'

export function PrivateFrom () {
  const dispatch = useDispatch()

  const privateFrom = useSelector(state => state.txMetadata.privateFrom)
  const keysFromUser =
    useSelector(state => state.tessera.keysFromUser, shallowEqual)
  const keysFromServer =
    useSelector(state => state.tessera.keysFromServer, shallowEqual)

  const isFromServer = keysFromServer.length > 0

  // don't allow user-added keys when using keys retrieved from the server.
  // If a key is not in the list, the transaction will be rejected anyway.
  const options = isFromServer ? keysFromServer : keysFromUser
  const selectedOptions = options.filter(
    (option) => privateFrom && privateFrom.includes(option.value))
    console.log('options')
  console.log(options)

  // Don't allow creation of options if we're using keys from the server
  const SelectContainer = isFromServer ? Select : Creatable

  return <SelectContainer
    id="private-from-select"
    components={{ Option }}
    placeholder="Select or add..."
    options={options}
    value={selectedOptions}
    closeMenuOnSelect={true}
    autosize="false"
    onChange={(selection) => dispatch(updatePrivateFrom([selection]))}
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
      dispatch(addPublicKey(option))
      dispatch(updatePrivateFrom([...selectedOptions, option]))
    }}/>
}

// custom react-select option to allow deleting of user-added keys
const Option = (props) => {
  const dispatch = useDispatch()

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
         onClick={() => dispatch(removePublicKey(option.value))}/>
      }
    </div>
  </components.Option>
}
