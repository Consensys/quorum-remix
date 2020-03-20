import React from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import {
  addPublicParty,
  removePublicParty,
  updatePrivateFor
} from '../actions'
import { PrivateSelection } from './PrivateSelection'

export function PrivateFor () {
  const dispatch = useDispatch()

  const privateFor = useSelector(state => state.txMetadata.privateFor)
  const keysFromUser =
    useSelector(state => state.tessera.partiesFromUser, shallowEqual)
  const keysFromServer =
    useSelector(state => state.tessera.partiesFromServer, shallowEqual)

  return <div>
      <PrivateSelection
          containerId={'private-for-select'}
          privateKey={privateFor}
          userKeys={keysFromUser}
          serverKeys={keysFromServer}
          isMulti={true}
          onUpdate={(selection) => dispatch(updatePrivateFor(selection))}
          onAdd ={(option) => dispatch(addPublicParty(option))}
          onRemove = {(option) => dispatch(removePublicParty(option))}/>
      </div>
}
