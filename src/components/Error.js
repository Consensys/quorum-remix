import React from 'react'
import { errorStyle } from '../utils/Styles'
import { useSelector } from 'react-redux'

export function Error () {
  const error = useSelector(state => state.error)
  if (error === '') {
    return ''
  }
  return <div style={errorStyle}>{error}</div>
}
