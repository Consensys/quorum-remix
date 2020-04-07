import React, { useEffect } from 'react'
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

  useEffect(() => {
    // maybe a better way to do this, but select the first key if unset or
    // if selected key is no longer in the list of keys from the server
    if (keysFromServer.length > 0 && !keysFromServer.includes(privateFrom)) {
      dispatch(updatePrivateFrom(keysFromServer[0]))
    }
  }, [keysFromServer]) // eslint-disable-line react-hooks/exhaustive-deps

  return <div>
    <PrivateSelection
        containerId={"private-from-select"}
        privateKey={privateFrom}
        userKeys={keysFromUser}
        serverKeys={keysFromServer}
        isMulti={false}
        onUpdate={(selection) => dispatch(updatePrivateFrom(selection))}
        onAdd ={(option) => dispatch(addPublicKey(option))}
        onRemove = {(option) => dispatch(removePublicKey(option))}/>
    </div>
}
