export const appStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  minHeight: '100%',
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
  alignItems: 'center',
  marginTop: 8,
}

export const buttonStyle = {
  margin: 0,
  minWidth: 100,
  width: 100,
  wordBreak: 'inherit',
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderRight: 0,
}

export const inputStyle = {
  fontSize: 10,
  padding: '.25rem',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  borderLeft: 0,
  flexGrow: 1,
}

export const contractStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: 8,
}

export const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  borderRadius: '0.25rem',
  border: '1px solid #95a5a6',
  background: '#95a5a6',
  padding: '4px',
}

export const bodyStyle = {
  padding: '0px 0 10px 10px',
  border: '1px solid rgba(0,0,0,0.125)',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: '0.25rem',
  borderTopRightRadius: 0,
  borderBottomRightRadius: '0.25rem',
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

export const ellipsisStyle = {
  backgroundColor: '#ecf0f1',
  border: '1px solid #ced4da',
  borderRadius: '0.25rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: '#7b8a8b',
  fontSize: '11px',
  padding: '0.375rem 0.75rem',
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
  whiteSpace: 'nowrap',
  minWidth: 72,
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

export const checkboxLabelStyle = {
  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export const logoStyle = {
  height: 18,
  alignSelf: 'flex-end',
  marginTop: 12,
  marginBottom: 12,
}

export const errorStyle = {
  fontSize: 11,
  color: 'red',
  marginBottom: 6,
  width: '100%',
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

