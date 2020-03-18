import React from 'react'

export function LoadingSmall ({ visible, style }) {
  return visible ?
    <div
      style={style}
      className="spinner-border spinner-border-sm"
      role="status">
      <span className="sr-only">Loading...</span>
    </div> : ''
}
