const EventEmitter = require('events')
const { targetOrSelector } = require('../helpers/testHelper')

class ScrollInto extends EventEmitter {
  command (target) {
    this.api.perform((client, done) => {
      let selector = targetOrSelector(target)
      _scrollInto(this.api, selector, () => {
        done()
        this.emit('complete')
      })
    })
    return this
  }
}

function _scrollInto (browser, target, cb) {
  browser.execute(function (target) {
    document.querySelector(target).scrollIntoView(({block: 'center'}))
  }, [target], function () {
    cb()
  })
}

module.exports = ScrollInto
