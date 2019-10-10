import { Store } from '../Store'
import React from 'react'
import { iconStyle, labelStyle, txMetaRowStyle } from '../utils/Styles'

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
    <div><strong>Network: </strong>{name} {provider} ({id}) </div>
    <div style={{ marginBottom: 4 }}><strong>Endpoint:</strong> {endpoint}</div>
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Tessera:</div>
      <input className="form-control" type="text"
                                  value={endpointInput}
                                  onChange={(e) => setEndpointInput(
                                    e.target.value)}/>
      <i style={iconStyle} className="fa fa-refresh" onClick={(e) => onUpdateClicked(e)}/>

    </div>
  </div>
}
