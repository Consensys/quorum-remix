const EventEmitter = require('events')

class setUpSolidityPlugins extends EventEmitter {
  command (target) {
    this.api
      // remix-alpha and non-ethereum.org sites show a warning dialog, close it if it exists
      .clickItemIfExists('#modal-body-id button.btn-secondary')
      .pause(1000)
      .clickItemIfExists('#remixTourSkipbtn')
      .pause(1000)
      .click('button[data-id="landingPageStartSolidity"]')
      .pause(1000)
      .clickLaunchIcon('solidity')
      .pause(500)
      .clickItemIfExists('#autoCompile')
      .clickItemIfExists('div[plugin="fileExplorerIcons"]')
      .pause(100)
      // already expanded in alpha, try clicking directly first
      .clickItemIfExists('div[data-id="treeViewDivtreeViewItemcontracts/1_Storage.sol"]')
      // if not, click the contract folder to expand, then the contract
      .clickItemIfExists('div[data-id="treeViewDivtreeViewItemcontracts"]')
      .clickItemIfExists('div[data-id="treeViewDivtreeViewItemcontracts/1_Storage.sol"]')
      .pause(100)
      .perform(() => {
        this.emit('complete')
      })
    return this
  }
}

module.exports = setUpSolidityPlugins
