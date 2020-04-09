import React, { useState } from 'react'
import { Method } from './Transact'
import {
  buttonStyle,
  containerStyle,
  inputStyle,
  orStyle
} from '../utils/Styles'

export const Constructor = ({ method, onDeploy, onExisting, loading }) => {

  const [existingAddress, setExistingAddress] = useState('')

  return <div id="deploy-container">
    <Method key={'constructor'}
            loading={loading}
            method={method}
            onSubmit={(inputValues) => onDeploy(inputValues)}
    />
    <div style={orStyle}>or</div>
    <div style={containerStyle} className="btn-group-sm">
      <button
        style={buttonStyle}
        id="existing-button"
        className="btn btn-sm btn-info"
        disabled={loading || existingAddress === ''}
        onClick={() => onExisting(existingAddress)}>
        At Address
      </button>
      <input placeholder="Existing contract address"
             className="form-control"
             id="existing-input"
             disabled={loading}
             style={inputStyle}
             onChange={(e) => setExistingAddress(e.target.value)}
             value={existingAddress}
             type="text"/>
    </div>
  </div>

}
