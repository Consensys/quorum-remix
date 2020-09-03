const elements = {
  deployedContract: '.deployed-contract',
  deployedContractExpand: '.deployed-contract .methCaret',
  deployedContractClose: '.deployed-contract .fa-close',
  deployedAddress: '.deployed-contract .input-group-text',
  methodContainerGet: 'div[data-method="retrieve"]',
  getButton: 'div[data-method="retrieve"] button',
  methodContainerSet: 'div[data-method="store"]',
  setButton: 'div[data-method="store"] button',
  setInput: 'div[data-method="store"] input',
}

const commands = [{
  setInput: function (value) {
    return this.clearValue('@setInput').setValue('@setInput', value)
  },
  get: function () {
    return this.click('@getButton')
  },
  set: function() {
    return this.click('@setButton')
  },
  getAddress: async function () {
    return new Promise(((resolve, reject) => {
      this.getText('@deployedAddress', function (result) {
        resolve(result.value.replace("Storage(", "").replace(")", ""))
      })
    }))
  },
  toggleExpand: function () {
    return this.click('@deployedContractExpand')
  },
  close: function () {
    return this.click('@deployedContractClose')
  },
  testContractMethods: function (expectedValue, newValue) {
    this
      .toggleExpand()
      .get()
      .expect.element('@methodContainerGet').text.to.contain(expectedValue).before(15000)

    this
      .setInput(newValue)
      .set()
      .expect.element('@methodContainerSet').text.to.contain('Success').before(15000)

    this.get()
      .expect.element('@methodContainerGet').text.to.contain(newValue).before(15000)

    this.close()
      .expect.element('@deployedContract').to.not.be.present.before(5000)
  }
}]

module.exports = {
  commands,
  elements,
}
