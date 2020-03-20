import React from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import {
  updatePrivateFrom,
  addPublicKey,
  removePublicKey,
} from '../actions'
import { PrivateSelection } from './PrivateSelection'


export function PrivateFrom () {
  const dispatch = useDispatch()

  const privateFrom = [useSelector(state => state.txMetadata.privateFrom)]
  const keysFromUser =
    useSelector(state => state.tessera.keysFromUser, shallowEqual)
  const keysFromServer =
    useSelector(state => state.tessera.keysFromServer, shallowEqual)

  return <div>
    <PrivateSelection
        containerId={'private-from-select'}
        privateKey={privateFrom}
        userKeys={keysFromUser}
        serverKeys={keysFromServer}
        isMulti={false}
        onUpdate={(selection) => dispatch(updatePrivateFrom(selection))}
        onAdd ={(option) => dispatch(addPublicKey(option))}
        onRemove = {(option) => dispatch(removePublicKey(option))}/>
    </div>
}
