const elements = {
  metadataHeader: '#metadata-header',
  metadataCollapsed: '#metadata-collapsed',
  gasPriceInput: '#gas-price-input',
  gasLimitInput: '#gas-limit-input',
  valueInput: '#value-input',
  valueDenomination: '#value-denomination-select',
}

const commands = [{
  toggleMetadata: function () {
    return this.click('@metadataHeader')
  },
  setGasLimit: function (value) {
    if(value === '') {
      // clearing/setting to empty string doesn't trigger onChange, type a space, then backspace
      value = [' ', '\uE003']
    }
    return this.clearValue('@gasLimitInput').setValue('@gasLimitInput', value)
  },
}]

module.exports = {
  commands,
  elements,
}
