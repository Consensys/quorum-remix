import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import React from 'react'


export const InputTooltip = ({ text, enabled=true, children }) => {
  if(!enabled) {
    return children
  }

  return <OverlayTrigger
    placement='bottom-start'
    trigger={'hover'}
    overlay={
      <Popover className="bg-light" id="popover-basic">
        <Popover.Content>
          {text}
        </Popover.Content>
      </Popover>
    }
  >
    {children}
  </OverlayTrigger>
}
