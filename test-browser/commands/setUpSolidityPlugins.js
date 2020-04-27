const EventEmitter = require('events')

class setUpSolidityPlugins extends EventEmitter {
  command (target) {
    this.api
      // remix-alpha and non-ethereum.org sites show a warning dialog, close it if it exists
      .clickItemIfExists('#modal-footer-ok')
      .pause(1000)
      .click('#icon-panel div[plugin="pluginManager"]')
      .scrollAndClick('#pluginManager article[id="remixPluginManagerListItem_solidity"] button')
      .pause(1000)
      .scrollAndClick('#pluginManager article[id="remixPluginManagerListItem_udapp"] button')
      .scrollAndClick('#pluginManager article[id="remixPluginManagerListItem_solidityStaticAnalysis"] button')
      .scrollAndClick('#pluginManager article[id="remixPluginManagerListItem_debugger"] button')
      .clickLaunchIcon('solidity')
      .pause(500)
      .clickItemIfExists('#autoCompile')
      .scrollAndClick('#icon-panel div[plugin="fileExplorers"]')
      .pause(100)
      .click('div[key="browser/1_Storage.sol"]')
      .pause(100)
      .perform(() => {
        this.emit('complete')
      })
    return this
  }
}

module.exports = setUpSolidityPlugins
