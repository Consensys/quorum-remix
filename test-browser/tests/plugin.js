require('dotenv-flow').config()
const USERNAME = process.env.RPC_USERNAME
const PASSWORD = process.env.RPC_PASSWORD
const RPC_SCHEME = process.env.RPC_SCHEME
const URL = process.env.REMIX_URL
const NODE_ONE_HOST = process.env.NODE_ONE_HOST
const NODE_ONE_PUB_KEY = process.env.NODE_ONE_PUB_KEY
const NODE_TWO_HOST = process.env.NODE_TWO_HOST
const NODE_TWO_PUB_KEY = process.env.NODE_TWO_PUB_KEY
const NODE_THREE_HOST = process.env.NODE_THREE_HOST
const NODE_THREE_PUB_KEY = process.env.NODE_THREE_PUB_KEY

if(!RPC_SCHEME) {
  throw new Error("Please copy .env.local.template to .env.local to properly set test ENV variables.")
}
if(PASSWORD === 'PASSWORD_HERE') {
  throw new Error("You forgot to replace the rpc password in .env.local.")
}

if(URL.indexOf('remix-dev.goquorum.com') > 0) {
  testLocalhostConnection().catch((error) => {
    throw new Error("Couldn't connect to http://localhost:3000. Make sure you run `yarn start` before running the tests.")
  })
}

let ADDRESS = 'not set'

