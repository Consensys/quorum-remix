import React from 'react'
import {
  iconStyle,
  labelStyle,
  networkStyle,
  statusStyle,
  txMetaRowRightStyle,
  txMetaRowStyle
} from '../utils/Styles'
import { useDispatch, useSelector } from 'react-redux'
import { editNetwork, saveNetwork, setError, setNetwork } from '../actions'

export function Network () {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const {
    editing,
    status,
    endpoint,
    tesseraEndpoint,
  } = state.network

  const [endpointInput, setEndpointInput] = React.useState(endpoint)
  const [tesseraEndpointInput, setTesseraEndpointInput] = React.useState(
    tesseraEndpoint)

  React.useEffect(() => {
    // in case network changes after render
    setEndpointInput(endpoint)
    setTesseraEndpointInput(tesseraEndpoint)
  }, [endpoint, tesseraEndpoint])

  const onEdit = () => {
    dispatch(editNetwork(true))
  }
  const onSave = async () => {
    dispatch(saveNetwork(endpointInput, tesseraEndpointInput))
  }
  const onCancel = () => {
    // reset to state values
    setEndpointInput(endpoint)
    setTesseraEndpointInput(tesseraEndpoint)
    dispatch(editNetwork(false))
    dispatch(setError())
  }

  const onRefresh = () => {
    dispatch(setNetwork(endpoint, tesseraEndpoint))
  }

  return <div style={networkStyle}>
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Geth RPC:</div>
      <input className="form-control"
             type="text"
             placeholder="e.g. http://localhost:22000"
             disabled={!editing}
             value={endpointInput}
             onChange={(e) => setEndpointInput(
               e.target.value)}/>
    </div>
    <div style={txMetaRowStyle}>
      <div style={labelStyle}>Tessera:</div>
      <input className="form-control"
             type="text"
             placeholder="Optional, http://localhost:9001"
             disabled={!editing}
             value={tesseraEndpointInput}
             onChange={(e) => setTesseraEndpointInput(
               e.target.value)}/>
    </div>
    {editing ?
      <div style={txMetaRowRightStyle}>
        <i style={iconStyle} className="fa fa-close"
           onClick={() => onCancel()}/>
        <i style={iconStyle} className="fa fa-check" onClick={() => onSave()}/>
      </div>
      :
      <div style={txMetaRowRightStyle}>
        <div style={statusStyle(status)}>{status}</div>
        <i style={iconStyle} className="fa fa-refresh"
           onClick={() => onRefresh()}/>
        <i style={iconStyle} className="fa fa-pencil" onClick={() => onEdit()}/>
      </div>
    }
  </div>
}
