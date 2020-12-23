require('dotenv-flow').config()
const USERNAME = process.env.RPC_USERNAME
const PASSWORD = process.env.RPC_PASSWORD
const RPC_SCHEME = process.env.RPC_SCHEME
const URL = process.env.REMIX_URL
const NODE_ONE_HOST = process.env.NODE_ONE_HOST
const NODE_ONE_TESSERA = process.env.NODE_ONE_TESSERA
const NODE_ONE_PUB_KEY = process.env.NODE_ONE_PUB_KEY
const NODE_TWO_HOST = process.env.NODE_TWO_HOST
const NODE_TWO_TESSERA = process.env.NODE_TWO_TESSERA
const NODE_TWO_PUB_KEY = process.env.NODE_TWO_PUB_KEY
const NODE_THREE_HOST = process.env.NODE_THREE_HOST
const NODE_THREE_TESSERA = process.env.NODE_THREE_TESSERA
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

let PUBLIC_ADDRESS = 'not set'
let PRIVATE_SELF_ADDRESS = 'not set'
let PRIVATE_ADDRESS = 'not set'

module.exports = {
  before: function (browser, done) {
    done()
  },

  'Setup Remix': function (browser) {
    browser
      .url(URL)
      .waitForElementVisible('#icon-panel', 10000)
      .setUpSolidityPlugins()
  },

  'Install Quorum plugin': function (browser) {
    browser.page.remix()
      .activateQuorumPlugin()
      .acceptPermissions()
      .switchToPluginFrame()
      .expect.element('@footer').text.to.contain('Version')
  },

  'Connect to Quorum node': function (browser) {
    browser.page.network()
      .setQuorumEndpoint(rpcUrl(NODE_ONE_HOST))
      .save()
      .expect.element('@status').text.to.contain('Connected').before(15000)
  },

  'Toggle transaction metadata': function (browser) {
    const metadata = browser.page.metadata()
    metadata.expect.element('@metadataCollapsed').to.be.visible
    metadata.expect.element('@gasPriceInput').to.be.not.present
    metadata.expect.element('@gasLimitInput').to.be.not.present
    metadata.expect.element('@valueInput').to.be.not.present
    metadata.expect.element('@valueDenomination').to.be.not.present

    metadata.toggleMetadata()
    metadata.expect.element('@metadataCollapsed').to.be.not.present.before(500)
    metadata.expect.element('@gasPriceInput').to.be.visible
    metadata.expect.element('@gasLimitInput').to.be.visible
    metadata.expect.element('@valueInput').to.be.visible
    metadata.expect.element('@valueDenomination').to.be.visible
  },

  'Deploy public contract (and test estimate gas)': async function (browser) {
    const metadata = browser.page.metadata()
    const deploy = browser.page.deploy()
    const contract = browser.page.contract()

    metadata.setGasLimit('70000')
    deploy.expect.element('@deployButton').to.be.enabled
    deploy.deploy()
    browser.expect.element('#error-container').text.to.contain('The contract code couldn\'t be stored, please check your gas limit.').before(5000)

    metadata.setGasLimit('')
    deploy.deploy()
    contract.expect.element('@deployedContract').to.be.visible.before(15000)

    // save address for later
    PUBLIC_ADDRESS = await contract.getAddress()

    contract.toggleExpand()
      .waitForElementVisible('@methodContainerGet', 10000)
    contract.expect.element('@deployedContract').text.to.not.contain(NODE_ONE_PUB_KEY)
    contract.expect.element('@deployedContract').text.to.not.contain(NODE_TWO_PUB_KEY)
    contract.expect.element('@deployedContract').text.to.not.contain(NODE_THREE_PUB_KEY)
    contract.toggleExpand()

    contract.testContractMethods('0', '123')

    // close metadata
    metadata.toggleMetadata()
    metadata.expect.element('#metadata-collapsed').to.be.visible.before(500)
    metadata.expect.element('#gas-price-input').to.be.not.present
  },


  'Toggle Private Transaction': function (browser) {
    const privacy = browser.page.privacy()
    privacy.expect.element('#private-for-select').to.not.be.present
    privacy.expect.element('#private-from-select').to.not.be.present
    privacy.togglePrivate()
    privacy.expect.element('#private-for-select').to.be.visible.before(500)
    privacy.expect.element('#private-from-select').to.be.visible.before(500)
  },

  'Private For Keys from User': function (browser) {
    const privacy = browser.page.privacy()
    privacy.addPrivateForKey('shouldFail')

    browser.expect.element('#error-container').text.to.contain('Public key length must equal 44').before(5000)
    browser.click('#error-container .fa-close')

    privacy
      .addPrivateForKey(NODE_ONE_PUB_KEY)
      .addPrivateForKey(NODE_TWO_PUB_KEY)
      .addPrivateForKey(NODE_THREE_PUB_KEY)
    privacy.expect.element('@privateForSelect').text.to.contain(NODE_ONE_PUB_KEY).before(5000)
    privacy.expect.element('@privateForSelect').text.to.contain(NODE_TWO_PUB_KEY).before(5000)
    privacy.expect.element('@privateForSelect').text.to.contain(NODE_THREE_PUB_KEY).before(5000)

    privacy
      .closeFirstPrivateForBubble()
      .closeFirstPrivateForBubble()
      .closeFirstPrivateForBubble()
      .togglePrivateForMenu()
    privacy.expect.element('@privateForMenu').text.to.contain(NODE_ONE_PUB_KEY).before(1000)
    privacy.expect.element('@privateForMenu').text.to.contain(NODE_TWO_PUB_KEY).before(1000)
    privacy.expect.element('@privateForMenu').text.to.contain(NODE_THREE_PUB_KEY).before(1000)

    privacy
      .deleteFirstPrivateForOption()
      .deleteFirstPrivateForOption()
      .deleteFirstPrivateForOption()
      .expect.element('@privateForMenu').text.to.contain('No options').before(1000)
    privacy.togglePrivateForMenu()
  },

  'Private From Keys from User': function (browser) {
    const privacy = browser.page.privacy()
    privacy.addPrivateFromKey('shouldFail')

    browser.expect.element('#error-container').text.to.contain('Public key length must equal 44').before(5000)
    browser.click('#error-container .fa-close')

    privacy.addPrivateFromKey(NODE_ONE_PUB_KEY)
    privacy.expect.element('@privateFromSelect').text.to.contain(NODE_ONE_PUB_KEY).before(5000)

    privacy.togglePrivateFromMenu()
    privacy.expect.element('@privateFromMenu').text.to.contain(NODE_ONE_PUB_KEY).before(1000)

    privacy
      .deleteFirstPrivateFromOption()
      .expect.element('@privateFromMenu').text.to.contain('No options').before(1000)

    privacy.togglePrivateFromMenu()
  },

  'Connect to Tessera Endpoint': function (browser) {
    browser.page.network()
      .edit()
      .setTesseraEndpoint(rpcUrl(NODE_ONE_TESSERA))
      .save()
      .expect.element('@status').text.to.contain('Connected').before(15000)

  },

  'Public Keys from Server': function (browser) {
    const privacy = browser.page.privacy()
    privacy.togglePrivateFromMenu()
    privacy.expect.element('@privateFromMenu').text.to.contain(NODE_ONE_PUB_KEY).before(1000)
    privacy.expect.element('@privateFromOptionDelete').to.not.be.present


    privacy.click('@privateFromOption')
    privacy.expect.element('@privateFromSelect').text.to.contain(NODE_ONE_PUB_KEY).before(5000)


    privacy.togglePrivateForMenu()
    privacy.expect.element('@privateForMenu').text.to.contain(NODE_ONE_PUB_KEY).before(1000)
    privacy.expect.element('@privateForMenu').text.to.contain(NODE_TWO_PUB_KEY).before(1000)
    privacy.expect.element('@privateForMenu').text.to.contain(NODE_THREE_PUB_KEY).before(1000)

    privacy
      .selectPrivateForOption(NODE_ONE_PUB_KEY)
      .togglePrivateForMenu()
      .selectPrivateForOption(NODE_TWO_PUB_KEY)
    privacy.expect.element('@privateForSelect').text.to.contain(NODE_ONE_PUB_KEY).before(5000)
    privacy.expect.element('@privateForSelect').text.to.contain(NODE_TWO_PUB_KEY).before(5000)
  },

  'Deploy a private contract': async function (browser) {
    const deploy = browser.page.deploy()
    const contract = browser.page.contract()

    deploy.expect.element('@deployButton').to.be.enabled
    deploy.deploy()
    contract.expect.element('@deployedContract').to.be.visible.before(15000)

    // save address for later
    PRIVATE_ADDRESS = await contract.getAddress()

    contract.toggleExpand()
      .waitForElementVisible('@methodContainerGet', 10000)
    contract.expect.element('@deployedContract').text.to.contain(NODE_ONE_PUB_KEY)
    contract.expect.element('@deployedContract').text.to.contain(NODE_TWO_PUB_KEY)
    contract.expect.element('@deployedContract').text.to.not.contain(NODE_THREE_PUB_KEY)
    contract.toggleExpand()

    contract.testContractMethods('0', '123')
  },

  'Interact with contract from node 2': function (browser) {
    // connect to node 2
    browser.page.network()
      .edit()
      .setQuorumEndpoint(rpcUrl(NODE_TWO_HOST))
      .setTesseraEndpoint(rpcUrl(NODE_TWO_TESSERA))
      .save()
      .expect.element('@status').text.to.contain('Connected').before(15000)

    browser.page.deploy()
      .setAddress(PRIVATE_ADDRESS)
      .attach()

    const contract = browser.page.contract()
    contract.expect.element('@deployedContract').to.be.visible.before(15000)

    contract.testContractMethods('123', '333')
  },

  'Fail to interact with contract from node 3': function (browser) {
    browser.page.network()
      .edit()
      .setQuorumEndpoint(rpcUrl(NODE_THREE_HOST))
      .setTesseraEndpoint(rpcUrl(NODE_THREE_TESSERA))
      .save()
      .expect.element('@status').text.to.contain('Connected').before(15000)

    const deploy = browser.page.deploy()
    deploy.setAddress(PRIVATE_ADDRESS)
      .attach()
    browser.expect.element('#error-container').text.to.contain('Contract does not exist at').before(10000)

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
