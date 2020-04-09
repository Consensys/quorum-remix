const EventEmitter = require('events')
const targetOrSelector = require('../helpers/testHelper').targetOrSelector

class clickItemIfExists extends EventEmitter {
  command (target) {
    const self = this
    this.api.execute(function (id) {
      const item = document.querySelector(id)
      if(item) {
        item.click()
      }
    }, [targetOrSelector(target)], () => self.emit('complete'))
    return this
  }
}

module.exports = clickItemIfExists
