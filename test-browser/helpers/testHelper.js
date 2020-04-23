// placeholder file
module.exports.targetOrSelector = function targetOrSelector(target) {
  return typeof target === 'object' ? target.selector : target
}
