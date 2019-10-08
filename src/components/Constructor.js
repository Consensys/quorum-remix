import React, { useState } from 'react'
import { Method } from './Transact'

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginTop: 8,
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
}

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
