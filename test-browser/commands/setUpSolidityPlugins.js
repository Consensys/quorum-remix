const EventEmitter = require('events')

class setUpSolidityPlugins extends EventEmitter {
  command (target) {
    this.api
      // remix-alpha and non-ethereum.org sites show a warning dialog, close it if it exists
      .clickItemIfExists('#modal-footer-ok')
      .pause(1000)
      .click('button[data-id="landingPageStartSolidity"]')
      .pause(1000)
      .clickLaunchIcon('solidity')
      .pause(500)
      .clickItemIfExists('#autoCompile')
      .scrollAndClick('#icon-panel div[plugin="fileExplorers"]')
      .pause(100)
      // newer structure
      .clickItemIfExists('div[data-id="treeViewDivtreeViewItemcontracts"]')
      .clickItemIfExists('div[data-id="treeViewDivtreeViewItemcontracts/1_Storage.sol"]')
      // current structure
      .clickItemIfExists('div[data-id="treeViewDivtreeViewItembrowser/contracts/1_Storage.sol"]')
      .pause(100)
      .perform(() => {
        this.emit('complete')
      })
    return this
  }
}

module.exports = setUpSolidityPlugins
