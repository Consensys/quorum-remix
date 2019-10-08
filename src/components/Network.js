import { Store } from '../Store'
import React from 'react'

export function Network () {
  const {
    provider,
    endpoint,
    tesseraEndpoint,
    details: { name, id }
  } = React.useContext(Store).state.network

  return <div>
    <div><strong>Network: </strong>{name} ({id})</div>
    <div>{endpoint} ({provider})</div>
    <div>Tessera endpoint: {tesseraEndpoint}</div>
    </div>
}
