import React, { useState } from 'react'
import { Method } from './Transact'

export const Constructor = ({ method, onDeploy, onExisting }) => {

  const [existingAddress, setExistingAddress] = useState('')

  return <div>
    <Method key={'constructor'}
            method={method}
            onSubmit={(inputValues) => onDeploy(inputValues)}
            inlineButton={false}
    />
    <div>or</div>
    <div>
      <button onClick={() => onExisting(existingAddress)}>At</button>
      <input onChange={(e) => setExistingAddress(e.target.value)}
             value={existingAddress} placeholder={'Existing address'}
             type="text"/>
    </div>
  </div>

}
