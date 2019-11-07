import React from 'react'
import Creatable from 'react-select/creatable/dist/react-select.esm'
import { components } from 'react-select/dist/react-select.browser.esm'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { addPublicKey, removePublicKey, updatePrivateFor } from '../actions'
import {
  iconStyle,
  optionLabelContainerStyle,
  optionLabelStyle,
  optionStyle
} from '../utils/Styles'

export function PrivateFor () {
  const dispatch = useDispatch()

  const privateFor = useSelector(state => state.txMetadata.privateFor)
  const keysFromUser =
    useSelector(state => state.tessera.keysFromUser, shallowEqual)
  const keysFromServer =
    useSelector(state => state.tessera.keysFromServer, shallowEqual)

  const options = [...keysFromServer, ...keysFromUser]
  const selectedOptions = options.filter(
    (option) => privateFor && privateFor.includes(option.value))

  return <Creatable
    components={{ Option }}
    placeholder="Select or add..."
    options={options}
    value={selectedOptions}
    closeMenuOnSelect={true}
    isMulti
    autosize={false}
    onChange={(selection) => dispatch(updatePrivateFor(selection))}
    onCreateOption={(inputValue) => {
      const option = { label: inputValue, value: inputValue }
      dispatch(addPublicKey(option))
      dispatch(updatePrivateFor([...selectedOptions, option]))
    }}/>
}

// custom react-select option to allow deleting of user-added keys
const Option = (props) => {
  const dispatch = useDispatch()

  // user created options don't have a url for their label
  const isUserCreatedOption = props.label === props.value

  // the 'Create' option and user-created options will show value double, don't
  const shouldShowValue = !isUserCreatedOption &&
    !props.label.startsWith('Create')

  return <components.Option {...props}>
    <div style={optionStyle}>
      <div style={optionLabelContainerStyle}>
        <div style={optionLabelStyle}>
          {props.label}
        </div>
        {shouldShowValue &&
        <div style={optionLabelStyle}>
          {props.value}
        </div>
        }
      </div>
      {isUserCreatedOption &&
      <i style={iconStyle} className="fa fa-close"
         onClick={() => dispatch(removePublicKey(props.value))}/>
      }
    </div>
  </components.Option>
}


