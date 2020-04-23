const elements = {
  quorumRpc: '#geth-endpoint',
  tesseraEndpoint: '#tessera-endpoint',
  edit: '#network-form .fa-pencil',
  save: '#network-form .fa-check',
  status: '#connection-status',
}

const commands = [{
  setQuorumEndpoint: function (url) {
    this.clearValue('@quorumRpc')
    return this.setValue('@quorumRpc', url)
  },
  setTesseraEndpoint: function (url) {
    return this.clearValue('@tesseraEndpoint').setValue('@tesseraEndpoint', url)
  },
  save: function () {
    return this.click('@save')
  },
  edit: function () {
    return this.click('@edit')
  }
}]

module.exports = {
  commands,
  elements,
}
