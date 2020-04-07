const elements = {
  deployButton: {
    selector: '//button[contains(text(),"Deploy")]',
    locateStrategy: 'xpath',
  },
  existingInput: '#existing-input',
  existingButton: '#existing-button',
}

const commands = [{
  deploy: function () {
    return this.click('@deployButton')
  },
  setAddress: function (address) {
    return this.clearValue('@existingInput').setValue('@existingInput', address)
  },
  attach: function () {
    return this.click('@existingButton')
  }
}]

module.exports = {
  commands,
  elements,
}
