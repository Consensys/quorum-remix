import React, { useState } from 'react'
import { Method } from './Transact'
import { buttonStyle, containerStyle, inputStyle } from '../utils/Styles'

export const Constructor = ({ method, onDeploy, onExisting }) => {

  const [existingAddress, setExistingAddress] = useState('')

  return <div>
    <Method key={'constructor'}
            method={method}
            onSubmit={(inputValues) => onDeploy(inputValues)}
    />
    <div>or</div>
    <div style={containerStyle} className="">
      <button style={buttonStyle} className="btn btn-sm btn-info" onClick={() => onExisting(existingAddress)}>At
      </button>
      <input placeholder="Existing contract address"
             className="form-control"
             style={inputStyle}
             onChange={(e) => setExistingAddress(e.target.value)}
             value={existingAddress}
             type="text"/>
    </div>
  </div>

}
