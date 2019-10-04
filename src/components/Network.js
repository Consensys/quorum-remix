import { Store } from '../Store'
import React from 'react'

export function Network () {
  const {
    provider,
    endpoint,
    details: { name, id }
  } = React.useContext(Store).state.network

  return <div>
    <div><strong>Network: </strong>{name} ({id})</div>
    <div>{endpoint} ({provider})</div>
    </div>
}
