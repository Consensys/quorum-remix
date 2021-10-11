const elements = {
  pluginManager: '#icon-panel div[plugin="pluginManager"]',
  activateQuorum: 'button[data-id="pluginManagerComponentActivateButtonquorum"]',
  remember: '#remember',
  permissionOk: '#modal-footer-ok',
  footer: '#footer',
}

const commands = [{
  activateQuorumPlugin: function () {
    return this
      .click('@pluginManager')
      .scrollAndClick('@activateQuorum')
    // permission dialog
  },
  acceptPermissions: function () {
    this.api.pause(1000)
    this.clickItemIfExists('@remember')
    this.api.pause(500)
    return this.clickItemIfExists('@permissionOk')
      .clickLaunchIcon('quorum')
  },
  switchToPluginFrame: function () {
    // this will switch to the iframe for the remaining tests
    // workaround for firefox (.frame('id') wasn't working)
    this.api.element('css selector', '#plugin-quorum', (frame) => {
      this.api.frame(frame.value)
    })
      .waitForElementVisible('.App', 15000)
    return this
  },
}]

module.exports = {
  commands,
  elements,
}
