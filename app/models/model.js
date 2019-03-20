const EventEmitter = require('events');

module.exports = class Model extends EventEmitter {
  constructor() {
    super();
  }
}
