import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updatePrivacyFlag,
} from '../actions'
import { bootstrapSelectStyle } from '../utils/Styles'

export function PrivacyFlag () {
  const dispatch = useDispatch()
  const privacyFlag = useSelector(state => state.txMetadata.privacyFlag)

  return <div>
    <select style={bootstrapSelectStyle} className="form-control"
            value={privacyFlag}
            id="value-denomination-select"
            onChange={(e) => dispatch(updatePrivacyFlag(e.target.value))}>
      <option value="0">Standard</option>
      <option value="1">Counter Party Protection</option>
      <option value="3">Private State Validation</option>
    </select>
  </div>
}