module.exports = {
  before: function (browser, done) {
    browser
    .url(URL)
    .pause(2000)
    // remix-alpha and non-ethereum.org sites show a warning dialog, close it if it exists
    .execute(function () {
      const dialogButton = document.querySelector('#modal-footer-ok')
      if(dialogButton) {
        dialogButton.click()
      }
    })
    browser.pause(1000)
    .click('#icon-panel div[plugin="pluginManager"]')
    .scrollAndClick('#pluginManager article[id="remixPluginManagerListItem_solidity"] button')
    .pause(1000)
    .scrollAndClick('#pluginManager article[id="remixPluginManagerListItem_udapp"] button')
    .scrollAndClick('#pluginManager article[id="remixPluginManagerListItem_solidityStaticAnalysis"] button')
    .scrollAndClick('#pluginManager article[id="remixPluginManagerListItem_debugger"] button')
    .scrollAndClick('#icon-panel div[plugin="fileExplorers"]')
    .clickLaunchIcon('solidity')
    .pause(500)
    .click('#autoCompile')
    .perform(() => done())
  },
  '01 Install Quorum plugin': function (browser) {
    browser
    .waitForElementVisible('#icon-panel', 10000)
    .click('#icon-panel div[plugin="pluginManager"]')
    .scrollAndClick(
        '#pluginManager article[id="remixPluginManagerListItem_quorum"] button')
    // permission dialog
    .waitForElementVisible('#modal-dialog', 5000)
    // for some reason .click('#remember') isn't working
    .execute(function () {
      document.querySelector('#remember').click()
    })
    .pause(500)
    .click('#modal-footer-ok')
    // load a contract so that the compiler has a result
    .click('#icon-panel div[plugin="fileExplorers"]')
    .click('div[key="browser/1_Storage.sol"]')
    .clickLaunchIcon('quorum')
    .pause(500)
    // this will switch to the iframe for the remaining tests
    // workaround for firefox (.frame('id') wasn't working)
    // TODO once remix-plugin is merged, start using #plugin-quorum
    // browser.element('css selector', '#plugin-quorum', (frame) => {
    .element('css selector', '#plugins div iframe', (frame) => {
      browser.frame(frame.value)
    }).pause(500)
  },
  '02 Connect to Quorum node': function (browser) {
    browser
    .waitForElementVisible('.App', 5000)
    .setValue('#geth-endpoint', rpcUrl(NODE_ONE_HOST))
    .click('#network-form .fa-check')
    .expect.element('#connection-status').text.to.contain('Connected').before(10000)
  },
  '03 Set privateFor': function (browser) {
    browser
    .setValue('#private-for-select input', 'shouldFail')
    .sendKeys('#private-for-select input', browser.Keys.ENTER)
    .waitForElementVisible('#error-container', 5000)
    .expect.element('#error-container').text.to.contain('Public key length must equal 44').before(5000)
    browser
    .click('#error-container .fa-close')
    .setValue('#private-for-select input', NODE_ONE_PUB_KEY)
    .sendKeys('#private-for-select input', browser.Keys.ENTER)
    .setValue('#private-for-select input', NODE_TWO_PUB_KEY)
    .sendKeys('#private-for-select input', browser.Keys.ENTER)
    .setValue('#private-for-select input', NODE_THREE_PUB_KEY)
    .sendKeys('#private-for-select input', browser.Keys.ENTER)
    browser.expect.element('#private-for-select').text.to.contain(NODE_ONE_PUB_KEY).before(5000)
    browser.expect.element('#private-for-select').text.to.contain(NODE_TWO_PUB_KEY).before(5000)
    browser.expect.element('#private-for-select').text.to.contain(NODE_THREE_PUB_KEY).before(5000)
    browser.click('#private-for-select div[class*="multiValue"]:nth-child(3) div:nth-child(2)')
  },
  '04 Deploy a contract': function (browser) {
    browser
    .useXpath()
    .waitForElementVisible("//button[contains(text(),'Deploy') and not(@disabled)]", 5000)
    .click("//button[contains(text(),'Deploy')]")
    .pause(500)
    .useCss()
    .waitForElementVisible(
        '.deployed-contract .fa-caret-right', 5000)
    .click('.deployed-contract .fa-caret-right')
    .waitForElementVisible('div[data-method="store"]', 5000)
    // save address for later
    browser.getText('.deployed-contract .input-group-text', function(result) {
      ADDRESS = result.value.replace("Storage(", "").replace(")", "")
    })
    browser.expect.element('.deployed-contract').text.to.contain(NODE_ONE_PUB_KEY).before(5000)
    browser.expect.element('.deployed-contract').text.to.contain(NODE_TWO_PUB_KEY).before(5000)
    browser.expect.element('.deployed-contract').text.to.not.contain(NODE_THREE_PUB_KEY).before(5000)
  },
  '05 Interact with contract': function (browser) {
    browser
    .setValue('div[data-method="store"] input', '123')
    .click('div[data-method="store"] button')
    .expect.element('div[data-method="store"]').text.to.contain('Success').before(5000)

    browser
    .click('div[data-method="retreive"] button')
    .expect.element('div[data-method="retreive"]').text.to.contain('123').before(5000)
  },
  '06 Interact with contract from node 2': function (browser) {
    browser.setValue('#existing-input', ADDRESS)
    .click('.deployed-contract .fa-close')

    // connect to node 2
    browser
    .click('#network-form .fa-pencil')
    .clearValue('#geth-endpoint')
    .setValue('#geth-endpoint', rpcUrl(NODE_TWO_HOST))
    .click('#network-form .fa-check')
    .expect.element('#connection-status').text.to.contain('Connected').before(5000)

    browser
    .click('#existing-button')
    .waitForElementVisible('.deployed-contract .fa-caret-right', 5000)
    .click('.deployed-contract .fa-caret-right')
    .waitForElementVisible('div[data-method="store"]', 5000)
    .click('div[data-method="retreive"] button')
    .expect.element('div[data-method="retreive"]').text.to.contain('123').before(5000)

    browser
    .setValue('div[data-method="store"] input', '333')
    .click('div[data-method="store"] button')
    .expect.element('div[data-method="store"]').text.to.contain('Success').before(5000)

  },
  '07 Fail to interact with contract from node 3': function (browser) {
    browser.click('.deployed-contract .fa-close')
    .click('#network-form .fa-pencil')
    .clearValue('#geth-endpoint')
    .setValue('#geth-endpoint', rpcUrl(NODE_THREE_HOST))
    .click('#network-form .fa-check')
    .expect.element('#connection-status').text.to.contain('Connected').before(5000)

    browser
    .click('#existing-button')
    .expect.element('#error-container').text.to.contain('Contract does not exist at').before(5000)

    browser.end()
  },
}

function rpcUrl (host) {
  let authString = ''
  if(USERNAME && PASSWORD) {
    authString = `${USERNAME}:${PASSWORD}@`
  }
  return `${RPC_SCHEME}://${authString}${host}`
}

function testLocalhostConnection () {
  const axios = require('axios')
  return axios.get('http://localhost:3000').then((result) => {
    // success, do nothing
  })
}
