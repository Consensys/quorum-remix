import React from 'react'
import { components } from 'react-select/dist/react-select.browser.esm'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import {
  addPublicKey,
  removePublicKey,
  setError,
  updatePrivateFor
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

export function PrivateFor () {
  const dispatch = useDispatch()

  const privateFor = useSelector(state => state.txMetadata.privateFor)
  const keysFromUser =
    useSelector(state => state.tessera.keysFromUser, shallowEqual)
  const keysFromServer =
    useSelector(state => state.tessera.keysFromServer, shallowEqual)

  const isFromServer = keysFromServer.length > 0

  // don't allow user-added keys when using keys retrieved from the server.
  // If a key is not in the list, the transaction will be rejected anyway.
  const options = isFromServer ? keysFromServer : keysFromUser
  const selectedOptions = options.filter(
    (option) => privateFor && privateFor.includes(option.value))

  // Don't allow creation of options if we're using keys from the server
  const SelectContainer = isFromServer ? Select : Creatable

  return <SelectContainer
    components={{ Option }}
    placeholder="Select or add..."
    options={options}
    value={selectedOptions}
    closeMenuOnSelect={true}
    isMulti
    autosize="false"
    onChange={(selection) => dispatch(updatePrivateFor(selection))}
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
      dispatch(updatePrivateFor([...selectedOptions, option]))
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


