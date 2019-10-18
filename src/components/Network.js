import React from 'react'
import { iconStyle, labelStyle, txMetaRowStyle } from '../utils/Styles'
import { useDispatch, useSelector } from 'react-redux'
import { changeTesseraEndpoint } from '../actions'

export function Network () {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
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
    dispatch(changeTesseraEndpoint(endpointInput))
  }

  if(provider !== 'web3') {
    return <div>Quorum support does not work on Javascript VM or Injected Web3. <strong>Please choose a different Environment from the Deploy & Run tab.</strong></div>
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
