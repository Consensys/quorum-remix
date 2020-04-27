const elements = {
  privateTransaction: '#private-checkbox-row',
  privateForSelect: '#private-for-select',
  privateForInput: '#private-for-select input',
  privateForDropdown: '#private-for-select div[class*="indicatorContainer"]:last-of-type',
  privateForMenu: '#private-for-select div[class*="menu"]',
  privateForFirstBubble: '#private-for-select div[class*="multiValue"]:nth-child(1) div:nth-child(2)',
  privateForOption: '#private-for-select div[class*="option"]',
  privateForOptionDelete: '#private-for-select div[class*="option"] .fa-close',
  privateFromSelect: '#private-from-select',
  privateFromInput: '#private-from-select input',
  privateFromDropdown: '#private-from-select div[class*="indicatorContainer"]:last-of-type',
  privateFromMenu: '#private-from-select div[class*="menu"]',
  privateFromFirstBubble: '#private-from-select div[class*="multiValue"]:nth-child(1) div:nth-child(2)',
  privateFromOption: '#private-from-select div[class*="option"]',
  privateFromOptionDelete: '#private-from-select div[class*="option"] .fa-close',
}

const commands = [{
  togglePrivate: function () {
    return this.click('@privateTransaction')
  },
  addPrivateForKey: function (key) {
    return this.setValue('@privateForInput', key)
      .sendKeys('@privateForInput', this.api.Keys.ENTER)
  },
  togglePrivateForMenu: function () {
    this.click('@privateForDropdown')
    this.api.pause(100)
    return this
  },
  selectPrivateForOption: function (key) {
    this.api
      .useXpath()
      .click(`//*[@id='private-for-select']//div[contains(text(), '${key}')]`)
      .useCss()
      .pause(100)
    return this
  },
  closeFirstPrivateForBubble: function () {
    this.click('@privateForFirstBubble')
    this.api.pause(100)
    return this
  },
  deleteFirstPrivateForOption: function () {
    this.click('@privateForOptionDelete')
    this.api.pause(100)
    return this
  },
  addPrivateFromKey: function (key) {
    return this.setValue('@privateFromInput', key)
      .sendKeys('@privateFromInput', this.api.Keys.ENTER)
  },
  togglePrivateFromMenu: function () {
    this.click('@privateFromDropdown')
    this.api.pause(100)
    return this
  },
  closeFirstPrivateFromBubble: function () {
    this.click('@privateFromFirstBubble')
    this.api.pause(100)
    return this
  },
  deleteFirstPrivateFromOption: function () {
    this.click('@privateFromOptionDelete')
    this.api.pause(100)
    return this
  },
}]

module.exports = {
  commands,
  elements,
}
