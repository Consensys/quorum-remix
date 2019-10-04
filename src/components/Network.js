import { Store } from '../Store'
import React from 'react'

export function Network () {
  const { state } = React.useContext(Store)
  const { network } = state

  const { id, name } = network.details

  return <div>
    <div><strong>Network: </strong>{name} ({id})</div>
    <div>{network.endpoint} ({network.provider})</div>
    </div>
}
