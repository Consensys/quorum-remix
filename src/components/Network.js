import { Store } from '../Store'
import React from 'react'

export function Network () {
  const { state, dispatch } = React.useContext(Store)
  const {
    provider,
    endpoint,
    tesseraEndpoint,
    details: { name, id }
  } = state.network

  const [endpointInput, setEndpointInput] = React.useState(tesseraEndpoint)

  React.useEffect(() => {
    // in case network changes after render
    setEndpointInput(tesseraEndpoint)
  }, [tesseraEndpoint])
  const onUpdateClicked = (e) => {
    e.preventDefault()
    dispatch({ type: 'CHANGE_TESSERA_ENDPOINT', payload: endpointInput})
  }

  return <div>
    <div><strong>Network: </strong>{name} ({id})</div>
    <div>{endpoint} ({provider})</div>
    <div>Tessera endpoint: <input className="form-control" type="text"
                                  value={endpointInput}
                                  onChange={(e) => setEndpointInput(
                                    e.target.value)}/>
      <button type="submit" onClick={(e) => onUpdateClicked(e)}>Update</button>
    </div>
  </div>
}
