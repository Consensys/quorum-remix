import React from 'react'
import { errorContainerStyle, errorStyle, smallIconStyle } from '../utils/Styles'
import { useDispatch, useSelector } from 'react-redux'
import { setError } from '../actions'

export function Error () {
  const dispatch = useDispatch()
  const error = useSelector(state => state.error)
  if (error === '') {
    return ''
  }
  return <div id="error-container" style={errorContainerStyle}>
    <div style={errorStyle}>
      {error}
    </div>
    <i style={smallIconStyle} className="fa fa-close"
       onClick={() => dispatch(setError())}/>
  </div>
}
