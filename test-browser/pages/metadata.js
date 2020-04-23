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
    this.clearValue('@gasLimitInput')
    if(value === '') {
      // clearing/setting to empty string doesn't trigger onChange, type a space, then backspace
      this.setValue('@gasLimitInput', ' ')
      this.api.pause(100)
      this.sendKeys('@gasLimitInput', '\uE003')

    } else {
      this.setValue('@gasLimitInput', value)
    }
  },
}]

module.exports = {
  commands,
  elements,
}
