import { Tooltip as MuiTooltip, Portal as MuiPortal } from '@mui/material'
import * as React from 'react'

export const Tooltip = React.forwardRef(function Tooltip(props, ref) {
  const {
    showArrow = true,
    children,
    disabled,
    portalled = true,
    content,
    contentProps,
    portalRef,
    ...rest
  } = props

  if (disabled) return children

  const tooltipContent = (
    <MuiTooltip
      title={content}
      arrow={showArrow}
      ref={ref}
      {...rest}
    >
      {/* MUI Tooltip requires a single React element child that can hold a ref */}
      {React.cloneElement(children, { ref })}
    </MuiTooltip>
  )

  return portalled && portalRef ? 
    <MuiPortal container={portalRef}>{tooltipContent}</MuiPortal> : 
    tooltipContent
})
