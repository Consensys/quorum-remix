export const appStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  minHeight: '100%',
  padding: 6,
  paddingBottom: 6,
  paddingLeft: 12,
  paddingRight: 12
}

export const networkStyle = {
  display: 'flex',
  alignItems: 'flex-end',
  flexDirection: 'column',
  width: '100%',
}

export const formContainerStyle = {
  width: '100%',
}

export const containerStyle = {
  display: 'flex',
  marginTop: 8,
  alignItems: 'center'
}

export const buttonStyle = {
  margin: 0,
  minWidth: 100,
  width: 100,
  height: 32,
  wordBreak: 'inherit',
  borderRadius: 3,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderRight: 0,
  overflowX: 'hidden',
  textOverflow: 'ellipsis',
}

export const inputStyle = {
  border: '1px solid #dddddd',
  padding: '.36em',
  borderRadius: 5,
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  borderLeft: 0,
  flexGrow: 1,
  height: 32,
}

export const contractStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: 8,
}

export const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 0,
}

export const bodyStyle = {
  padding: '0px 0 10px 10px',
  border: '1px solid rgba(0,0,0,0.125)',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: '0.25rem',
  borderTopRightRadius: 0,
  borderBottomRightRadius: '0.25rem',
}

export const orStyle = {
  width: 100,
  height: 28,
  textAlign: 'center',
  marginTop: 4,
  marginBottom: -5
}

export const iconStyle = {
  cursor: 'pointer',
  minWidth: 28,
  textAlign: 'center',
  fontSize: 16,
  padding: 8,
  verticalAlign: 'center',
  textDecoration: 'none',
}

export const smallIconStyle = {
  cursor: 'pointer',
  textAlign: 'center',
  fontSize: 11,
  padding: 3,
  verticalAlign: 'center',
  textDecoration: 'none',
}

export const ellipsisStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '11px',
}

export const addonButtonStyle = {
  margin: 0,
  wordBreak: 'inherit',
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderRight: 0,
}

export const txMetaRowStyle = {
  display: 'flex',
  alignItems: 'center',
  paddingTop: 4,
  width: '100%',
}

export const txMetaRowRightStyle = {
  display: 'flex',
  alignItems: 'center',
  paddingTop: 4,
  justifyContent: 'flex-end',
}

export const labelStyle = {
  fontSize: 12,
  whiteSpace: 'nowrap',
  minWidth: 72,
}

export const checkboxStyle = {
  marginLeft: 4,
}

export const checkboxLabelStyle = {
  fontSize: 12,
  whiteSpace: 'nowrap',
  minWidth: 72,
  padding: 12,
}

export const smallLabelStyle = {
  whiteSpace: 'nowrap',
  minWidth: 72,
  fontSize: 12,
}

export const inlineInputStyle = {
  maxWidth: 92,
  marginRight: 4,
}

export const largeInlineInputStyle = {
  maxWidth: 184,
  marginRight: 4,
}

export const smallCheckboxLabelStyle = {
  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export const footerStyle = {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  height: 22,
  marginTop: 12,
  fontSize: 12,
  alignItems: 'flex-end',
}

export const logoLinkStyle = {
  alignSelf: 'flex-start',
}

export const logoStyle = {
  height: 18,
}

export const errorContainerStyle = {
  display: 'flex',
  marginBottom: 6,
  width: '100%',
}

export const errorStyle = {
  wordBreak: 'break-word',
  fontSize: 11,
  color: 'red',
  width: 0,
  flexGrow: 1,
}
export const bootstrapSelectStyle = {
  paddingRight: '20px !important'
}

export const reactSelectStyle = {
  width: 0,
  flexGrow: 1
}

export const optionStyle = {
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
}
export const optionLabelContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  flexGrow: 1,
}
export const optionLabelStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: 'inherit',
  fontSize: '10pt',
}

export const statusStyle = (status) => {
  let color
  if (status === 'Connected') {
    color = 'green'
  } else if (status === 'Connecting...') {
    color = 'black'
  } else {
    color = 'red'
  }
  return {
    color,
    fontSize: 11,
    marginRight: 8,
  }
}
