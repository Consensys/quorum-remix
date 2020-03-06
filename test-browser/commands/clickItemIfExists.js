const EventEmitter = require('events')

class clickItemIfExists extends EventEmitter {
  command (id) {
    const self = this
    this.api.execute(function (id) {
      const item = document.querySelector(id)
      if(item) {
        item.click()
      }
    }, [id], () => self.emit('complete'))
    return this
  }
}

module.exports = clickItemIfExists
